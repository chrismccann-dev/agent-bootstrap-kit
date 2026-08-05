# Enforcement, Audit & the Gotchas

*Read this when the repo is big enough that prose reminders stop working - when you need
deterministic checks, drift-tracing, and the hard-won gotchas, not more good intentions.*

This lesson is the second-order machine - the stuff that keeps the substrate honest as it grows.
It's the highest-value, least-obvious material in the kit. None of it is needed on day one; all of
it earns its place once the repo is big enough to drift behind your back.

---

## 1. Check-scripts-as-enforcement (the most important pattern)

**Prose is insufficient.** Any invariant you state only in CLAUDE.md will eventually be violated
silently. For each invariant you actually care about, write a deterministic `check:*` script that:
- **fails non-zero** when the invariant is broken,
- **prints exactly what drifted** (not just "failed"),
- runs in **CI on every PR**, plus a **daily cron** as the catch-all for things that bypass PR CI.

The recurring classes of drift that each deserve a script (generalize to your repo):

| Invariant | What the script checks |
|---|---|
| **Doc links resolve** | Every internal doc link points at a real file; every `#anchor` exists. |
| **Index completeness** | Every doc file is referenced from the Documentation Index. |
| **Doc size caps** | No always-loaded doc exceeds its tripwire (see §3). |
| **Schema ↔ types parity** | Every DB column on a modeled table is typed in code. |
| **Migrations applied** | Every migration file has actually been applied to the live DB. |
| **Bundle/trace completeness** | Every runtime-read file is included in the deploy bundle. |
| **Registry ↔ source parity** | The code mirror matches the authored source-of-truth list. |
| **Tool/surface count** | The count of registered tools/endpoints matches the manifest (catches a registration that didn't take). |

The meta-lesson, learned the hard way more than once: **a rule that bit you twice should become a
script, not a third prose reminder.** The script is the enforcement; the prose is just
documentation of the script.

*Example:* an internal doc link broke silently in review more than once. The fix wasn't "remember
to check links" - it was a `check:doc-links` script that resolves every link + `#anchor` and fails
CI the instant one 404s. The reminder stopped being needed.

Pattern for the scripts themselves: they should be *informational where judgment is needed*
(print hotspots, don't fail the build) and *gating where the answer is binary* (broken link →
fail). Don't make a judgment-call check gate CI; you'll just train yourself to ignore it.

### Pick your FIRST check by the pain most likely in THIS repo

Don't open with a general CI suite. The most valuable first check is the one that catches the drift
*this specific repo* is most prone to:
- **Doc-heavy / agent-substrate repo** → internal links resolve + required docs exist (include
  untracked-but-staged markdown during local work).
- **DB-heavy repo** → migration ↔ schema parity (every migration applied; every column typed).
- **Deploy-heavy repo** → runtime bundle / build integrity (every runtime-read file traced into the
  deploy).

Add the rest as those surfaces grow. **Field caveat:** wiring a check into CI can be blocked by auth
scope - a GitHub token without `workflow` scope will have its push *rejected* if it adds
`.github/workflows/*.yml`. Ship the **local** `npm run check:*` script first (that's the actual
enforcement) and add the CI hook once auth allows. (More on existing-repo rollout in lesson 07.)

---

## 2. The cross-system / "actor-trace" audit

The single most repeated bug pattern: **a change to shared substrate updated in one place and not
the others.** The fix is a discipline, not a tool: before declaring a substrate change done, trace
it through every *actor* (reader/writer) that the change touches.

First, identify your actors. In a typical agent-driven product they are something like:

| Actor | Reads | Writes |
|---|---|---|
| **Human** | the docs + the rendered product | authors source data; sets direction |
| **Operational prompts** | loaded at flow start | agent edits |
| **External client config** (if any: a separate chat/web client) | reads your tool/resource catalog at runtime | human edits in that client's UI |
| **Integration layer** (MCP server / API) | exposes tools + resources | agent edits |
| **The agent's own context** (CLAUDE.md + docs + memory) | read at session start | agent edits |
| **The app** (schema + UI + code mirrors) | renders to the human | agent edits |

Then, for any substrate change, walk the template:

```
Did this change land in...
[ ] the schema / types / migration?           (and is the migration actually APPLIED to prod?)
[ ] the integration layer's tool + resource descriptions?
[ ] the agent's instructions (CLAUDE.md / the right doc / memory)?
[ ] the operational prompts that use this field/vocabulary?
[ ] the external client's view (will it see the new tool on next catalog refresh)?
[ ] the human-facing rendered surface, coherently?
Skip a hop only if it genuinely doesn't apply - and say so explicitly.
```

A "substrate change" = a new term, schema field, tool, enum value, registry entry, page, type, or
prompt vocabulary word - anything that propagates beyond the file you edited. **Audit at
change-time, not as monthly cleanup.** The bug is always a hop you skipped.

Two named directions of substrate change, both subject to the audit:
- **Substrate→substrate:** a workflow output generates structured edits to a doc, applied through a
  review/arbiter step. Closed loop.
- **Practice→substrate:** lived practice has drifted from the documented model; a cross-party audit
  surfaces the gap; the output becomes doc/ADR updates. This is what grill-with-docs catches.

---

## 3. Tripwires for always-loaded context

Always-loaded docs compete for the agent's attention budget. Defend it with **size caps that fire
a script** (§1) and a registry of what's capped.

The pattern:
- Maintain a **tripwire registry** (`docs/architecture/doc-tripwires.md`) listing each
  always-loaded surface and its cap, loading-profile-aware (a doc read every session gets a
  tighter cap than one read on-demand).
- `check:doc-sizes` fails when any surface is over cap; daily cron is the catch-all.
- A firing tripwire triggers a **manual, interpretive pruning exercise** - the *trigger* is
  automated, the *prune* stays operator-led (judgment about what to extract vs cut).
- The prune move is almost always **"extract detail to an on-demand doc + leave a thin
  index/redirect stub,"** not "delete." Split by loading profile (principle 8).

Other tripwires worth registering: tool count crossing a threshold (→ consolidate tools), memory
index size (→ run consolidate-memory), a single file's churn × size (→ architecture-review it).

Two scale refinements (details in lesson 08 §3):
- **Tier the caps by loading profile** rather than one uniform number - a doc read every session
  gets a tight cap; a deep-reference doc read on demand can be several times larger.
- **Size caps only catch bloat; they miss rot.** A doc can stay under cap while filling with
  stale, superseded, or over-detailed sections that bury the content that's doing real work. Pruning -
  extract / split / consolidate / archive / re-scope / delete - is a first-class periodic
  operation, not just the response to a firing tripwire.

---

## 4. Canonical registries (controlled vocabularies)

If your domain has controlled lists (statuses, categories, taxonomies), the pattern that scaled:
- The **authored markdown is the source of truth.** Humans read and edit it.
- A **code mirror** (`lib/*-registry.ts`) is the validation copy used at write-time.
- Adding an entry is a **deliberate 2-step edit** (markdown + mirror), never a silent code change.
- **Never edit the registry mid-write to unblock a bad write.** Instead, have an *override path*
  that accepts the value provisionally and *queues it for promotion* through review. Editing the
  canonical list to dodge a validation error is how junk becomes canonical.
- A new canonical entry **silently attracts** future unaliased writes that share its prefix/shape -
  add defensive aliases when you add one.

---

## 5. The gotchas (hard-won, generalizable)

- **Verify end-to-end, not by render.** A UI that displays is not a feature that works. Paste real
  input, trigger the real write, inspect the persisted result. "It rendered" hides write-path bugs.
  And scope the claim: local, CI-on-tracked-state, deployed, and live-verified are different
  planes - attest to the one you actually hit, and name what wasn't checked (lesson 09 §3).
- **Query the live state before trusting a spec.** A spec that says "expected zero of X" gets
  verified against the actual data before you build on it. A surprising number of specs are written
  against a phantom column / an assumed-empty table that isn't.
- **Migration drift.** A migration file committed but never applied to the live DB is a top
  recurring failure. Make every migration self-register a receipt, and gate on file-vs-applied
  diff. At build kickoff, if your work rests on a prior migration, *verify the column actually
  exists in prod* before building on it.
- **Runtime-read files must be in the deploy bundle.** Static analysis won't trace a file you read
  via `fs` at runtime; it'll work locally and 500 in production. Explicitly include such files in
  the deploy trace, and script-check the inclusion.
- **External catalog caching.** If a separate client (a web chat client, etc.) consumes your tool
  catalog, it may cache it. A newly-shipped tool isn't callable there until a fresh session
  re-handshakes. After shipping a tool, confirm the count moved and force a fresh client session
  before assuming it's live.
- **Worktree / branch hygiene.** Verify the branch is current with main before starting (many PRs
  may have landed). Never reset a branch without checking the reflog for recoverable work. Removing
  a worktree keeps the branch ref - only *uncommitted* work is at risk.
- **Single write path, enforced.** Re-stating principle 3 as a gotcha: the moment you allow a
  second input path "just this once," you've lost the ability to enforce invariants. Add the
  override-and-queue path instead.

---

## 6. The autonomy contract (operationalized)

The behavioral rule that removed the most friction, stated precisely:

- **Approved / planned work** → execute fully and autonomously (commit, push, PR, merge as one
  flow). No second sign-off round. Ending a finished-implementation message with "ready for review?"
  when the decision was already made just wastes a round-trip.
- **Unscoped / ambiguous / interpretive work** → ask first. Here the human's input is the signal.
- **Destructive or irreversible decisions** → escalate regardless of mode.
- **Grilling sessions are always ask-don't-ship** - never let an execution-shaped habit (or an
  execution-shaped kickoff brief) push an unmade decision into shipped code. Tag the mode in the
  brief so the next session knows which contract it's under.

The recovery mechanism when a grilling session *does* over-ship: a "ratification queue" - list the
calls that got made without sign-off and re-confirm them at the next interpretive session. Cheaper
than preventing every instance perfectly.

Once agents write to the substrate routinely, the contract graduates from two modes to a
**per-skill autonomy ladder with numeric thresholds** - every write reviewed → routine writes
auto-apply → auto-apply with sampling - where promotion is earned (N consecutive
approved-without-edits runs), demotion is mechanical (override rate over a threshold drops a
stage), and both are measured from a structured log of human overrides. See lesson 08 §§6-7.

---

## TL;DR of the second-order machine

1. Turn every invariant-that-bit-you into a **failing CI script** that names what drifted.
2. **Trace every substrate change through all actors** before calling it done.
3. **Cap always-loaded context**; auto-detect overflow, prune by hand, extract-don't-delete.
4. **One source of truth per controlled list**; override-and-queue, never edit-to-unblock.
5. **Verify against live state and end-to-end**, never by render or by spec-assumption.
6. **Two autonomy modes, tagged explicitly**; execute the approved, ask the ambiguous.

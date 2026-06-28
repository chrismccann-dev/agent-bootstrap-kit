# The 10 Load-Bearing Principles

These are the ideas that, in hindsight, did the most work. Mechanism comes later; this is the
mental model. Each is stated generically with the reasoning, so you can re-derive the specifics
for a new domain.

---

## 1. The repo is a substrate, not just a codebase

Code is one consumer of the repo. The others are: the agent's system prompt, reference docs,
skill definitions, the agent's memory, and any external surface (an MCP server, a separate
chat/web client, CI). A change to a shared *concept* — a term, a schema field, a workflow rule —
propagates to all of them. **Treat shared vocabulary and shared schema as first-class artifacts
that must stay coherent across every reader.** Most bugs in an agent-driven system are not logic
bugs; they're a definition that got updated in one place and not the others.

## 2. Documentation compounds; it is not generated

The valuable docs are *living* — hand-edited when the mental model shifts, patched incrementally
by the agent, never bulk-auto-generated. They get better edit-by-edit, the way a codebase does.
Corollary: a doc that's regenerated from scratch each time carries no accumulated judgment.
Design your docs to be appended to and pruned, not regenerated.

## 3. One canonical input path per kind of data

Pick exactly one write path for each class of data and deprecate all the side doors (manual
inserts, forms, paste-into-spreadsheet, etc.). When there's one path, you can validate, enforce
invariants, and reason about provenance. When there are five, every one is a place for bad data
to enter. This is painful to enforce early and priceless later.

## 4. Prose is insufficient — the script is the enforcement

Any rule you actually care about ("docs links must resolve", "every migration is applied",
"this doc must stay under N KB", "every schema column is typed") will be violated unless a
deterministic check fails the build / CI when it's broken. Write a `check:*` script for each
invariant, wire it to CI (and a daily cron as a catch-all), and make it print *what* drifted.
A rule that lives only in prose is a rule that will silently rot. This single principle caught
the most recurring class of bug.

## 5. Plan before you code, in proportion to interpretive risk

For anything with a "make it better" shape — a redesign, an ambiguous feature, a mockup — stop
and surface your interpretation *before* editing files. Present 2-3 options with tradeoffs and a
recommendation, not one silent pick. The cost of a wrong plan is multiplied by every file you
already touched. "Simple" tasks are exactly where unexamined assumptions waste the most work.

## 6. State success criteria before implementing

Turn vague tasks into verifiable goals: "add validation" → "these cases pass: X / Y / Z." Strong
criteria let the agent self-loop without constant clarification; weak criteria force endless
back-and-forth. No placeholders in a plan — no "TBD", "handle errors appropriately." Concrete
content or the step doesn't ship.

## 7. Autonomy is earned per-decision, and grilling ≠ executing

Two modes, and conflating them is a known failure:
- **Executing**: the plan is approved / the call is already made. Run it end-to-end — commit,
  push, open PR, merge — without a second sign-off round. Asking again wastes a round-trip.
- **Grilling / interpretive**: the decision is *not* yet made. Here the human's input is the
  load-bearing signal. Default to "ask, don't ship." Do not let an execution-shaped habit push
  unmade decisions into shipped code.

The skill of an agent system is knowing which mode you're in. Make it explicit in the handoff.

## 8. Always-loaded context has a budget; defend it

The agent's system prompt and any "read every session" docs compete for a finite attention
budget. Set hard size caps (tripwires). When a doc crosses its cap, *split it by loading
profile* — pull the high-detail, rarely-needed material into on-demand reference docs and leave
a thin index + redirect stub behind. The goal: a fresh session loads only what it needs to act,
and can pull the rest on demand. An always-loaded doc that's mostly irrelevant to the current
task is a tax on every single session.

## 9. Close the loop: retro → docs → next-session handoff

Every non-trivial unit of work ends with three artifacts: (a) a retro (what surprised us, what
we'd do differently), (b) the doc/memory updates that the retro makes obvious, and (c) a
paste-ready kickoff brief for the next session (problem, goal, scope, entry point, files,
verification plan, open questions). The handoff is what lets the next session start with
situational awareness instead of rediscovery. This is how a single-threaded agent gets
continuity across context resets.

## 10. Delegate with explicit handoffs; one session stays the coordinator

For work too large for one context: a coordinator session decomposes the work, spawns sub-agents
with self-contained briefs, and rolls up + reviews their output. The brief must stand alone — the
sub-agent has none of the coordinator's conversation. The coordinator owns the conclusion, not
the raw output. This is the same pattern whether it's sub-agents in one session or separate
sessions across days.

---

### The meta-principle

**Build the machine that keeps the substrate honest, not just the product.** Half of these
lessons are second-order: they're about detecting and correcting drift in the system that builds
the product. In a single-developer, agent-heavy setup, that second-order machine is what lets you
scale past what one person can hold in their head.

### A guardrail that pairs with it: don't productize too early

Hardening the *source docs* of a workflow does not mean turning every workflow into an app. A repo
with rich documented workflows makes it tempting for an agent to "helpfully" propose a CMS, a
database, or a broad platform around them. Resist it. Source-doc coherence makes agents harder to
confuse; it is not a mandate to build software around every process. App-ification is its own
deliberate decision, routed through planning (principle 5) — not a side effect of writing a
glossary. (Most relevant when adopting the kit into an existing repo — see chunk 07.)

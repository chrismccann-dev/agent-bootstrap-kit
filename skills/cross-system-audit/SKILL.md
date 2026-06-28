---
name: cross-system-audit
description: >
  Before declaring a substrate change done, trace it through every actor (reader/writer) it touches
  — schema, types, integration layer, agent instructions, prompts, external clients, the UI — so it
  doesn't get updated in one place and not the others. Use whenever a change introduces or alters a
  shared term, schema field, tool, enum value, registry entry, page, type, or prompt vocabulary.
  Trigger phrases: "audit this change", "did I update everywhere", "cross-system check before PR".
---

# cross-system-audit

The single most repeated bug pattern in an agent-driven system: **a change to shared substrate
updated in one place and not the others.** This skill is the discipline that catches it — run it
*at change-time*, before the PR, not as monthly cleanup.

## What counts as a "substrate change"

Anything that propagates beyond the file you edited: a new/changed **term**, **schema field**,
**tool/endpoint**, **enum value**, **registry entry**, **page**, **type**, or **prompt vocabulary
word**. If it's purely local to one file, skip this skill.

## Step 1 — Identify your actors

List the readers/writers of shared substrate in *this* repo. A typical agent-driven product has
something like:

| Actor | Reads | Writes |
|---|---|---|
| Human | the docs + the rendered product | authors source data; sets direction |
| Operational prompts | loaded at flow start | agent edits |
| External client config (a separate chat/web client, if any) | your tool/resource catalog at runtime | human edits in that client's UI |
| Integration layer (MCP server / API) | exposes tools + resources | agent edits |
| The agent's own context (CLAUDE.md + docs + memory) | read at session start | agent edits |
| The app (schema + UI + code mirrors) | renders to the human | agent edits |

Adapt the list to your system. The point is to enumerate *every consumer* of the thing you changed.

## Step 2 — Walk the trace

For the change, check each hop. Skip a hop only if it genuinely doesn't apply — and **say so
explicitly** (an unexamined skip is how the bug hides):

```
[ ] Schema / types / migration?   ...and is the migration actually APPLIED to the live DB?
[ ] Integration layer — tool input schema + tool description + matching resource description?
[ ] Agent instructions — CLAUDE.md / the right doc / the glossary / memory reflect the new vocab?
[ ] Operational prompts — flows that use this field/vocabulary use it correctly?
[ ] External client — will it see the new tool/resource on its next catalog refresh? (caches!)
[ ] Human-facing rendered surface — does it read coherently to the human?
```

## Step 3 — Report

State, per hop: updated / N-A-because-X / **still-needs-doing**. Anything in the third bucket is a
blocker on the PR. The bug is always a hop you skipped.

## Companion checks (the deterministic ones)

This skill is the human-judgment layer. Back it with scripts where the answer is binary — these
should fail CI, not rely on this skill being run:
- doc links resolve; every doc is in the index
- schema columns are all typed in code
- migrations file-set == applied-set
- runtime-read files are in the deploy bundle
- code registry mirror == authored source-of-truth list

See `lessons/06-enforcement-and-audit.md` for the full list. **A rule that bit you twice should
become a script, not a third prose reminder.**

## Two named directions, both audited

- **Substrate→substrate:** a workflow output generates structured doc edits, applied via a
  review/arbiter step.
- **Practice→substrate:** lived practice drifted from the documented model; a cross-party grill
  (`grill-with-docs`) surfaces the gap; the output is doc/ADR updates.

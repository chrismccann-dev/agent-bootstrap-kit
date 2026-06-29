---
name: coordinator-spawn
description: >
  Delegation with explicit handoffs: one session stays the coordinator, decomposes the work, spawns
  sub-agents/sessions with self-contained briefs, and rolls up + reviews their output. Use when a
  job won't fit one context, decomposes into independent parallel pieces, or benefits from
  independent verification (spawn N skeptics to refute a finding). Trigger phrases: "this is too big
  for one pass", "fan this out", "coordinate sub-agents", "delegate and review".
---

# coordinator-spawn

Context is finite; a big job done in one window degrades as it fills. This skill keeps one session
as the **coordinator** that decomposes, delegates, and judges - while the actual work happens in
fresh, briefed sub-contexts that never see each other.

This is the same primitive as `plan-then-implement`'s large-scale implement phase, and the same
shape whether the workers are sub-agents in one session or separate sessions across days.

## When to reach for it

- The task won't fit one context (a migration across many files, a repo-wide audit).
- It decomposes into **independent** units that can run in parallel.
- You want **independent verification** - e.g. spawn several skeptics to try to refute a finding
  before you trust it.

## Procedure (as the coordinator)

1. **Decompose into independent units.** Each unit should be doable without the others' results. If
   unit B needs unit A's output, that's a pipeline, not a fan-out - sequence it explicitly.

2. **Write a self-contained brief per unit.** The sub-agent has **none** of your conversation.
   Include:
   - the goal and the success criteria,
   - the exact files/paths and any context it needs,
   - constraints (don't touch X; match the style of Y),
   - **what to return** - "return a structured result: {finding, file, line, confidence}", not "go
     fix it." Workers should return *conclusions*, not raw file dumps.

   *Bad brief (leaky, vague):* "Continue the work from above and audit the docs."
   *Good brief (cold, scoped, structured):* "Read `PRODUCT.md`, `GLOSSARY.md`, and
   `docs/architecture/data-model.md`. Return a table of `{term, current definition, conflicting
   usage, recommended action}`. Do not edit files." The good one stands alone and tells the worker
   exactly what shape to return.

3. **Spawn.** Run independent units in parallel. If workers mutate files concurrently, isolate each
   in its own worktree to avoid conflicts.

4. **Roll up - and judge, don't concatenate.** Read each result, reconcile conflicts, drop the ones
   that don't hold up, dedupe overlap. The coordinator **owns the final conclusion.** A roll-up that
   just pastes every worker's output together has skipped the actual job.

5. **Verify the synthesis.** For high-stakes findings, run an adversarial pass: spawn verifiers
   prompted to *refute* each surviving claim; keep only what survives a majority.

6. **Hand back to the human** at the decision points your autonomy contract reserves - irreversible
   or interpretive calls.

## Anti-patterns

- **Leaky briefs.** "Continue what we discussed" - the sub-agent didn't discuss anything. Brief
  cold, every time.
- **Workers that return prose, not data.** Ask for structured results so the roll-up is mechanical.
- **Coordinator that loses the thread.** The whole point is that one context stays authoritative.
  Don't let the coordinator start doing the unit-work itself and forget to review.
- **Fan-out where a pipeline was needed.** If results depend on each other, sequencing beats
  parallelism.

## Output

A single synthesized result the coordinator stands behind, plus a note of which units were dropped
or downgraded and why (silent truncation reads as "covered everything" when it didn't).

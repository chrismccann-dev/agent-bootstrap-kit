---
name: self-improving-skill
description: >
  At the end of any skill invocation, look back at that skill's own SKILL.md and propose small,
  additive improvements based on the friction just encountered — so skills compound like docs do.
  Use as the closing step of every other skill, or when a skill felt awkward / underspecified /
  missing a gotcha mid-run. Trigger phrases: "improve this skill", "what was awkward about that
  skill", "update the skill from what we just learned".
---

# self-improving-skill

The first version of any skill is wrong in ways you only discover by running it. Bake the
improvement loop in, and each skill converges on something good without a dedicated "go improve the
skills" project. A skill run 20 times and improved each time is dramatically better than its v1 —
for free.

## When

Run this as the **closing step of every other skill**, and any time a skill's instructions felt
underspecified, ambiguous, or missing a warning mid-run.

## Procedure

1. **Reflect on the run just completed.** Ask concretely:
   - Where did the instructions leave me guessing? What did I have to infer that should've been
     stated?
   - What gotcha did I hit that the skill didn't warn about?
   - Was there a step that's now dead / never applies / actively misleading?
   - Did I do something well that the skill should *prescribe* next time, not leave to luck?

2. **Propose a concrete edit to the `SKILL.md`.** Small and additive by default: a clarified step, a
   new gotcha bullet, a removed dead branch, a sharpened trigger description. Show the diff.

3. **Apply per the autonomy contract.** A self-edit to a skill is a tiny, low-risk improvement —
   apply it directly if your contract allows, or surface it for one-line approval. Don't sit on it;
   the value is in capturing the friction while it's fresh.

4. **Treat the edit as a substrate change.** If the skill is referenced by other skills or by
   `CLAUDE.md`, check those references still hold (see `cross-system-audit`). Renaming a skill or
   changing its trigger is exactly the kind of change that drifts silently.

## Guardrails

- **Additive over rewrites.** Don't refactor a working skill into something unrecognizable off one
  run's friction. Accumulate small improvements; let the shape emerge.
- **Don't over-fit to one weird run.** If the friction was a one-off (bad input, unusual repo), note
  it but don't bake a special case into the general skill.
- **Keep the trigger description honest.** The `description:` field is how the agent decides to reach
  for the skill — if you found yourself wanting this skill and it didn't trigger, fix the
  description, not just the body.

## Output

A committed (or proposed) edit to the skill's `SKILL.md`, plus a one-line note of what friction
drove it.

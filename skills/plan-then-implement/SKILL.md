---
name: plan-then-implement
description: >
  The core build loop: separate deciding WHAT to build from building it. Use for any non-trivial
  change — enter with a plan (questions + 2-3 options + a recommendation), agree, then implement
  against explicit success criteria. Scales: one session for small work, plan-session-then-build for
  medium, coordinator + sub-agents for large. Trigger phrases: "plan this", "let's build X", "how
  should we approach Y", any feature/redesign/ambiguous task.
---

# plan-then-implement

The single most important process pattern: **decide what to build before building it.** The cost of
a wrong plan is multiplied by every file you already touched, so the plan is where the leverage is.

## Pick the altitude

| Size | Flow |
|---|---|
| **Small / concrete** (specific file, specific fix) | One session. Brief plan stated → agreed → implement → verify. |
| **Medium / interpretive** | Plan mode → written plan lands in `docs/features/<feature>.md` → human approves → same session implements. |
| **Large / needs decomposition** | Plan produces a decomposition → hand to `coordinator-spawn` (sub-agents per workstream, rolled up + reviewed). |

When in doubt, plan. "Simple" is exactly where unexamined assumptions waste the most work.

## Phase 1 — Plan

1. **Ask before drafting.** Get the source material and the interpretive questions answered first.
   Don't draft a plan on top of guesses.
2. **For anything interpretive, enter plan mode and surface your interpretation before editing any
   file.** A redesign / "make it better" / mockup is interpretive by definition.
3. **Present 2-3 options with tradeoffs and a recommendation** when the approach is non-obvious — not
   a single silent pick. If a prior decision already settled this, surface it as the recommended
   option.
4. **State success criteria.** Turn the vague task into verifiable cases: "add validation" → "these
   inputs pass: X / Y / Z; these fail: A / B." Strong criteria let you self-loop; weak ones force
   back-and-forth.
5. **No placeholders in the plan.** No "TBD", "TODO", "handle errors appropriately." Concrete content
   or the step doesn't ship.
6. Get explicit approval.

## Phase 2 — Implement

- Once the plan is approved, **run it end-to-end** — this is EXECUTING mode, the autonomy contract
  applies: commit, push, open PR, merge as one flow when ready. Don't stop to re-ask "should I
  commit?" — that decision was made at approval.
- Implement against the success criteria, not vibes.
- **Verify before committing** (see `simplify-pass` and your project's verify skill): for UI,
  screenshot each change; for logic, run it end-to-end with real input and inspect the persisted
  result. "It should work" is not verification.
- **Simplify pass** before commit (`simplify-pass`).
- If the change touched shared substrate, run **`cross-system-audit`** before opening the PR.

## Phase 3 — Close the loop

- **Retro before docs:** list what didn't work / what surprised us / what we'd do differently. The
  doc updates then write themselves.
- Update the docs/glossary/memory the change invalidated; tick the roadmap + add a `shipped.md` line
  in the same change.
- **Write a paste-ready kickoff brief for the next session:**

```
Problem:        [the friction being closed, one line]
Goal:           [1-2 sentences]
Scope:          in: [...]  out: [...]
Entry surface:  [which skill/session the next session enters through]
Files likely:   [paths]
Verification:   [how we'll know it works]
Open questions: [only genuinely-unresolved items]
Mode:           EXECUTING (autonomy applies) | GRILLING (ask, don't ship) | COORDINATING (delegate + own the synthesis)
```

## The synthesis seam

When the brief follows a planning discussion or a grill, write it as a **synthesis of decisions
already made**, not a fresh interview. Pull every resolved decision in; list under "open questions"
only what's genuinely still open. The interview already happened — don't relitigate it.

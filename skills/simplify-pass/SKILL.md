---
name: simplify-pass
description: >
  A quality-only pass over the code you just changed — hunt for duplication, over-engineering, copy-
  paste-at-a-distance, and needless abstraction, then simplify. Not a bug hunt; correctness is a
  separate review. Run once per unit of work, after implementation is done, before commit. Trigger
  phrases: "simplify this", "clean up before commit", "did I over-engineer this", "dedup pass".
---

# simplify-pass

Agents over-engineer: duplicate JSX across pages, inline IIFEs, copy-pasted constants, abstractions
introduced for a single caller. Run one deliberate simplify pass after implementation and before
commit, so it never becomes tech debt. **Quality only — this does not hunt for correctness bugs;
that's a separate review.**

## When

Once per unit of work, after the implementation is done and verified, before the commit step.
Especially important when the work touched 2+ files that now share a rendering or logic pattern.

## Procedure

1. **Read the whole changed file(s), not just the diff.** Duplication usually sits 100+ lines from
   the line you changed — a constant you re-declared, a helper that already exists, a block you
   pasted from a sibling page. A diff-only view misses it every time.

2. **Hunt for these specific smells:**
   - **Duplication at a distance** — the same logic/markup in two files, or twice in one file. Pull
     it into one shared helper/component.
   - **Reinvented primitives** — you wrote something the codebase already has. Use the existing one.
   - **Copy-pasted constants** — thresholds, colors, magic values inlined in multiple places. One
     canonical source, imported.
   - **Premature abstraction** — a factory/generic/config for a single caller. Inline it until
     there's a second caller.
   - **Inline complexity** — IIFEs, deeply nested ternaries, clever one-liners that a named function
     would make obvious.

3. **Simplify, preserving behavior.** Each change must be behavior-neutral — this is a cleanup pass,
   not a feature change. Re-verify after if you touched anything load-bearing.

4. **Know when to stop.** Don't gold-plate. The goal is "no obvious duplication or over-engineering,"
   not maximal cleverness. A little repetition is better than the wrong abstraction.

## Guardrails

- **One canonical rule per recurring decision.** If you find the same threshold/color/format decided
  in three places, that's the signal to make one helper ("one helper per system") and import it —
  not to tidy each copy.
- **Don't fold genuinely-different things together** just because they look similar today. Coupling
  two things that will diverge is worse than the duplication.

## Output

A cleaned working tree with a one-line note of what was deduped/simplified, ready for commit.

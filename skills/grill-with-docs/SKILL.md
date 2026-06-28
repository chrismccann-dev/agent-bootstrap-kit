---
name: grill-with-docs
description: >
  Stress-test a plan or a new concept against the existing domain model and documented decisions,
  sharpen terminology, and update the glossary / ADRs inline as decisions crystallize. Use when
  introducing or touching shared vocabulary, when a plan rests on a term that might mean different
  things to you and the agent, or at the start/end of a feature that adds a new concept. Trigger
  phrases: "grill this", "grill with docs", "does this match our model?", "stress-test this plan".
---

# grill-with-docs

A grilling session builds and defends **shared understanding**. Precise shared vocabulary is the
highest-leverage investment in an agent-driven repo — it's how you and the agent stop talking past
each other and how the agent stays consistent across sessions. This skill is the antidote to silent
definition drift.

## This is a GRILLING session, not an executing one

The human's input is the load-bearing signal. **Default to "ask, don't ship."** Do not let an
execution-shaped habit push an unmade decision into a doc or into code. The autonomy rule (run
approved work without re-asking) does NOT apply here.

## Procedure

1. **Read the actual docs first.** Before asserting what the model says, `grep`/read the glossary,
   relevant ADRs, and `PRODUCT.md`. Cite what you find. Never reconstruct the model from memory —
   that's how confabulation enters the record. If you can't find it, say "this isn't documented"
   rather than inventing it.

2. **Challenge the plan/concept against the documented model.** For every domain term the human
   used, ask:
   - Is this the **same** term already defined in the glossary, or a new sense of it? If new, that's
     a collision — resolve it (rename, or redefine deliberately).
   - What is its **cardinality / relationship** to the other terms? (one-to-many? a subtype? a
     synonym?)
   - Does it contradict a documented decision (an ADR)? If so, surface the conflict — either the
     plan is wrong or the ADR needs superseding.

3. **Find the ambiguities.** Where could the human and the agent reasonably read the same word two
   ways? Name each one explicitly and ask. These are the future bugs.

4. **Crystallize decisions into the substrate, in this session.** When a definition or relationship
   settles, write it:
   - New/sharpened term → the **glossary** (strict format: definition + cardinality to other terms,
     NO implementation detail — that rots).
   - A real, hard-to-reverse trade-off that got decided → a short **ADR** (`docs/adr/NNNN-*.md`).
   - Get explicit human sign-off before writing each one.

5. **Keep a flagged-ambiguities ledger.** Anything left unresolved goes on a list (in the session
   notes or the glossary's "open questions") to drain at the next grill. Don't force-resolve;
   record and move on.

## Output

- Glossary entries added/sharpened (with sign-off).
- ADR(s) for any decided trade-off.
- A short list of ambiguities surfaced and where each landed (resolved → which doc; unresolved →
  the ledger).

## Why it matters

Most "bugs" in an agent-driven system aren't logic bugs — they're a term that meant one thing to
the human and another to the agent, or a definition updated in one place and not the others. Grill
early (before building on a term) and the whole downstream chain stays coherent. See
`cross-system-audit` for propagating a vocabulary change once it's settled.

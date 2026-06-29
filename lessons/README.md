# Lessons - the *why* behind the kit

A distilled, domain-agnostic set of lessons from building a long-running, AI-agent-driven
single-developer product. The point: drop these patterns into a new repo and skip the 6 months of
learning them the hard way. (New to the kit? Start at the [root README](../README.md) for setup;
come here for the reasoning.)

The thesis underneath all of it: **the repo is not just code - it is a substrate that an AI
agent reads, writes, and improves.** Most of these lessons are about keeping that substrate
coherent, loadable, and self-correcting as it compounds.

## How to use this kit

**Greenfield repo (no history):**
1. Read `01-principles.md` first — it's the *why*. Everything else is mechanism.
2. Copy `02-claude-md-template.md` → your repo's `CLAUDE.md` (or `AGENTS.md` / your runtime's
   always-loaded root) and fill the brackets.
3. Copy `03-product-md-template.md` → your repo's `PRODUCT.md`.
4. Set up the docs tree from `04-docs-structure.md`.
5. Stand up the skills in `05-skills-patterns.md` as you need them (don't build all of them day one).
6. Use `06-enforcement-and-audit.md` once you have enough surface area that drift becomes real.

**Existing repo (already has code + docs):** do **not** copy the template blindly — read
`07-existing-repo-adoption.md`. The sequence is inventory → thin agent index → one system doc (if
missing) → one deterministic check → `grill-with-docs` first → defer the rest. The principles
(chunk 01) are identical; only the rollout differs.

## The chunks

| File | What it covers |
|---|---|
| `01-principles.md` | The 10 load-bearing ideas. Read this even if you read nothing else. |
| `02-claude-md-template.md` | Annotated `CLAUDE.md` (agent system prompt) skeleton. |
| `03-product-md-template.md` | Annotated `PRODUCT.md` skeleton + roadmap split. |
| `04-docs-structure.md` | The `docs/` tree, ADRs, features/sprint recaps, glossary, memory. |
| `05-skills-patterns.md` | grill-with-docs, self-improving skills, plan→implement, coordinator-spawn, + others. |
| `06-enforcement-and-audit.md` | Check-scripts-as-enforcement, six-actor audit, tripwires, the gotchas. |
| `07-existing-repo-adoption.md` | Adopting the kit into a repo that already exists — the minimal adopted set, first-check-by-pain, "don't productize too early." |

## What's deliberately NOT here

- Anything domain-specific (no business logic, no schema columns, no taxonomies).
- Framework choices (Next/Supabase/etc.) — those are incidental, swap freely.
- A claim that you need all of this on day one. **Most of it earns its place only once the repo
  is big enough to drift.** Start with `CLAUDE.md` + plan→implement + grill-with-docs. Add the
  rest when you feel the specific pain it solves. Premature scaffolding is its own tech debt.

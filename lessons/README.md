# Lessons - the *why* behind the kit

A distilled, domain-agnostic set of lessons from building a long-running, AI-agent-driven
single-developer product. The point: drop these patterns into a new repo and skip the 6 months of
learning them the hard way. (New to the kit? Start at the [root README](../README.md) for setup;
come here for the reasoning.)

The thesis underneath all of it: **the repo is not just code - it is a substrate that an AI
agent reads, writes, and improves.** Most of these lessons are about keeping that substrate
coherent, loadable, and self-correcting as it compounds.

> Setup/copy commands live in the [root README](../README.md). This index is just the reading map
> for the *why*.

## The lessons - read when

| Lesson | Read when |
|---|---|
| `01-principles.md` | You want the mental model behind the kit. **Start here.** |
| `02-claude-md-template.md` | You're writing the root agent index (`CLAUDE.md` / `AGENTS.md` / equivalent). |
| `03-product-md-template.md` | You're defining what the product is, why it exists, and what should stay stable. |
| `04-docs-structure.md` | You're setting up the `docs/` tree and deciding what belongs where. |
| `05-skills-patterns.md` | You want the reusable workflows: planning, grilling, delegation, audits, handoffs. |
| `06-enforcement-and-audit.md` | The repo is big enough to drift and prose reminders aren't enough. |
| `07-existing-repo-adoption.md` | You're adding the kit to a repo that already has code, docs, and history. |
| `08-scale-lessons.md` | The substrate has scaled past the starter patterns (100+ docs, 10+ skills, agents writing constantly). |

- **New repo?** Read 01-05 first.
- **Existing repo?** Read **01 and 07 first** - and do *not* copy the greenfield template blindly.
- **Mature repo?** Read 08 when tripwires, grilling, and audits start needing second-generation
  versions - not before.

## Vocabulary used in this kit

The recurring house terms, defined once:

- **Root index** - the file your agent reads every session (`CLAUDE.md` / `AGENTS.md` / equivalent).
- **Substrate** - the shared repo material agents and humans both rely on: docs, schema, prompts,
  workflows, memory, checks.
- **Grill** - an interview-style session that locks vocabulary or decisions *before* execution.
- **Always-loaded context** - content the agent reads on every session (vs on-demand reference).
- **Actor-trace** - checking every system that reads or writes a shared concept before shipping a
  change to it.

## What's deliberately NOT here

- Anything domain-specific (no business logic, no schema columns, no taxonomies).
- Framework choices (Next/Supabase/etc.) - those are incidental, swap freely.
- A claim that you need all of this on day one. **Most of it earns its place only once the repo
  is big enough to drift.** Start with `CLAUDE.md` + plan→implement + grill-with-docs. Add the
  rest when you feel the specific pain it solves. Premature scaffolding is its own tech debt.

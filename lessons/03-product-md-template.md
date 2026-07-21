# PRODUCT.md Template (the product-system index)

*Read this if you're defining what the product is, why it exists, and what should stay stable as
the roadmap churns around it.*

Where `CLAUDE.md` is "how the agent behaves," `PRODUCT.md` is "what we're building and why."
It's the durable description of the product as a system. It is also a living doc - hand-edited
when the mental model shifts.

Key split lesson: **the high-change surfaces (roadmap, open issues) do NOT belong inside
PRODUCT.md.** They churn constantly and would bloat it and create merge noise. Split them into
their own files under `docs/product/` and have PRODUCT.md *point* at them. PRODUCT.md itself
should be stable enough that you edit it only when the model genuinely changes.

---

```markdown
# [Project Name] - Product

## Purpose

[The North Star. What does this product exist to do, for whom, and what does "winning" look like?
This should be the same North Star as CLAUDE.md's opening, expanded. If there's a deeper thesis
(why this approach, why now, what the end-state is), put it here. Everything downstream should
trace back to this.]

## Core Workflows

[The 1-3 workflows that ARE the product. For each: the trigger, the steps, where data enters,
where it lands, who/what does each step. This is the most useful section for orienting a new
session - it's the verbs of the system.]

- **[Workflow A]** - [trigger → steps → output. Note the canonical input path.]
- **[Workflow B]** - [...]

[If different workflows have different *shapes* - e.g. one is iterative/streaming, another is
batch/archival - call that out explicitly. The shape drives the architecture.]

## Product Boundaries

[What this product deliberately does NOT do. Single-tenant? No multi-user? No public API? Naming
the non-goals prevents scope creep and stops the agent from "helpfully" building things you don't
want.]

## Data Model

[The conceptual model - entities and how they relate - at a higher altitude than CLAUDE.md's
roster. Link to docs/architecture/data-model.md for column-level detail.]

## Canonical Registries / Controlled Vocabularies

[If applicable: the list of controlled axes, where each source-of-truth lives, and the rule that
the authored list is canonical and code mirrors it. Link the implementation rules.]

## AI / Synthesis (if your product uses LLMs internally)

[How the product itself calls models: which model, the pipeline shape, where prompts live, how
outputs are cached/invalidated, what vocabulary must be preserved through any rewrite passes.
Keep the every-session shape here; push prompt-engineering detail to a reference doc.]

## Current App State

[A short "where are we" - what's shipped and live, what's stubbed, what's deprecated. This drifts,
so keep it terse and date-stamped, or push it to the roadmap/shipped log entirely.]

## Design System

[One paragraph + a pointer to the full design doc. Don't duplicate the token map here.]

## Architecture

[Conceptual architecture - the boxes and arrows. Link CLAUDE.md / docs for the concrete stack.]

## Roadmap

→ Lives in **[docs/product/roadmap.md](docs/product/roadmap.md)** (current + next + future only).
This file does not hold the roadmap - it points at it. [See "Roadmap hygiene" below.]

## Open Issues / Known Gaps

→ Lives in **[docs/product/issues.md](docs/product/issues.md)**.

## Scaling Watch-Items / Split Triggers

[The thresholds at which you'll need to refactor the *substrate* (not the product): "when
CLAUDE.md crosses N KB, split it"; "when tool count crosses N, consolidate"; "when this doc
crosses N KB, prune." This is the tripwire registry's home. See lesson 06.]
```

---

## The roadmap split (do this early)

Keep the roadmap as its own file, `docs/product/roadmap.md`, with three live sections only:

```markdown
# Roadmap

## Active (in flight now)
- [item - one line, link to the feature/sprint doc]

## On deck (next up)
- [...]

## Future / Brainstorms (someday, unscoped)
- [...]

## Roadmap hygiene
- A shipped item moves OUT of Active and INTO docs/sprints/shipped.md as soon as MERGE EVIDENCE
  exists - and not before. A closed sprint lingering in Active implies work that doesn't exist;
  a "shipped" line written pre-merge is a ledger claiming things that may never land.
```

The discipline that matters: **the roadmap tick and the `shipped.md` line are written against
merge evidence, atomically with each other.** In a high-trust flow where implement → merge is
one motion, "the same change" works because the change lands *by merging*. Under a review-gated
policy, the implementation change may record "ready" or "pending merge," and the roadmap tick +
shipped line happen in a small post-merge closeout - **"shipped" means merged, not authored.**
(Deployed and live-verified are later, separate facts - see lesson 09.) Either way, do (a)
remove from roadmap and (b) add the shipped.md line in one commit, so "what's queued" and
"what's done" can't drift apart - the single most common doc-rot in a roadmap-driven repo.

## shipped.md

A reverse-chronological, one-line-per-ship ledger:

```markdown
- YYYY-MM-DD - **[Sprint/feature name]** - [the landmark, one line] (PR #NN)
```

This is the cheap, scannable audit trail. The full narrative of any ship lives in its feature
recap doc (see lesson 04); shipped.md is just the index into them.

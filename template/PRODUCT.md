# [Project Name] — Product

## Purpose

[The North Star. What does this product exist to do, for whom, and what does "winning" look like?
Same North Star as CLAUDE.md's opening, expanded. If there's a deeper thesis — why this approach,
why now, what the end-state is — put it here. Everything downstream should trace back to this.]

## Core Workflows

[The 1-3 workflows that ARE the product. For each: the trigger, the steps, where data enters, where
it lands, who/what does each step. The most useful section for orienting a new session.]

- **[Workflow A]** — [trigger → steps → output. Note the canonical input path.]
- **[Workflow B]** — [...]

[If different workflows have different *shapes* — one iterative/streaming, another batch/archival —
call that out. The shape drives the architecture.]

## Product Boundaries

[What this product deliberately does NOT do. Single-tenant? No multi-user? No public API? Naming the
non-goals prevents scope creep.]

## Data Model

[The conceptual model — entities and how they relate — at a higher altitude than CLAUDE.md's roster.
Link docs/architecture/data-model.md for column-level detail.]

## Canonical Registries / Controlled Vocabularies

[If applicable: the controlled axes, where each source-of-truth lives, the rule that authored list
is canonical and code mirrors it.]

## AI / Synthesis (if your product uses LLMs internally)

[How the product itself calls models: which model, pipeline shape, where prompts live, how outputs
are cached/invalidated, what vocabulary must survive any rewrite passes.]

## Current App State

[Short "where are we" — shipped + live, stubbed, deprecated. Keep terse + date-stamped, or push to
the roadmap/shipped log entirely.]

## Design System

[One paragraph + a pointer to the full design doc. Don't duplicate the token map here.]

## Architecture

[Conceptual architecture — boxes and arrows. Link CLAUDE.md / docs for the concrete stack.]

## Roadmap

→ Lives in **[docs/product/roadmap.md](docs/product/roadmap.md)** (current + next + future only).
This file points at it; it does not hold it.

## Open Issues / Known Gaps

→ Lives in **[docs/product/issues.md](docs/product/issues.md)**.

## Scaling Watch-Items / Split Triggers

[The thresholds at which you'll refactor the *substrate* (not the product): "when CLAUDE.md crosses
N KB, split it"; "when tool count crosses N, consolidate"; "when this doc crosses N KB, prune."
The tripwire registry's home → docs/architecture/doc-tripwires.md.]

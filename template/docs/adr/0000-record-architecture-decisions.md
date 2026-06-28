# ADR-0000: Record architecture decisions

**Status:** accepted
**Date:** [YYYY-MM-DD]

## Context

We want a durable record of decisions that are **non-obvious + hard to reverse + the result of a
real trade-off** — the kind a future reader (or agent) would otherwise undo because they don't know
why it's that way. Without this, that context lives only in someone's head or a chat log and is lost.

## Decision

Keep one markdown file per such decision in `docs/adr/`, numbered sequentially. Most ADRs are 1-3
sentences. Don't ADR the obvious; do ADR the thing that's surprising without context. When a
decision is reversed, mark the old ADR **superseded by ADR-NNNN** rather than deleting it — the
history is the value.

## Consequences

- A cheap, greppable trail of *why* the architecture is the way it is.
- A small discipline cost: remember to write one when a real trade-off gets made.

---

<!-- Copy this template for the next ADR:

# ADR-NNNN: [Decision title]

**Status:** accepted | superseded by ADR-MMMM
**Date:** YYYY-MM-DD

## Context
[The forces. What made this a real trade-off.]

## Decision
[What we chose.]

## Consequences
[What this costs, what it buys, what's now harder to change.]
-->

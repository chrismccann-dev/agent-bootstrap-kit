# [Project Name]

<!-- Delete any section that doesn't apply. The goal is a short, accurate root context, not a
complete-looking file - always-loaded context is expensive. Fuller guidance: lessons/02. -->

[2-4 sentences: what this repo is, who it serves, and the North Star.]

## Documentation Index

Foundational living docs (root level - read first):
- **[PRODUCT.md](PRODUCT.md)** - product purpose, workflows, data model, roadmap pointer.
- **[GLOSSARY.md](GLOSSARY.md)** - shared vocabulary. Every domain term defined once, here.
- **[docs/adr/](docs/adr/)** - one file per non-obvious, hard-to-reverse decision.

On-demand reference (pull when touching the relevant surface):
- **[docs/architecture/data-model.md](docs/architecture/data-model.md)** - per-column / per-relationship detail.
- **[docs/architecture/doc-tripwires.md](docs/architecture/doc-tripwires.md)** - size caps on always-loaded docs.
- **[docs/product/roadmap.md](docs/product/roadmap.md)** - current + next work. **Check here for "what's next."**

[Rule: anything the agent needs *sometimes* lives behind a link with a "read when…" note, not
inline. CLAUDE.md is the index, not the encyclopedia.]

## Shared Language

- Glossary lives in [GLOSSARY.md](GLOSSARY.md). Grown incrementally via `/grill-with-docs` sessions,
  not bulk-authored. Strict format: term definitions + cardinality relationships only - no
  implementation detail.

## Git Discipline

**Pick your autonomy policy** - this is a choice, not a default to inherit. The two ends of the dial:
- *High-trust (solo / fast):* approved or planned work runs end-to-end - commit + push + open PR +
  merge as one flow when ready, no second sign-off round. End the message with the merged-PR URL +
  main-branch SHA.
- *Review-gated (team / cautious):* the agent may commit + push + open a PR, but **stops before
  merge** for human review. Or stops before push. Set the line where you want it and state it here.

[Delete whichever end you don't want and keep the rule explicit - the skills defer to whatever this
section says.]

- **Unscoped or ambiguous work**: ask first before committing, regardless of policy.
- **Approval is scoped to what was approved.** A plan approval covers construction; approving an
  exact artifact, applying it, or publishing it are separate seams - name which ones this repo's
  policy collapses (lessons/09 §1) and get fresh approval past the stated line.
- Before starting, verify the branch is up to date with main (many PRs may have landed).
- Never reset a branch without confirming via reflog that recoverable work is preserved.
- [Commit-message trailer / co-author convention, if any.]

## Hard Stops

[The explicit destructive-action denylist - things the agent must never do without a fresh,
explicit human instruction in the current session, regardless of mode or autonomy policy. Keep it
short and concrete; this section outranks everything else in this file.]
- Never delete or overwrite [source-of-truth data / originals / the archive / prod database].
- Never [force-push / rewrite history] on [main].
- Never run [destructive external operation - bulk emails, payments, deletes on a remote service].

## Architecture

- **Framework:** [...]
- **Database / storage:** [...]
- **Auth:** [...]
- **External integrations / MCP:** [...]
- **Deployment:** [...]

[Push per-surface detail to docs/architecture/ and link it.]

## Data Model

### Core entities (roster)
- **[entity]** - [one line]. [key columns / jsonb / arrays worth knowing every session]

### Relationship patterns (IMPORTANT)
- [State the invariants that bite if violated - e.g. "joins are by FK, never text matching"; "new
  rows MUST set X and Y on insert". These are the rules that cause silent corruption.]

### Canonical registries / source-of-truth lists
- [If you have controlled vocabularies: the authored markdown is the source of truth; the code mirror
  is the validation copy. Adding an entry is a deliberate 2-step edit. Link the full rules.]

## Running Locally

```bash
[install]
[dev]
```

Requires `.env.local` (or equivalent) with:
- `[VAR_NAME]` - [what it's for, where to get it]
- [...]

[Document non-obvious env gotchas: which keys must be passed explicitly to which SDK, which parts of
the build don't run in a worktree, fallbacks when a local key is missing. These notes save hours.]

## Dev notes

- [Build/type gotchas - flags that must stay on, what breaks if off.]
- [What does NOT work locally vs in CI/deploy, and the workaround.]
- [Always run `[build/typecheck]` before pushing if you touched `[X]`.]

## Design / UX conventions
[If the product has a UI. Keep enforcement points here; push the full token map to a design doc.]
- Tokens live in `[...]`. No arbitrary one-off values for chrome.
- Use primitives, don't reimplement. [List the shared components that already exist.]
- One canonical rule per recurring decision - one helper per signal, not copy-pasted constants.

## Sprint Cadence (for the agent)

These bias toward caution. For trivial tasks use judgment; err toward pausing. Run these checkpoints
on every non-trivial unit of work:

1. **Plan before coding when scope is interpretive.** Enter plan mode; surface your interpretation
   before editing. Non-obvious approach → 2-3 options + a recommendation, not a silent pick.
2. **State success criteria before implementing.** Vague task → verifiable cases. No placeholders in
   plans.
3. **Verify before committing - and name the plane.** UI → screenshot each change; logic → run
   end-to-end with real input and inspect the persisted result. "It should work" is not
   verification, and "verified" is a scoped claim: say which plane it ran on (local / CI /
   deployed / live) and what was deliberately not checked.
4. **Cross-system audit before PR.** If this changed shared substrate (a term, schema field, tool,
   registry entry, vocabulary word), trace it through every consumer first. (`/cross-system-audit`)
5. **Simplify before commit.** One pass for duplication / over-engineering. (`/simplify-pass`)
6. **Retro before docs.** What didn't work / what surprised us / what we'd do differently. The doc
   updates then write themselves.
7. **Kickoff brief for the next session.** Paste-ready: problem, goal, scope (in/out), entry surface,
   files likely to touch, verification plan, open questions. Tag the MODE: EXECUTING (autonomy
   applies) / GRILLING (ask, don't ship) / COORDINATING (delegate + own the synthesis).

## Roadmap currency
- The roadmap tick and the `docs/sprints/shipped.md` line are one atomic edit, written when
  **merge evidence exists** - "shipped" means merged, not authored. If your flow merges
  immediately, that's the same change; under a review-gated policy, the implementation records
  "pending merge" and a small post-merge closeout writes the tick + shipped line (citing the
  merged PR). Deployed / live-verified are later, separate facts.

## Memory (if your harness has persistent memory)
- [Where memory files live, the one-fact-per-file convention, the index file loaded each session,
  the rule to update-not-duplicate, and what's worth saving (non-obvious decisions, preferences,
  standing corrections) vs not (anything the repo already records).]

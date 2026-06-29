# The docs/ Structure & Conventions

*Read this if you're setting up the `docs/` tree and deciding what belongs where (and what should
be always-loaded vs pulled on demand).*

The docs tree is the agent's external memory. The rules that make it work:

1. **Every doc is reachable from the Documentation Index in CLAUDE.md.** A doc the agent can't
   find via the index effectively doesn't exist. When you add a doc, add its index line in the
   same change. (Worth a `check:*` script once you have many — see lesson 06.)
2. **Each doc states "read when…"** so the agent knows whether to pull it for the current task.
3. **Tier docs by loading profile.** Always-loaded (root) vs on-demand (docs/). Keep the
   always-loaded set small and push detail down.
4. **Moved content leaves a redirect stub** at the old path, so old links and old habits don't
   break. ("This moved to X.")

---

## Recommended tree

```
/CLAUDE.md                      # agent system prompt (always loaded)
/PRODUCT.md                     # product-system index (read early)
/GLOSSARY.md                    # shared vocabulary (grown via grill-with-docs)
/docs/
  adr/                          # architecture decision records, one file per decision
    0001-*.md
  product/
    roadmap.md                  # live roadmap (Active / On deck / Future)
    issues.md                   # known gaps + bugs
  architecture/                 # on-demand deep reference, pulled per surface
    data-model.md               # per-column / per-relationship detail
    page-ia.md                  # per-surface UI information architecture
    <surface>.md                # one per surface you touch repeatedly
    doc-tripwires.md            # the size-cap registry (see lesson 06)
  features/                     # per-sprint scoping + recap docs (the work log)
    YYYY-MM-DD-<feature>.md
  sprints/
    shipped.md                  # reverse-chrono one-line ledger of every ship
    <retros, grilling records>
  design-system.md              # UI-heavy products only: token map / palette / components
  prompts/                      # operational prompts, if you drive flows from prose
```

Adapt freely — the point is the *separation by loading profile and churn rate*, not the exact
paths.

---

## ADRs (Architecture Decision Records)

One markdown file per decision that is **non-obvious + hard to reverse + the result of a real
trade-off**. Most are 1-3 sentences. Don't ADR the obvious; do ADR the thing a future reader
(or agent) would otherwise undo because they don't know why it's that way.

```markdown
# ADR-NNNN: [Decision title]

**Status:** accepted | superseded by ADR-MMMM
**Date:** YYYY-MM-DD

## Context
[The forces. What made this a real trade-off.]

## Decision
[What we chose.]

## Consequences
[What this costs us, what it buys, what's now harder to change.]
```

Create the directory lazily on the first ADR. Number them sequentially. When a decision is
reversed, mark the old ADR superseded rather than deleting it — the history is the value.

## features/ — the work log + roadmap tick-off

Every product feature sprint gets a doc here. Two phases:
- **Before:** a scoping/brainstorm doc — problem, goal, scope in/out, approach, open questions.
  (This is also where a plan-mode plan lands.)
- **After:** a recap appended to the same doc — what shipped, what changed vs the plan, what
  surprised us, the retro. **And the close-out checklist:** tick the roadmap (remove from Active),
  add the shipped.md line, update any docs the change invalidated.

This folder is the archive layer — it's not loaded every session, it's the place you go to
reconstruct "why did we do it that way" months later.

## GLOSSARY (shared language)

The single highest-leverage doc in an agent-driven repo. A precise shared vocabulary is how you
and the agent stop talking past each other, and how the agent stays consistent across sessions.

Rules:
- **Define each term once, canonically.** Everything else refers to it.
- **Strict format:** term definition + cardinality/relationship to other terms. NO implementation
  detail — that rots. Just "what this word means and how it relates to the others."
- **Grow it incrementally** via grilling sessions (lesson 05), not in one big authoring push. Terms
  earn their place when ambiguity actually surfaces.
- If it gets big, **split by zone/subdomain** so a session loads only the vocabulary it needs, with
  a thin index doc tying them together.

## Memory (if the harness supports persistent agent memory)

Separate from docs/ — this is the agent's own cross-session memory, not product documentation.
The pattern that worked:
- **One fact per file**, with frontmatter (name, one-line description for recall, a type:
  user-preference / standing-feedback / project-state / reference-pointer).
- **An index file loaded every session** with one line per memory (title + hook). Never put memory
  *content* in the index — just pointers.
- **Update, don't duplicate.** Before saving, check for an existing file covering it. Delete
  memories that turn out wrong.
- **Save the non-obvious:** standing corrections / preferences, project state not derivable from
  code or git, pointers to external resources. **Don't save** what the repo already records (code
  structure, past fixes, git history) — that's just stale duplication waiting to mislead.
- Link related memories to each other so recall pulls the cluster.

The discipline: memory captures *what was non-obvious*, and is treated as possibly-stale — if a
memory names a file or flag, verify it still exists before acting on it.

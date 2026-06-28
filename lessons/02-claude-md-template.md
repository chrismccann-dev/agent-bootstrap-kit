# CLAUDE.md Template (the agent system prompt)

`CLAUDE.md` is loaded into **every** session. It is the most expensive real estate you own —
every token here is paid on every turn. Rule of thumb: **CLAUDE.md should tell the agent who it
is, where everything is, and how to behave — and push all detail into on-demand docs it can
pull.** Aim to keep it lean (the project it came from holds this under ~40KB by aggressively
extracting reference material).

Copy the skeleton below; fill the `[brackets]`; delete sections you don't need yet.

---

```markdown
# [Project Name]

[2-4 sentences: what this repo is, who it's for, the single big goal. State the North Star —
the thing every decision should serve. If single-user / single-tenant, say so; it changes a lot
of architecture decisions. If there's one canonical input path or one core workflow, name it
here in the first paragraph.]

## Documentation Index

[This is the map. The agent reads this to know where to look. Keep each line to: link + one-line
"what's in it + when to read it." Group by tier.]

Foundational living docs (root level — read first):
- **[PRODUCT.md](PRODUCT.md)** — product purpose, workflows, data model, roadmap pointer.
- **[GLOSSARY.md](GLOSSARY.md)** — shared vocabulary. Every domain term defined once, here.
- **[docs/adr/](docs/adr/)** — one file per non-obvious, hard-to-reverse decision.

On-demand reference (pull when touching the relevant surface):
- **[docs/architecture/...]** — [per-surface detail; only read when working on that surface]
- **[docs/product/roadmap.md](docs/product/roadmap.md)** — current + next work. Check for "what's next."

[Principle: anything the agent needs *sometimes* lives behind a link with a "read when…" note,
not inline. CLAUDE.md is the index, not the encyclopedia.]

## Shared Language

[Point at the glossary and the grilling skill. The single most leveraged investment in an
agent-driven repo is a precise, shared vocabulary — it's how you and the agent avoid talking
past each other. Terms are defined ONCE, canonically, and everything else refers to them.]
- Glossary lives in [GLOSSARY.md]. Grown incrementally via `/grill-with-docs` sessions, not
  bulk-authored. Strict format: term definitions + cardinality relationships only — no
  implementation detail.

## Git Discipline

[State the autonomy contract explicitly — this removes a whole class of round-trips. Tune to taste.]
- **Approved or planned work** (plan approved, explicit "go for it"): commit + push + open PR +
  merge autonomously as one flow when ready. No second sign-off round. End the message with the
  merged-PR URL + main-branch SHA.
- **Unscoped or ambiguous work**: ask first before committing.
- Before starting, verify the branch is up to date with main (many PRs may have landed).
- Never reset a branch without confirming via reflog that recoverable work is preserved.
- [Commit message trailer / co-author convention, if any.]

## Architecture

[The every-session shape, not the full detail. Framework, where the boundaries are, what's
server vs client, where the AI calls live if any. Push per-surface detail to docs/architecture/
and link it.]
- **Framework:** [...]
- **Database / storage:** [...]
- **Auth:** [...]
- **External integrations / MCP:** [...]
- **Deployment:** [...]

## Data Model

[The roster — entity names + one line each + the key relationships. Push per-column histories and
migration provenance to docs/architecture/data-model.md.]

### Core entities (roster)
- **[entity]** — [one line]. [key columns / jsonb / arrays worth knowing every session]

### Relationship patterns (IMPORTANT)
- [State the invariants that bite if violated — e.g. "joins are by FK, never text matching";
  "new rows MUST set X and Y on insert". These are the rules that cause silent corruption.]

### Canonical registries / source-of-truth lists
- [If you have controlled vocabularies: the authored markdown is the source of truth; the code
  mirror (`lib/*-registry.ts`) is the validation copy. Adding an entry is a deliberate 2-step
  edit. Link the full rules.]

## Running Locally

[BE SPECIFIC about env vars — this is the #1 thing future-you and the agent waste time on.]

```bash
[install]
[dev]
```

Requires `.env.local` with:
- `[VAR_NAME]` — [what it's for, where to get it]
- [...]

[Document any non-obvious env gotchas: which keys must be passed explicitly to which SDK, which
parts of the build don't run in a worktree, fallbacks when a local key is missing. These notes
save hours.]

## Dev notes

[The pile of hard-won "this will bite you" facts. Examples of the genre:]
- [Build/type gotchas — flags that must stay on, what breaks if off.]
- [What does NOT work locally vs in CI/deploy, and the workaround.]
- [Always run `[build/typecheck]` before pushing if you touched `[X]`.]

## Design / UX conventions
[If the product has a UI. Keep enforcement points here; push the full token map to a design doc.]
- Tokens live in `[...]`. No arbitrary one-off values for chrome.
- Use primitives, don't reimplement. [List the shared components that already exist.]
- [One canonical rule per recurring decision — e.g. one confidence-threshold helper, one color
  helper per signal. "One helper per system" beats copy-pasted constants.]

## Sprint Cadence (for the agent)

These bias toward caution. For trivial tasks use judgment; err toward pausing. Run these
checkpoints on every non-trivial unit of work:

1. **Plan before coding when scope is interpretive.** Enter plan mode; surface your
   interpretation before editing. Non-obvious approach → 2-3 options + a recommendation, not a
   silent pick.
2. **State success criteria before implementing.** Vague task → verifiable cases. No placeholders
   in plans.
3. **Verify before committing.** [For UI: screenshot each change. For logic: run it end-to-end
   with real input.] "It should work" is not verification.
4. **Cross-system audit before PR.** If this changed shared substrate (a term, a schema field, a
   tool, a registry entry, a vocabulary word), trace it through every consumer before declaring
   done. (See `06-enforcement-and-audit.md` for the actor-trace template.)
5. **Simplify before commit.** One pass for duplication / over-engineering after implementation
   is done. Agents over-engineer; catch it before it's tech debt.
6. **Retro before docs.** List what didn't work / what surprised us / what we'd do differently.
   The doc updates then write themselves.
7. **Kickoff brief for the next session.** Paste-ready: problem, goal, scope (in/out), entry
   surface, files likely to touch, verification plan, open questions.

[Tag whether a given brief is for an EXECUTING session (autonomy applies) or a GRILLING /
interpretive session (ask, don't ship). Don't let the two blur — see principle 7.]

## Memory (if your harness has persistent memory)

[Where memory files live, the one-fact-per-file convention, the index file that's loaded each
session, the rule to update-not-duplicate, and what's worth saving (non-obvious decisions, user
preferences, standing corrections) vs not (anything the repo already records).]
```

---

## Notes on the template

- **The Documentation Index is the most important section.** It's how the agent navigates. Keep
  it current; a stale index sends the agent to the wrong file.
- **Sprint Cadence is where you encode your working style.** The seven checkpoints above are the
  generalizable core. Adapt them, but keep plan→criteria→verify→audit→simplify→retro→handoff as
  the spine.
- **Resist inlining detail.** Every time you're tempted to add a third paragraph of schema or
  design detail to CLAUDE.md, put it in a `docs/` file with a "read when…" pointer instead. The
  test: would the agent need this on a session that *isn't* about this topic? If no, it's a link.

# Agent Bootstrap Kit

A starter kit for repos where AI agents do ongoing software work.

The problem isn't getting an agent to write code. It's keeping it aligned after week six - when the
vocabulary has drifted, the decisions live in old chat logs, and each new session rediscovers the
repo from scratch. This kit is the boring process layer that prevents that.

It gives you three things:

1. **A root agent index** - the file your agent reads every session (`CLAUDE.md`, `AGENTS.md`, or
   your runtime's equivalent). A loading map, not an encyclopedia.
2. **A product/system doc skeleton** - `PRODUCT.md`, `GLOSSARY.md`, ADRs, a roadmap, a shipped log,
   and architecture references.
3. **Reusable agent skills** - small `SKILL.md` workflows for planning, grilling, delegation,
   audits, simplification, and handoffs.

Not a framework, not vibe-coding scaffolding. It turns the repo into the agent's source of truth:
what the product is, what terms mean, how work gets planned, when the agent should ask vs execute,
and what checks prevent drift. (The deeper idea - the repo as a *substrate* the agent reads, writes,
and improves - is in [`lessons/`](lessons/README.md). Read that for the *why*.)

Inspired by [mattpocock/skills](https://github.com/mattpocock/skills): small, adaptable, composable,
model-agnostic. Copy what helps, delete what doesn't.

## Start here

| Situation | Do this |
|---|---|
| **Starting a new repo** | Use the GitHub template, copy `template/` to the root, fill the brackets. |
| **Adopting into an existing repo** | Do **not** copy the whole template. Add a thin root index first, then add pieces only as friction earns them. See [`lessons/07`](lessons/07-existing-repo-adoption.md). |
| **Only want the workflows** | Copy `skills/` into your agent runtime's skills directory. |

## Quickstart - new repo

This repo is a GitHub template. Click **Use this template**, or:

```bash
gh repo create my-new-project --template chrismccann-dev/agent-bootstrap-kit --private --clone
cd my-new-project
```

**Minimal profile (recommended)** - the kit's own formalization-tax rule applies to the kit:
install only what day one earns, add the rest when a specific friction fires.

```bash
# core surfaces + first enforcement script
cp template/CLAUDE.md template/PRODUCT.md template/GLOSSARY.md .
mkdir -p docs/product scripts
cp template/docs/product/roadmap.md docs/product/
cp template/scripts/check-docs.mjs scripts/

# the two starter skills (Claude Code path shown; use your runtime's skills dir)
mkdir -p .claude/skills
cp -R skills/grill-with-docs skills/plan-then-implement .claude/skills/

node scripts/check-docs.mjs   # should print "check:docs OK"
```

Then:
1. Fill in `CLAUDE.md` - or rename it to whatever your runtime loads every session (e.g.
   `AGENTS.md` for Codex; `check-docs.mjs` auto-detects either name - pin `ROOT_INDEX` in the
   script if you use something else).
2. Fill in `PRODUCT.md`, then `GLOSSARY.md` as terms earn their place.
3. Read [`lessons/01-principles.md`](lessons/01-principles.md) once.

**Everything else activates on a trigger**, not on day one:

| Deferred piece | Add it when |
|---|---|
| `docs/adr/` | the first non-obvious, hard-to-reverse decision (create with ADR-0001, not empty) |
| `docs/sprints/shipped.md` | the first merged ship (the roadmap tick needs somewhere to land) |
| `docs/product/issues.md` | known gaps start accumulating outside the roadmap |
| `docs/architecture/*` | a surface needs per-column / per-page detail the root index shouldn't hold |
| `simplify-pass`, `cross-system-audit` | the first over-engineered diff / the first substrate change with multiple consumers |
| `coordinator-spawn` | the first job too big for one context |
| `self-improving-skill`, `improve-skill` | skills exist long enough to accumulate friction |

**Full profile** (`cp -R template/. .` + all seven skills) is still there if you'd rather prune
than accrete - but the minimal profile is the kit's own doctrine applied to itself.

## Quickstart - existing repo

If the repo already has code, docs, and history, do **not** copy the greenfield template - you'll
create duplicate surfaces that rot. Start with the smallest useful layer:

1. Add a thin root agent index (`AGENTS.md` / `CLAUDE.md` / your runtime equivalent).
2. Point it at the docs that already exist.
3. Add one stable system doc only if the repo is missing one.
4. Add a glossary if terms are starting to blur.
5. Add one deterministic `check:*` script for the drift this repo is most prone to.
6. Adopt `grill-with-docs` first.

The goal is not more scaffolding. It's making future agents harder to confuse. Full path in
[`lessons/07-existing-repo-adoption.md`](lessons/07-existing-repo-adoption.md).

## What you get after install

- a root agent index (`CLAUDE.md` / `AGENTS.md`)
- `PRODUCT.md` - the stable product/system doc
- `GLOSSARY.md` - shared vocabulary
- `docs/adr/` - architecture decision records
- `docs/product/roadmap.md` + `docs/sprints/shipped.md` - roadmap + ship ledger
- `scripts/check-docs.mjs` - the first enforcement script (required docs exist, links + anchors
  resolve, size caps hold)
- seven skills (catalog in [`skills/README.md`](skills/README.md))

## The signature workflow: grill-with-docs

The most distinctive thing here. Before adding a new concept or building on an ambiguous term, run
`grill-with-docs`: the agent reads the *actual* glossary and docs (greps before claiming a term is
missing), challenges fuzzy language, asks one question at a time with a recommended answer, and
updates the glossary or an ADR only after the decision is settled. It's the antidote to the
definition drift that quietly breaks agent-driven repos. The lived-practice playbook -
grep-first, analytical-vs-operational classification, the confabulation ledger, and the
"grilling is not executing" boundary - is in
[`skills/grill-with-docs/LIVED-EXPERIENCE.md`](skills/grill-with-docs/LIVED-EXPERIENCE.md).

## The three working modes

Tag every kickoff brief with the mode - it's the clearest way to tell the agent how much rope it has:

- **EXECUTING** - the decision is made; complete the approved work end-to-end (subject to your
  autonomy policy).
- **GRILLING** - the decision is *not* made; the human's input is the important signal. Ask, don't ship.
- **COORDINATING** - decompose and delegate to briefed sub-agents; you own the synthesis, not the
  unit-work.

More in [`skills/README.md`](skills/README.md), including how to **port skills across runtimes**
(Codex, etc.).

## A note on autonomy

The template encodes an *opinionated* default (an approved plan runs end-to-end: commit, push, PR,
merge). That fits a solo, high-trust workflow. **It's a policy choice, not a law** - if you want a
human review before push/PR/merge, change the Git Discipline section of `CLAUDE.md` to say so. The
skills defer to whatever your repo's policy is.

## The 10 principles (the *why*, condensed)

1. The repo is a **substrate**, not just code - shared vocab + schema must stay coherent across every reader.
2. Documentation **compounds**; it is not regenerated.
3. **One canonical input path** per kind of data - deprecate the side doors.
4. **Prose is insufficient - the script is the enforcement.** Turn invariants into failing CI checks.
5. **Plan before you code**, in proportion to interpretive risk.
6. **State success criteria** before implementing.
7. **Autonomy is earned per-decision** - and grilling != executing.
8. **Always-loaded context has a budget** - defend it; split by loading profile.
9. **Close the loop**: retro -> docs -> next-session handoff brief.
10. **Delegate with explicit handoffs**; one session stays the coordinator.

Full reasoning for each in [`lessons/01-principles.md`](lessons/01-principles.md); the whole lesson
set is indexed in [`lessons/README.md`](lessons/README.md). When the substrate scales past the
starter patterns (100+ docs, 10+ skills), there's a second-generation set in
[`lessons/08-scale-lessons.md`](lessons/08-scale-lessons.md): the formalization tax, evidence-gated
docs, pruning, planner/executor skill splits, staged autonomy, and the arbiter shape.

## License

MIT - see [LICENSE](LICENSE).

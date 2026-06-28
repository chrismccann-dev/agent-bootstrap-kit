# agent-repo-kit

Patterns and skills for running a long-lived, **AI-agent-driven** software repo — distilled from
actually doing it on a real, multi-month, single-developer product. Not vibe-coding scaffolding:
the boring, load-bearing process stuff that keeps an agent-built codebase coherent as it grows.

Three layers, use as much or as little as you want:

| Layer | What it is | Start here if… |
|---|---|---|
| **`lessons/`** | The *why* — 10 principles + annotated rationale for every pattern. | you want to understand before you copy. |
| **`template/`** | Droppable skeleton — `CLAUDE.md`, `PRODUCT.md`, `docs/` tree. Fill the brackets. | you're starting a new repo today. |
| **`skills/`** | Reusable `SKILL.md` procedures for how you *work* with the agent. | you want grill-with-docs / plan→implement / coordinator delegation. |

Inspired by [mattpocock/skills](https://github.com/mattpocock/skills) — small, adaptable,
composable, model-agnostic. Hack on them. Make them yours.

## Quickstart — new project

This repo is a **GitHub template**. Click **"Use this template"**, or:

```bash
# 1. start your new project from the template
gh repo create my-new-project --template chrismccann-dev/agent-repo-kit --private --clone
cd my-new-project

# 2. promote the skeleton to the repo root
cp -r template/* template/.* . 2>/dev/null || cp -r template/* .
mkdir -p .claude/skills && cp -r skills/* .claude/skills/

# 3. delete the meta layers you don't need to keep in the new repo
rm -rf template lessons        # keep skills/ -> .claude/skills already copied

# 4. fill in CLAUDE.md and PRODUCT.md (every [bracket] is a prompt to you)
```

Then read `lessons/01-principles.md` once, and let `CLAUDE.md`'s Sprint Cadence drive how you work.

## Install just the skills (into an existing repo)

```bash
mkdir -p .claude/skills
cp -r skills/* .claude/skills/
```

Each skill is a self-contained `SKILL.md` with a trigger description. Drop them in, invoke with
`/<skill-name>`. They reference each other but degrade gracefully if you only take some.

## The 10 principles (the TL;DR of `lessons/`)

1. The repo is a **substrate**, not just code — shared vocab + schema must stay coherent across every reader.
2. Documentation **compounds**; it is not regenerated.
3. **One canonical input path** per kind of data — deprecate the side doors.
4. **Prose is insufficient — the script is the enforcement.** Turn invariants into failing CI checks.
5. **Plan before you code**, in proportion to interpretive risk.
6. **State success criteria** before implementing.
7. **Autonomy is earned per-decision** — and grilling ≠ executing.
8. **Always-loaded context has a budget** — defend it; split by loading profile.
9. **Close the loop**: retro → docs → next-session handoff brief.
10. **Delegate with explicit handoffs**; one session stays the coordinator.

Full reasoning for each in [`lessons/01-principles.md`](lessons/01-principles.md).

## What's deliberately not here

Domain logic, framework choices, and the `check:*` scripts themselves (those are per-project —
the lessons tell you *which* invariants to script, not a one-size implementation). And: you don't
need all of this on day one. Start with `CLAUDE.md` + plan→implement + grill-with-docs; add the
enforcement machinery when you feel the drift it solves.

## License

MIT — see [LICENSE](LICENSE).

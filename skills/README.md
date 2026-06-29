# skills/

A skill is a small markdown procedure an agent invokes when the task matches its trigger. Not an
app, a package, or a framework — just a reusable working pattern for *how you work with the agent*,
not domain logic. Each is a self-contained `SKILL.md` with a trigger `description`; they reference
each other but degrade gracefully if you only take some.

**Start with two**, add the rest only when the friction appears:
1. `plan-then-implement/` — for any non-trivial change.
2. `grill-with-docs/` — when vocabulary, product meaning, or system boundaries are ambiguous. (A
   *grill* is an interview-style session where the agent challenges terms, assumptions, and decision
   boundaries *before* anything ships.)

| Skill | What it's for |
|---|---|
| `grill-with-docs/` | Lock shared vocabulary before agents build on it. (+ `LIVED-EXPERIENCE.md`) |
| `plan-then-implement/` | The core build loop — decide what to build before building it. |
| `coordinator-spawn/` | Delegate to briefed sub-agents; one session stays the coordinator. |
| `self-improving-skill/` | Skills update their own `SKILL.md` after each run. |
| `cross-system-audit/` | Trace a substrate change through every actor before the PR. |
| `simplify-pass/` | Quality-only dedup / de-over-engineer pass before commit. |

### Adopt in this order

| Tier | Skills | When |
|---|---|---|
| **Start here** | `plan-then-implement`, `grill-with-docs` | day one |
| **Add soon** | `simplify-pass`, `cross-system-audit` | once you're shipping real changes |
| **Advanced** | `coordinator-spawn`, `self-improving-skill` | when work outgrows one context / skills need tending |

## Install

Copy into your agent's skills directory and invoke with `/<skill-name>`:

```bash
mkdir -p .claude/skills && cp -r skills/* .claude/skills/   # Claude Code
# or your runtime's equivalent skills path
```

## The three working modes

Most of these skills are really about knowing **which mode you're in** — name it explicitly in every
kickoff brief:

- **EXECUTING** — the decision is made; the autonomy contract applies (commit → push → PR → merge,
  no second sign-off). `plan-then-implement` phase 2, `simplify-pass`, `cross-system-audit`.
- **GRILLING** — the decision is *not* made; the human's input is load-bearing. Ask, don't ship.
  `grill-with-docs`. Never let an execution-shaped brief authorize interpretive calls.
- **COORDINATING** — decomposing and delegating; you own the synthesis, not the unit-work.
  `coordinator-spawn`. Hand back to a human at the decision points the contract reserves.

## Porting skills across agent runtimes

These skills were authored for a Claude Code / `SKILL.md` ecosystem. Other runtimes (Codex, etc.)
differ in frontmatter and invocation. To port one:

- **Keep** `name` and `description` — the trigger contract is the portable core.
- **Remove unsupported frontmatter** — fields like `disable-model-invocation`, model pins, or
  slash-command-specific keys that your runtime doesn't honor.
- **Inline or replace unavailable dependency skills.** If a skill delegates to another skill your
  runtime lacks (e.g. upstream `grill-with-docs` → `/domain-modeling`), inline a standalone fallback
  rather than leaving a dangling pointer. (`grill-with-docs/LIVED-EXPERIENCE.md` shows the pattern.)
- **Preserve the trigger contract** — when does the agent reach for this? That intent must survive
  the port even if the mechanism changes.
- **Adapt the output shape** to the local tool environment (which files it writes, how it reports).

A skill stored as a **repo-local source doc** (versioned with the system it governs) is often safer
than a **globally installed** one — a global skill can trigger outside its intended repo carrying
domain-specific assumptions. Install globally only when the skill is genuinely domain-agnostic.

## Root index naming

The agent's always-loaded root index is `CLAUDE.md` in Claude Code, `AGENTS.md` in Codex and as a
tool-agnostic convention, or your tool's equivalent. The kit's `template/CLAUDE.md` is the *content*;
rename the file to whatever your runtime loads every session.

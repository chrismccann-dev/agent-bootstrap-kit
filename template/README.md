# template/ — the droppable skeleton

Copy this folder into the root of a new repo, then fill the bracketed sections. It gives the agent
three things: a **root index** (`CLAUDE.md` / `AGENTS.md` / your runtime equivalent), a **stable
product/system doc** (`PRODUCT.md`), and a small **docs tree** for vocabulary, decisions, roadmap,
shipped work, and architecture references.

```bash
cp -R template/. .
mkdir -p .claude/skills && cp -R skills/. .claude/skills/
rm -rf template lessons     # keep only the instantiated files + .claude/skills
```

Start by editing, in order:
1. `CLAUDE.md` — how the agent should navigate and behave (rename to `AGENTS.md` etc. if needed).
2. `PRODUCT.md` — what the product is, why it exists, what should stay stable.
3. `GLOSSARY.md` — the domain terms that must stay precise.

The rest you get: `docs/adr/0000-*.md` (ADR convention + template), `docs/product/roadmap.md` +
`issues.md` (live roadmap + known gaps), `docs/sprints/shipped.md` (ship ledger), and
`docs/architecture/doc-tripwires.md` + `data-model.md` (size caps + schema stubs).

**Delete any section that doesn't apply** — a short, accurate template beats a complete one full of
guesses. Read `../lessons/01-principles.md` once for the *why* before you start filling in.

# template/ — the droppable skeleton

This directory is the **fill-in-the-brackets starting point** for a new repo. Copy its contents to
your new project's root, then replace every `[bracket]` (each is a prompt to you).

```bash
cp -r template/* template/.* . 2>/dev/null || cp -r template/* .
mkdir -p .claude/skills && cp -r skills/* .claude/skills/
rm -rf template lessons     # keep only the instantiated files + .claude/skills
```

What you get:
- `CLAUDE.md` — the agent system prompt (loaded every session; keep it lean).
- `PRODUCT.md` — the product-system index.
- `GLOSSARY.md` — shared vocabulary, grown via `/grill-with-docs`.
- `docs/adr/0000-*.md` — ADR convention + template.
- `docs/product/roadmap.md` + `issues.md` — live roadmap + known gaps.
- `docs/sprints/shipped.md` — the one-line ship ledger.
- `docs/architecture/doc-tripwires.md` + `data-model.md` — size caps + schema detail stubs.

Read `../lessons/01-principles.md` once for the *why* before you start filling in.

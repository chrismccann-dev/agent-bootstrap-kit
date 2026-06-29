# Adopting the Kit into an Existing Repo

*Read this **before copying anything** into a repo that already has code, docs, and history. The
short version: don't copy the greenfield template — add the thinnest layer that reduces agent
confusion, and earn the rest.*

The rest of this kit reads as a greenfield template — copy `template/`, fill the brackets, go. But
the more common case is a repo that **already exists**: it has working code, scattered handoffs,
some docs, real safety rules, and live history. Copying the greenfield template into it is a
mistake — you'd create duplicate surfaces that immediately rot.

This lesson is the **existing-repo path**. It was written from a real adoption: a photography repo
with a public portfolio, private archive tooling, curator/AI-edit workflow docs, and provenance
safety rules. The useful question there was never "copy the template" — it was *"what is the
smallest source-doc system that makes future agents harder to confuse?"* That's the right question
for any existing repo.

## The core rule: don't copy the template blindly

The greenfield template assumes no existing substrate. An existing repo already has substrate —
your job is to make it **navigable and coherent**, not to bury it under a parallel set of empty
scaffolding files. Add the thinnest layer that reduces agent confusion; defer everything else until
a specific friction earns it.

## The adoption sequence

1. **Inventory the current substrate.** List every doc an agent currently has to read to be
   effective: handoffs, runbooks, agent docs, safety rules, package scripts. You're mapping what
   already exists before adding anything.

2. **Classify each doc by loading profile.** Which of these should an agent read *every* session
   (always-loaded) vs *only when touching a surface* (on-demand)? Most existing repos have this
   implicit and scattered — making it explicit is half the value.

3. **Add a thin agent index** — the one new always-loaded doc. Name it for your runtime:
   `AGENTS.md` (Codex / tool-agnostic), `CLAUDE.md` (Claude Code), or your tool's equivalent. It is
   a **loading map, not an encyclopedia**: "here's what exists, here's when to read each one." This
   is usually the single highest-value addition — the existing knowledge wasn't missing, it was
   unindexed.

4. **Add one stable system doc — only if missing.** The `PRODUCT.md` equivalent: workflows,
   boundaries, source-of-truth files, state model. If an existing doc already plays this role, point
   the index at it instead of creating a rival. Keep it stable (not a volatile roadmap). It's fine
   for the first version to be provisional on *purpose* — that's exactly what a first
   `grill-with-docs` session is for.

5. **Add a glossary** if the domain has blur-prone, consequential terms. (In the photography repo:
   `Source Original` vs `Published Derivative` vs `Work` — provenance distinctions where imprecise
   vocabulary causes real harm.) Seed it with the recurring terms; grow it via grilling.

6. **Add the first deterministic check — pick it by the pain most likely in THIS repo.** Not a
   general CI suite. The first and most useful check is usually the drift this specific repo is most
   prone to (see "First enforcement by pain" below).

7. **Adopt one workflow skill first** — almost always `grill-with-docs`, because it's the reusable
   one that pays off immediately and because the first thing you'll want to grill is repo purpose.
   Add other skills only when a repeated friction appears.

8. **Leave unresolved concepts as open questions, not premature answers.** When you hit a real
   design decision mid-adoption (e.g. "what's the future data-store model?"), don't canonize a
   guess. Record it in the glossary / a kickoff brief as an open question and route it through
   `grill-with-docs`. The glossary recording the *question* is more honest than a fabricated answer.

9. **Write a handoff back** — to your future self and (if you maintain one) to the kit itself. What
   transferred, what didn't, what the kit could improve. This doc exists because someone did that.

## The minimal adopted set

For an existing repo, the smallest useful footprint — resist adding more until friction demands it:

- a **thin root agent index** (`AGENTS.md` / `CLAUDE.md` / tool-equivalent);
- **one** stable system/product doc (only if none exists);
- a **glossary**;
- a **`docs/adr/`** folder (created lazily, on the first real decision);
- **one** `check:docs`-style validation script;
- **one** handoff / continuation pattern.

That's it. Six things, several of which may already exist. Everything else in this kit is deferred
until you feel its specific pain.

## First enforcement by pain

The most valuable first check is the one that catches the drift *this* repo is most prone to — not
a generic suite. Diagnose the repo, then pick:

| Repo shape | First check should enforce |
|---|---|
| Doc-heavy / agent-substrate repo | internal markdown links resolve + required docs exist (incl. untracked-but-staged files during local work) |
| DB-heavy repo | migration ↔ schema parity (every migration applied; every column typed) |
| Deploy-heavy repo | runtime bundle / build integrity (every runtime-read file is traced into the deploy) |

Add the others later, as the corresponding surface grows. One check that fires on your real failure
mode beats ten that don't.

**CI caveat from the field:** wiring the check into CI may be blocked by auth scope — e.g. a GitHub
token without `workflow` scope will have its push *rejected* if it adds `.github/workflows/*.yml`.
Ship the **local** `npm run check:*` script first (it's the actual enforcement), and add the CI
hook as a follow-up once auth allows workflow writes. Don't let the CI-scope blocker stop you from
landing the check.

## Do not productize too early

Hardening the *source docs* of a workflow does **not** mean turning every workflow into an app. An
existing repo with rich workflows (an archive, a publishing pipeline, an AI-edit flow) makes it
tempting for an agent to "helpfully" propose a CMS, a database app, or a broad platform. Resist it.
Source-doc coherence is about making agents harder to confuse — it is not a mandate to build
software around every documented process. When in doubt, the workflow stays a documented workflow;
app-ification is its own deliberate decision, routed through planning, not a side effect of writing
a glossary.

## How this maps to the greenfield lessons

| Greenfield (lessons 02-06) | Existing-repo equivalent |
|---|---|
| Copy `template/CLAUDE.md` | Write a thin `AGENTS.md`/`CLAUDE.md` index over what's already there |
| Copy `template/PRODUCT.md` | Add one stable system doc *only if missing*; else point the index at the existing one |
| Full `docs/` tree | Add `docs/adr/` + a glossary; skip roadmap/issues/shipped until you run sprints here |
| All six skills | `grill-with-docs` first; others on friction |
| Full tripwire registry + check suite | One check, chosen by the repo's most-likely drift |

The principles (lesson 01) are identical in both worlds. Only the *rollout* differs: greenfield
installs the scaffolding up front; an existing repo earns each piece.

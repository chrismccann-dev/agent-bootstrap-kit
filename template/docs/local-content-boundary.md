# Local Content Boundary

<!-- OPTIONAL - only for source-bearing repos (lessons/10). Delete this file if every file in
this repo is the repo's own work product. If kept: link it from the root index as
read-before-touching-sources, and keep scripts/check-privacy.mjs's PROTECTED list in sync. -->

This repo contains, or sits next to, source material that is **not the repo's work product**.
This file declares the boundary. Agents: read this before touching anything under a protected
path.

## Protected paths

| Path | What it holds | In version control? |
|---|---|---|
| `[sources/]` | [supplied corpus / originals / exports] | **Never** |
| `[local/]` | [local-only operational data] | **Never** |

Enforced by `scripts/check-privacy.mjs` (`check:privacy`), not by `.gitignore` alone.

## Authorized operations on protected content

- **Authorized:** read, analyze, summarize into an approved destination (with provenance).
  Derived artifacts inherit their sources' sensitivity: only synthesis explicitly judged
  non-sensitive may enter the tracked System Layer; sensitive summaries/extracts stay under a
  protected path.
- **NOT authorized without a fresh, explicit instruction:** rename, move, copy, rewrite,
  delete, upload, sync, or transmit anything under a protected path. Drafting an external-use
  artifact does not authorize sending it.

## Corpus registry

[One row per supplied corpus - identity survives storage (lessons/10 §3).]

| Source ID | What it is | Locator (current) | Hash / fingerprint | Coverage cutoff |
|---|---|---|---|---|
| `[SRC-001]` | [e.g. meeting-notes export] | `[sources/notes-2026/]` | `[...]` | `[as of YYYY-MM-DD]` |

## Provenance lanes

- **Supplied corpus** - the material above. "Complete" claims are relative to it + its cutoff.
- **External research** - anything gathered from public/web sources. Lives in `[docs/research/]`
  with its own provenance marks. It never silently enlarges the supplied corpus.

## Live-state ownership

[If another application owns live operational state:] `[app name]` owns `[what]`. This repo
takes dated baselines/handoffs only (`[where]`, marked "as of"), and does not attempt a live
mirror.

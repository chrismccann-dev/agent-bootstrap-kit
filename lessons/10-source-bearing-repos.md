# Source-Bearing Repos (the private-data profile)

*Read this only if the repo holds - or sits next to - material that is not the repo's own work
product: confidential documents, human-authored originals, research corpora, customer exports,
media archives, local-only data. If every file in the repo was authored inside it, skip this
lesson entirely. Nothing here belongs in the minimal default install.*

A source-bearing repo has two kinds of content with different rules, and the failure mode is an
agent applying work-product habits (rename, restructure, rewrite, commit, sync) to source
material it was only given to *read*. The whole profile is one boundary pattern: bounded intake,
original preservation, scoped authority, deterministic enforcement.

---

## 1. Two layers, explicitly separated

- **The System Layer** - the tracked repo: docs, structure, scripts, synthesis, the substrate.
  Normal kit rules apply.
- **Protected content** - the sources: originals, exports, corpora, local-only state. Lives
  under named protected paths, stays out of version control, and is governed by this lesson.

Declare the split in a boundary doc (`docs/local-content-boundary.md` - the kit ships a
template): which paths are protected, what operations are authorized on them, and where the
line is. The root index links it as read-before-touching-sources.

## 2. Receiving a corpus authorizes analysis - nothing else

Being handed source material authorizes *reading and analyzing* it. It does not authorize
renaming, moving, copying, rewriting, uploading, syncing, or deleting it. Each of those is a
separate seam needing its own authorization - this is lesson 09 §1's approval ladder applied to
other people's (or your past self's) material. Two specific instances that recur:

- **Inventory originals read-only first.** Before proposing any transformation or structure over
  a corpus, produce a read-only inventory (what exists, counts, formats, date range). Structure
  proposals come *after* the corpus is known, not while discovering it.
- **Drafting is not sending.** Preparing something for external use (an email, a post, a
  shared export) does not authorize sending, publishing, syncing, or uploading it. The draft
  ends the authorized work; transmission is a fresh decision.

## 3. Source identity survives storage

Track *what a source is* independently of *where it currently sits*: a stable ID, a locator,
a content hash, and the coverage cutoff it represents. Storage moves, filenames get cleaned up,
drives get migrated - the identity record is what lets every downstream claim ("per source X")
survive that. This is lesson 09 §5's artifact-identity rule pointed at inputs instead of
evaluations.

## 4. External research is a separate provenance lane

Public/web research mixed silently into a supplied corpus poisons it: you can no longer say
what the source material actually contained. Keep externally-gathered material in its own lane
with its own provenance marks, and never let it silently enlarge "the corpus" - lesson 09 §6's
"complete relative to a stated corpus and cutoff" depends on the corpus staying bounded.

## 5. Enforcement is a script, not a .gitignore

`.gitignore` prevents *accidental staging*; it does not notice a protected file that got force-
added, a new protected root that nobody ignored, or a copy that landed outside the protected
tree. Ship a deterministic `check:privacy` (the kit includes a starter,
`template/scripts/check-privacy.mjs`): protected paths are declared once, the script fails if
any tracked file falls under them or if the ignore rules don't cover them. Same doctrine as
lesson 06 §1 - the rule you care about is the rule a script enforces.

## 6. Another system may own the live state

If a separate application owns live operational state (a notes app, a DAM, a CRM), the repo
does not mirror it - it takes **dated baselines or handoffs**. Trying to keep a tracked copy
continuously synced creates a second source of truth that is always slightly wrong (lesson 01,
principle 3). Record what was taken, from where, as of when - and let the owner stay the owner.

---

## Activation

Add this profile when the trigger fires, not before: the moment a corpus, export, archive, or
confidential source lands in (or beside) the repo. The install is small - the boundary doc, the
`check:privacy` script, protected paths in `.gitignore` - and the doctrine above is mostly
*restraint*, which costs nothing to adopt early once sources exist.

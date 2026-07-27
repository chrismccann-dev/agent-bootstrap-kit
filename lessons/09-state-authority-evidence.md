# State, Authority & Evidence

*Read this when work starts moving through multi-step lifecycles with real consequences - when
"approved," "shipped," and "verified" stop being obviously true and start being claims that can
be wrong. The theme: every status word in the substrate should be backed by evidence, scoped to
what the evidence actually covers, and no broader.*

The earlier lessons treat approval and verification as single moments ("plan approved → execute";
"verify before commit"). That's right for small work. Once artifacts move through preparation,
review, application, and publication - or once evaluations accumulate history - the single
moments decompose into states, and conflating them is how documentation starts lying.

---

## 1. Approval is scoped, not global

One approval must not silently authorize every downstream transition. The lived failure shape: a
direction gets approved, and the agent treats that as authorization to prepare the artifact,
apply it, and publish it - three decisions the human never made.

The portable state ladder (rename per domain; the *seams* are what matter):

```
candidate identified
→ direction approved          (the idea is worth building)
→ artifact prepared           (the concrete thing exists)
→ exact artifact approved     (THIS version, not the idea of it)
→ application authorized      (put it in the system / publish it)
→ applied
→ externally live and verified
```

When you set up a repo's autonomy contract (lesson 06 §6), answer explicitly:

- **Which transitions does one approval cover?** "Approved" on a plan usually covers
  construction, not application or publication. Say which.
- **Which decisions are advisory vs owned?** Where the agent recommends and where it decides.
- **What requires a fresh approval?** Typically: the exact-artifact and
  application/publication seams, anything irreversible, and any change to what was approved.
- **What exactly was approved?** Bind approval to the artifact identity - version, hash, path -
  not to a description. "Approved the redesign" is not "approved this file at this commit."

Not every repo needs all seven states - collapsing them is fine *when done explicitly*. The
kit's high-trust default ("approved plan runs end-to-end: commit, push, merge") is exactly such
a collapse: chosen, stated in the root index, revocable. The failure mode is collapsing them
*silently*.

## 2. Status words are evidence-backed states

Every status word in the substrate should name the evidence that makes it true:

| Claim | Evidence required |
|---|---|
| ready / pending merge | the implementation change exists |
| **shipped** | **merge evidence (the merged PR / the SHA on main)** |
| deployed | the deploy that includes the SHA |
| live-verified | the runtime observation (HTTP check, real query, screenshot) |

"Shipped" written pre-merge is the ledger claiming things that may never land (this bit a real
adopting repo - see lesson 03's roadmap-hygiene rule, which now encodes it). The general rule:
**a state is written when its evidence exists, never earlier**, and where possible the state is
*derived* from the evidence (computed from the substrate - lesson 08 §5's completion gates)
rather than hand-written at all.

## 3. Verification has planes; attest to the plane, not the whole

"Verified" is a scoped claim. The planes that kept needing to be distinguished:

- **local** - it worked on this machine, against this working tree;
- **CI on tracked state** - it worked against what's committed (private/ignored state - local
  configs, untracked archives, secrets - is *invisible* to this plane);
- **pushed / merged** - the code exists on the remote / on main (says nothing about behavior);
- **deployed** - the artifact is running somewhere;
- **live-verified** - the running system was actually observed doing the thing.

Two disciplines:

- **A closeout attests to both sides:** what was proven (which plane, which surfaces) *and* what
  was deliberately not checked. "check:docs passes" must not be allowed to imply migration
  completeness, backup health, or delete-readiness - a scoped check that reads as whole-system
  integrity is worse than no check, because it manufactures confidence.
- **Name the plane in the claim.** "Verified locally, not yet deployed" and "live-verified" are
  different facts; the sprint-cadence verify checkpoint (lesson 02) should say which one it hit.

## 4. The incumbent wins by default; "no change" is a successful outcome

The kit's loop is implementation-biased: plan, approve, build, ship. For anything with an
*incumbent* - a redesign, a dependency migration, a refactor, a model swap, promoting a
prototype, graduating to a database - add the missing doctrine:

- **Define the baseline first.** What does the current state do well? What would be lost?
- **State, before building, what evidence would justify replacement.** If you can't name it,
  you're redecorating, not deciding.
- **"Keep current" is a first-class outcome.** Permit "decline," "no promotion," "baseline
  wins" - and close the investigation cleanly when it happens: record what was evaluated, why
  the incumbent held, and the re-open trigger (lesson 08 §9).
- **Don't manufacture a winner because a queue or sprint is ending.** A completed investigation
  that changes nothing is a success; an adopted candidate that was merely *finishable* is a
  regression with paperwork.

This is lesson 01's principle 5 extended past the plan: the null hypothesis is the incumbent,
and the burden of proof is on the candidate.

## 5. Evaluations bind to artifact identity and decay

Any repo that accumulates scores, benchmarks, audits, reviews, or generated snapshots learns
this eventually:

- **Bind every evaluation to the exact artifact it reviewed** - version, hash, date - not to the
  artifact's name. "The audit passed" means *a* version passed *once*.
- **Represent freshness explicitly.** An evaluation is `current` (artifact unchanged since),
  `superseded` (a newer evaluation exists), `stale` (the artifact changed since), or `unknown`
  (binding lost). An older score silently claiming current coverage is the memory-staleness
  problem (lesson 04) with numbers attached, which makes it more convincing and more wrong.
- **Never auto-fill missing judgments to make coverage look complete.** An empty cell is honest;
  a defaulted score is fabricated evidence. If a surface wasn't evaluated, it shows as
  unevaluated - same rule as §3's "deliberately not checked" list.

Staleness detection is mechanical (artifact hash changed → evaluations flip to stale) - a
natural `check:*` script once evaluations matter (lesson 06 §1).

## 6. Authority attaches to claims, not documents

Everything above scopes *workflow* authority. When agents work over source material - notes,
reports, exports, archives - the same discipline applies one level down, at the claim:

- **A document's authority does not transfer wholesale to every claim in it.** A trusted source
  contains reported claims, verified actuals, plans, forecasts, inferences, and recollections -
  and those are different epistemic kinds. Preserve the kind; don't flatten them all to "the
  doc says."
- **Later does not mean verified.** A newer document restating an older claim adds recency, not
  evidence. Keep the time basis (as-of when?) and the evidence state with the claim, not just
  with the document.
- **Preserve contradictions and gaps.** When two sources disagree, or coverage is missing, the
  honest synthesis records the disagreement / the hole - it does not select a convenient winner
  or interpolate. (This is §5's "never auto-fill" rule applied to prose.)
- **"Complete" is always relative to a stated corpus and cutoff.** "All the meetings" means all
  the meetings *in this corpus, as of this date*. Say so.
- **Extraction is not verification when form carries meaning.** If layout, tables, charts, or
  strikethrough encode the signal, a text extraction that drops them has *lost claims*, silently.
  Verify against the artifact in its meaningful form.

---

## The through-line

Lesson 08's spine was *make the trigger mechanical and the evidence explicit*. This lesson is
the same rule applied to **claims**: approval names the artifact and the transitions it covers;
status names the evidence that makes it true; verification names the plane it ran on and the
surfaces it skipped; evaluations name the version they bound to; and inside source material,
each claim keeps its kind, its time basis, and its evidence state. A substrate whose claims
carry their own scope is one an agent can trust at face value - which is the whole point of
having one.

# Lessons from Scale (150+ docs, 15+ skills)

*Read this when the substrate has outgrown the starter patterns - when you have enough docs,
skills, and agent-written content that the earlier lessons' mechanisms (tripwires, grilling,
audits) need second-generation versions. Everything here comes from a deployment that grew to
~150 docs, ~18 sub-skills, and a multi-surface agent system over several months of daily use.
None of it is day-one material.*

The earlier lessons tell you how to set the substrate up. This one is about what breaks - and
what works - once agents are writing to it constantly.

**Scale is a vector, not a threshold.** A repo can be mature on one axis and small on the others;
import only the sections for the boundary you actually crossed, not the whole institutional layer:

| Scale signal | Reach for |
|---|---|
| Many docs, few skills | pruning (§3), stubs + lifecycle labels (§4), re-open triggers (§9), point-of-use writing (§10) |
| Many skills, modest docs | planner/executor split (§5), catalog dispatch (§6), staged autonomy (§7) |
| Many aggregate / evidence docs | N-gating + re-synthesis (§§1-2) |
| Many long-running work items | completion gates (§5), lifecycle stubs (§4), queue/ledger (§9) |

---

## 1. The formalization tax, and the N=3 decision rule

Every rule, doc section, registry row, and skill instruction you add carries a **standing cost**:
it's loaded into context every time its surface is served, forever. Plus a fluke risk if you
minted it from too few observations. Like law or bureaucracy: rules are good, but each one taxes
the system, so it has to deserve to be there. **Formalize as late as you defensibly can.**

The operating rule that made this concrete:

- **Act at N=1.** A bug, an edge case on an *existing* rule, a structural fix - handle it
  immediately; the cost grows if you wait.
- **At N=3, the pattern earns a decision - not automatic ratification.** Three recurrences of a
  candidate rule, doc section, or skill mean it's time to **grill the smallest abstraction that
  explains the evidence**: recurrence establishes that *something* recurs, but usually not the
  terminology, the cardinality, the file layout, or whether a skill is warranted at all. *Once
  is a fluke, two is a pattern forming, three is take it to a grilling session.* And count
  honestly: three independent, differently-shaped instances are N=3; three correlated sibling
  cases of the same event are N=1 wearing three hats.
- **Graduated rules stay provisional.** Keep collecting observations 4-8; edit or delete the rule
  if later evidence diverges. Graduation is not tenure.
- **N=3 governs convenience abstractions, not safety invariants.** A credible irreversible-risk
  boundary (a Hard Stop, a destructive-action denylist entry) is formalized at N=1 - from one
  near miss or one severity discovery, not three incidents. Require evidence of severity, not
  repeated damage.

Two corollaries that pair with it:

- **Generalize from lived instances, not imagined ones.** Walk one whole concrete case end-to-end
  before declaring the general principle; the abstract plan always deviates from lived execution.
  (This is why the kit says to prototype a skill 2-3 times by hand first - same rule, wider scope.)
- **A tight context budget is a feature.** The always-loaded cap (lesson 06's tripwires) is what
  *enforces* the tax - it forces every formalization to compete for space. Don't resent the cap;
  it's the immune system.

## 2. Evidence-gated docs: N-counts in titles, placeholders with activation criteria

The scaled version of "don't formalize early," applied to aggregate/synthesis docs:

- **Put the evidence count in the doc title**: "By Category: X (N=34)", "Cross-Peer Patterns
  (N<3 placeholder)". The doc listing then doubles as an evidence dashboard - an agent (or you)
  can see at a glance how much weight a doc's claims carry without opening it.
- **A placeholder doc states its own activation criteria in its header**: "Status: Placeholder.
  Activate when ≥3 profiles exist and converge on a shared principle." Until then it holds an
  **empty-state pointer** ("read the per-item docs directly"), not speculative content.
  Pre-authored aggregate docs on thin evidence are confident-sounding fiction.
- **Distinct sources, not just repeated data points.** The refined rule: a pattern earns a section
  at 2+ observations from *distinct sources*, not 2+ observations of the same thing. Same-source
  repetition measures consistency, not generality.
- **Scale hedging and length with evidence.** If an agent writes synthesis docs, tier the prompt
  by corpus size: n<3 gets "too early to call" language and one short paragraph; a mature corpus
  (15+) earns confident claims *plus the edge cases where the pattern breaks*. A 1-item summary
  that sounds as authoritative as a 30-item one is lying with tone.
- **Re-synthesize, don't append.** When new evidence lands in a synthesis doc, regenerate the
  synthesis from the full set - don't append another bullet. "In case A I saw X. In case B I saw
  Y." is a list, not a synthesis, and appended-list degradation hits your *most mature* docs
  hardest because they get the most updates.

## 3. Pruning is a first-class operation (the counterpart to splitting)

Lesson 06's tripwires catch docs that get too *big*. At scale you also need the inverse: docs
that accumulate stale, over-detailed, or superseded content *without* crossing a size cap.
Without a pruning discipline, context-window performance degrades as load-bearing content gets
buried under sections that don't earn their keep at retrieval time. Almost every substrate
mechanism is ADD-shaped; pruning is the deliberate counterweight.

The six pruning moves, in order of increasing severity (name the move when you propose it):

1. **Extract** - move a block to an on-demand doc, leave a pointer.
2. **Split** - divide a doc into siblings along a load-profile seam.
3. **Consolidate** - merge redundant bullets into one concise synthesis.
4. **Archive** - stop restating content that has a historical home elsewhere.
5. **Re-home / re-scope** - tighten the doc's job definition; route out-of-scope content away.
6. **Delete** - true removal. Irreversible, so it goes through review; everything else is cheap.

And when you restructure, keep an **append-only decomposition log** - but bound it, or the log
becomes substrate tax itself. Log the *structural* moves: anything that changes routing,
ownership, canonical paths, or loading profiles. Ordinary consolidation and small prunes don't
earn an entry. One line each:

```
Date | Trigger | Old routing | New routing | Why | Before/after size
```

Historical entries are never edited. Six months in, the log is how a fresh session understands
why the docs are shaped the way they are.

## 4. Redirect stubs, second generation

Lesson 04 says "moved content leaves a redirect stub." At scale, two refinements:

- **Split stubs get a pointer table**, not just "this moved": "former section → now in → link."
  Old docs that reference the pre-split doc are deliberately *not* rewritten - they're frozen
  records of what the doc looked like at the time; the stub keeps them resolvable. Deep `#anchor`
  links don't survive a split; the pointer table is the way back in. Net-new content never lands
  in a stub.
- **Lifecycle stubs close out finished work-item docs.** When a long-running item (a lot, a
  sprint, an investigation) closes, collapse its active doc to a stub carrying only: status,
  close date, a 3-4 line outcome summary, and a pointer to where the learnings went. Put the
  state in the title itself ("CLOSED 2026-06-14 - see X") so a directory listing doubles as a
  status dashboard.

The general form of both: **titles are metadata** - agents route on listings long before they
open files. One qualification, learned from a repo where filenames *are* the link targets: put
**stable routing facts** (status, scope, close dates) in titles, but keep **high-churn values**
(an N that increments with every new record) in a header field or a generated index when title
churn would mean link maintenance. Where doc IDs are stable and titles are display-only, counts
in titles are free; where they aren't, a churning title breaks the stubs you just built.

## 5. Split skills into planners and executors (and gate the writes)

Once you have more than a few domain skills, the highest-leverage structural rule: **a skill
either constructs work or writes to the substrate, never both.**

- **Planning skills** propose - a plan, a recipe, a draft. They have *no write tools*. Output is
  a proposal for a human or an executing skill.
- **Executing skills** record - each one owns a *small, named set* of write tools (1-5) plus the
  validation and cross-link discipline for them. Put the ownership in the tool description
  itself ("owned by <skill>") so routing is self-documenting.
- **Knowledge docs** cache synthesis; they're read-only inputs to both.

This is lesson 01's principle 7 (grilling ≠ executing) pushed down into the skill architecture:
the mode boundary becomes a *tool-access* boundary, which makes it enforceable instead of
behavioral. Errors become attributable ("which executor wrote this?") and write review becomes
tractable (each executor is a small audit surface).

**Enforce it at whatever level your runtime supports** - don't present prose as access control:

1. *Capability boundary* - the runtime supports per-skill tool grants: planners literally have
   no write tools. The real thing.
2. *Approval boundary* - the runtime gates writes but not per-skill tools: planner-mode writes
   route through the review queue.
3. *Behavioral boundary + post-check* - neither is available: the mode lives in the brief, and a
   deterministic after-the-fact check (did a planning session touch the substrate?) catches
   violations. Weakest, but honest about being weakest.

Two skills that earn their place in this scheme:

- **A completion gate.** Multi-write lifecycles (close a sprint, resolve an investigation, ship
  a feature) end in inconsistent state unless something *owns* the "done" check: a verifiable
  checklist (flags set, cross-links resolve, the ledger entry exists), with lifecycle state
  derived from the substrate rather than stored - "resolved" should be *computable*, so it can't
  drift. It's a capability before it's a skill; graduate it per §1: first a closeout checklist
  inside the owning workflow, then deterministic derived-state checks, and a dedicated skill
  only when closeout recurs across workflows or repeated misses prove the checklist isn't enough.
- **Ephemeral executors.** Long-lived coordinator sessions accrete context bloat. The fix: the
  coordinator stays long-lived and *plans*; execution happens in short-lived sessions spawned
  from a self-contained packet, which run the cycle and then STOP. (This is coordinator-spawn,
  lesson 05, applied to session lifetime rather than parallelism.)

## 6. Route with a catalog; log every override

When skills multiply, dispatch becomes its own surface. What worked:

- **Three files, not one:** a *catalog* (every skill, one entry each, with enough I/O metadata
  that routing decisions can be made from the catalog alone - without loading any SKILL.md); a
  *dispatch table* (intent → skill → docs to load); and *handoff chains* (multi-skill workflows,
  drawn per-hop, where a missing hop degrades gracefully to direct dispatch rather than blocking).
- **Markdown-only routing first.** Natural-language reasoning over a prose dispatch table is
  sufficient until proven otherwise; code-backed routing is a later optimization, if ever.
- **Same-change registry discipline:** the PR that ships a skill updates the catalog; the PR that
  reveals a new cross-skill workflow adds the chain. A registry updated "later" is a registry
  that lies. (Lesson 03's roadmap-hygiene rule, generalized to every registry.)
- **The catalog lists everything; the dispatcher routes only what it owns.** Some workflows
  belong to a different surface or to the human directly - list them for visibility, and teach
  the dispatcher to *redirect* rather than absorb.
- **Log dispatch overrides as structured data.** When the human corrects a routing decision,
  record the tuple: intent → wrong dispatch → correct dispatch → cause ("rule too narrow" /
  "rule missing" / "rules conflict") → patch applied. Create the log on the first override, not
  speculatively. Your routing rules are wrong in ways only this log reveals.

## 7. Staged autonomy with numbers (the earned-autonomy ladder)

Lesson 06's autonomy contract has two modes. At scale, make autonomy **per-skill, staged, and
reversible**, with thresholds instead of vibes:

- **Stage 1:** every substrate write goes through the review queue.
- **Stage 2:** routine writes auto-apply; novel ones queue. Graduate a skill after N consecutive
  approved-without-edits runs (pick N by blast radius: a synthesis skill might need 3, a
  substrate-writer 10).
- **Stage 3:** auto-apply with periodic sampling. Graduate on a sustained low override rate
  (e.g. <5-10% over a quarter) - *measured from the override log*, which is why §6 says to keep
  one.
- **Auto-demotion is part of the contract:** override rate ≥10% in a quarter drops the skill a
  stage; ≥25% drops it to Stage 1. Autonomy that can't be revoked mechanically will be revoked
  emotionally, after an incident.

Tune thresholds to blast radius in *both* directions: low-stakes judgment can graduate faster
than the default, and errors that propagate (anything other docs build on) should graduate
slower.

**Mind the denominator.** An override rate is only as meaningful as the reviews behind it -
a low rate can measure low review attention rather than earned reliability. Before you promote
on the numbers, define: what counts as a *reviewed* run (silent acceptance only counts if the
output was actually inspected); what counts as an *override* vs a preference tweak (a wording
edit isn't a routing failure); and a minimum sample size - N approvals in a week of heavy use
says more than the same N spread over a quarter of neglect. Weight overrides by blast radius:
one bad substrate write that other docs built on outweighs five bad drafts.

## 8. The arbiter shape (every clawback mechanism, one template)

Across all of the above - pruning, promotion queues, doc proposals, dispatch patches - the
review mechanism converged on one shape. When you build any "keep the substrate honest" loop,
give it these three parts:

1. **A cheap mechanical trigger that only surfaces candidates** - a size check, a recurrence
   count, a queue row. The trigger never judges.
2. **Multi-perspective arbitration** - the judgment step, debated between actors arguing from
   different principles (the doc's owner, the budget, the evidence rule). Not a rubber-stamp
   human gate; the human is *a perspective with authority*, not a formality.
3. **Stops-at-report** - the mechanism never auto-commits the irreversible. It hands over a
   packet; applying it is a separate, accountable step.

Run the arbitration as a **batched, human-triggered cadence** ("process pending arbitration"),
not real-time per item - batching is what keeps a human-reviewed system from becoming
human-bottlenecked. Mechanics that help: a newer proposal against the same target auto-supersedes
the older one (the arbiter only sees the newest); duplicate queue submissions collapse into one
row; and proposal quality is enforced at the *proposer* ("propose only when a workflow surfaced a
real improvement, never speculatively") - review capacity is a budget too.

You already have instances of this shape: lesson 05's read-only auditor family (report, then
stop) and lesson 06's tripwires (automated trigger, operator-led prune). This is the general
template they're instances of.

## 9. Queues and ledgers are different things

Lesson 05's grilling skill mentions a "flagged ambiguities" ledger. At scale, split it in two:

- **The queue** (forward-looking): concepts and questions waiting for the *next* grilling
  session. Items get pulled from it and resolved.
- **The ledger** (historical): every ambiguity ever surfaced, with per-item resolution status.
  Resolve by **strikethrough + date + a pointer to the closing artifact** ("resolved 2026-05-19
  via ADR-0007"), never by deletion - the reasoning trail is the value.
- **Deferrals get re-open triggers.** When you decide *not* to decide ("stays unmodeled for
  now"), record the decision *and* the concrete conditions that reopen it ("re-test when the
  corpus crosses ~150 entries"). A deferral without a trigger is a decision you'll re-litigate
  from scratch; a deferral with one is a testable bet.

The queue keeps executing sessions uninterrupted (park the ambiguity, keep working); the ledger
keeps grilling sessions honest (you can see what you already resolved, and why).

Don't create both files on day one - that would fail this lesson's own §1. **Start with one
queue** whose resolved entries carry the date, closing pointer, and re-open trigger; split the
ledger out when resolved history starts to obscure the active items, or when you find yourself
consulting past resolutions repeatedly. The *semantics* (resolve by strikethrough-with-pointer,
deferrals get triggers) matter from day one; the two-file structure is earned.

## 10. Write for the reader's moment of use

Agent-authored instructions optimize for completeness by default; the reader needs the opposite.
The lived failure: procedure rules that buried the action inside rationale, branched into
sub-cases, and conditioned on data the operator couldn't see at the moment of use - unparseable
exactly when needed. And an instruction the operator can't parse doesn't just annoy - it makes
them improvise, which turns your predicted-vs-actual feedback data into noise. Legibility at the
point of use is part of the learning loop's data quality.

The fix is a **per-artifact authoring standard** keyed to the consumption context:

- Name the moment of use: what is on the reader's screen, how much attention do they have?
- **Split action from rationale into separate fields.** The action line is imperative and fits
  in one line; the why lives in a rationale field read at planning time, never at use time.
- One action per branch; condition only on data the reader can actually see in that moment.
- If it doesn't fit in a line, it's too complex to use at the point of use - simplify the
  *decision*, not just the wording.

This generalizes past run-time instructions: error messages, checklist items, PR review
comments, and kickoff briefs all have a consumption context, and each is worth a one-paragraph
standard once you're generating many of them.

---

## The through-line

Every pattern here is the same move at a different altitude: **make the judgment cheap by making
the trigger mechanical, and make the trigger trustworthy by making the evidence explicit.**
N-counts gate abstractions, size checks gate splits, override rates gate autonomy, activation
criteria gate placeholder docs, re-open triggers gate deferrals. The human stays in exactly the
judgment seats that matter - and the system, not memory, decides when to summon them.

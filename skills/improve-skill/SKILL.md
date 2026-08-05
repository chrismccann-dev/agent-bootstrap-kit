---
name: improve-skill
disable-model-invocation: true
description: >
  Audit ONE skill's SKILL.md against a skill-writing rubric and emit a cut-ready report, then STOP
  (never edits the target). Use when a skill has grown bloated, its description over- or under-fires,
  or before a deliberate prune. Trigger: "improve-skill <skill-name>", "audit this skill", "is this
  skill bloated".
---

# improve-skill

A user-invoked audit of a single skill. It reads the skill against a rubric, emits a decisive,
cut-ready report, and **stops** - it never edits the target. The cuts are a separate, approved pass.

This is the skill-substrate sibling of a code architecture-review or a visual design-review: a
read-only auditor that finds the problem and hands you a plan, so a human stays in the loop at the
decision point that matters. It is also the *active* counterpart to [`self-improving-skill`](../self-improving-skill/SKILL.md):
that one is passive (after every run, the skill proposes small self-edits); this one is a deliberate,
rubric-driven audit you invoke on purpose.

> **Credit:** the rubric this applies - what makes a skill good (predictable shape, strong leading
> words, no dead no-op steps, no accumulated sediment) - is **Matt Pocock's** "Building Great
> Skills" ([mattpocock/skills](https://github.com/mattpocock/skills)). This skill is the *steps*
> layer that applies that rubric to a target. If you keep a fuller skill-writing rubric in your repo,
> **that rubric wins** - this skill composes over it, it does not restate it.

## What it composes over

- **The rubric** (what "good" means): Matt Pocock's writing-great-skills reference, or your repo's
  own skill-writing guide. Keep the vocabulary and failure-mode definitions there, not here.
- **A size signal** (when to prune): whatever tells you a skill got big - a `check:doc-sizes`-style
  script, or just eyeballing the line count.

`improve-skill` is the **how**: the procedure that turns "this skill feels bloated" into a specific,
defensible cut-list.

## Procedure

0. **Read the rubric + the target skill.** Don't audit from memory of either.

1. **Run the four-axis pass.** Tag each finding to a named failure mode from the rubric:
   - **Trigger** - is the `description` accurate triggers + one reach clause, nothing more? Does it
     fire when it should and stay quiet when it shouldn't? (For a model-invoked skill the description
     is the *only* text loaded every turn - it earns the hardest pruning.)
   - **Structure** - predictable shape, strong leading words, fixed output templates where they
     belong, dead no-op steps removed.
   - **Steering** - does each section steer the agent at runtime, or is it rationale for a human
     maintainer? (The maintainer-vs-agent test - see R5.) Rationale gets externalized; steering stays.
   - **Pruning** - measure the *real* line count first; identify decorative sediment to delete vs
     essential reference to keep.

2. **Cross-skill check (if it's part of a family).** Boilerplate repeated across N sibling skills is
   duplication at the family level even when each file is single-source. Flag it for extraction into
   a shared spine - but only when the shared mass actually earns it (R11).

3. **Emit the report, then STOP.** The report has four parts:
   - a **decisive lead recommendation** (the one change that matters most);
   - a **line-budget delta** = the sum of the cut-list only (R8), never a wishful round number;
   - **cut cards** - each proposed cut, what it is, why, where its content should live instead;
   - a **mandatory considered-and-kept** section (R4) - what looks like bloat but is doing real work.

   Do not edit the target. A separate, approved session applies the cuts.

## The rules it learned by running it (R1-R11)

This skill was hardened by running it on real skills, not by theorizing. Every rule below is a lived
correction - several caught wrong assumptions in the skill's own first draft.

- **R1 - Self-description is a claim, not a finding.** "Just a thin spine", "minimal" - measure the
  real line count before believing it.
- **R2 - Delete decorative provenance.** Bare dates, ticket/PR numbers, incident narratives belong
  in git history + a changelog, not the skill body. Don't inline-comment them - delete them. (Bounded
  by R10.)
- **R3 - The description = triggers + one reach clause.** Cut body-identity prose ("how it composes",
  "not a restructure"). For a model-invoked skill the description is loaded every single turn, so it
  earns the hardest pruning of anything in the file.
- **R4 - Considered-and-kept is mandatory.** A fixed output template, a flat rule-set, a gate that's
  actually doing work, a strong leading word - all read as "bloat" to a naive prune and are exactly
  what a careless cut wrecks. Half the value of the audit is the leave-alone list.
- **R5 - Maintainer-vs-agent test.** Does a section steer the agent at runtime, or is it rationale
  for a human? Rationale -> externalize or comment; steering stays in the body.
- **R6 - Family duplication counts.** Boilerplate restated across N sibling skills is duplication at
  the family level even if each file is its own single source.
- **R7 - Comments don't shrink a loaded body.** An HTML comment is still file text read at
  invocation. Commenting is a *legibility* move, not a *size* one. To shrink, delete or externalize.
- **R8 - The line-budget delta is the sum of the cut-list only.** Never a wishful total. A skill
  that's mostly essential rules barely shrinks - and that is the correct result (sometimes the only
  real win is a tighter per-turn description while the body stays the same size).
- **R9 - "Human-invoked" is orthogonal to "model-invoked."** A skill can be both: something you reach
  for deliberately AND something that fires from natural language. Don't flag model-invocation as
  wrong just because the body says "operator-run" - ask whether natural-language triggering is
  actually used.
- **R10 - The delete-provenance rule is for *decorative* provenance only.** A citation that is a
  rule's evidence, or a calibration example that IS the lesson, is essential reference - keep it.
- **R11 - Cross-skill extraction is shared-mass x N, not N alone.** A 2-line blockquote across 3
  skills stays inline; a 15-20 line spine across 3 skills earns a shared file.

## Additional rubric heuristics (from Matt Pocock's writing-for-agents)

These sharpen the four-axis pass. They're rubric ideas, not lived corrections - apply them, and let
a real run confirm them:

- **Environment-as-cache (Pruning).** A skill/doc line that restates what the agent can look up at
  runtime - `package.json`, config, a `--help`, the file tree - is a cache that goes stale. Only keep
  what the agent *can't* cheaply look up; delete the rest and let it read live.
- **Model-relative no-op test (Structure).** Whether a step is a dead no-op is settled by *running
  the doc*, not by debate. If removing the line changes nothing in a real run, it's a no-op - cut it.
- **Co-location (Structure/Steering).** Scattering the fragments of one instruction across many
  places is its own defect, *distinct from duplication* (which repeats one thing). If a single
  meaning is spread thin, pull the pieces together.
- **Prefer pretrained leading words.** A made-up leading word recruits no priors from the model; a
  well-chosen common word does. Favor words the model already understands over coined jargon.
- **Sequence-split only helps across a real boundary.** Splitting a step into a separate call only
  hides its post-completion detail when it crosses an actual context boundary (a subagent / hand-off).
  An *inline* "call this sub-procedure" clears nothing from the context - so don't split for size
  unless there's a genuine boundary.

## Standing policies this tends to produce

- **Keep skill bodies lean; git + a changelog are provenance's home** (bounded by R10 - evidence
  citations stay).
- **If you have a family of read-only auditor skills, share their common doctrine in one spine file**
  and change shared doctrine there, not per-skill (R6 + R11).

## Why report-then-stop

The trigger to audit can be mechanical; the prune is interpretive and stays operator-led. Separating
"find what to cut" from "make the cut" is what lets you keep judgment in the loop - the same reason
the code and visual review skills stop at a report too.

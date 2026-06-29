# Generic, Repeatable Skills

*Read this if you want the reusable working patterns - planning, grilling, delegation, audits,
simplification, handoffs - and the rules for authoring your own.*

Skills are reusable, named procedures the agent can invoke (`/skill-name`). The lesson from a
long-running repo: **a handful of meta-skills about *how you work* pay off far more than
domain-specific automation.** Build these four first; add domain skills later.

A note before the catalog: **don't build all of these on day one.** Each earns its place when you
feel the specific friction it removes. Start with grill-with-docs and plan→implement.

General skill-authoring rules that held up:
- A skill is a markdown file (`SKILL.md`) with a **description that says exactly when to trigger
  it** (the description is how the agent decides to reach for it - invest in it).
- Prototype the procedure 2-3 times *by hand* before you generalize it into a skill. Generalize
  from lived shape, not imagined shape. Premature skills encode the wrong abstraction.
- Skills compose: a coordinator skill calls sub-skills; a workflow skill reads reference docs.

---

## 1. grill-with-docs - build & defend shared understanding

**Purpose:** stress-test a plan or a new concept against the existing domain model and sharpen
terminology, updating the glossary / ADRs inline as decisions crystallize.

**Why it matters:** this is how the shared vocabulary stays precise and how you catch the case
where you and the agent *think* you agree but mean different things by a word. It's the antidote
to silent definition drift (principle 1).

**Shape:**
- The agent challenges the plan against documented decisions and existing terms: "you used X - is
  that the same X defined in the glossary, or a new sense? If new, what's the cardinality to Y?"
- Confabulation guard: the agent must grep/cite the actual doc before asserting what the docs say,
  not reconstruct it from memory.
- Decisions that crystallize get written to the glossary / an ADR *in the same session*.
- **This is an interpretive (grilling) session, not an executing one.** The human's input is
  the important signal; default to ask-don't-ship. Keep a "flagged ambiguities" ledger for things left
  unresolved, to drain next time.

**When to run it:** at the start and end of any feature that introduces or touches shared
vocabulary. Cheap insurance against building on a misunderstood term.

---

## 2. self-improving skills - skills update themselves after each use

**Purpose:** every skill, at the end of an invocation, looks back at its own definition and
proposes improvements based on the friction it just hit. Skills compound like docs do.

**Why it matters:** the first version of any skill is wrong in ways you only discover by running
it. Bake the improvement loop in and the skill converges on something good without a dedicated
"improve the skills" project.

**Shape:**
- At the end of a skill run, the agent asks: "what was awkward / underspecified / missing in this
  skill's instructions? What would have made this run smoother?"
- It proposes a concrete edit to the `SKILL.md` (a clarified step, a new gotcha, a removed dead
  branch). You approve or it applies per your autonomy contract.
- Keep the edits small and additive. A skill that's been run 20 times and improved each time is
  dramatically better than its v1 - for free.

**Guardrail:** treat a self-edit to a skill as a substrate change - if the skill is referenced
elsewhere, audit those references (lesson 06).

---

## 3. plan → implement - the core build loop

**Purpose:** separate *deciding what to build* from *building it*. The single most important
process pattern.

**Shape (scales with size):**

- **Small/concrete:** one session. Brief plan stated → agreed → implemented → verified. Plan mode
  for anything interpretive (principle 5), straight to code for genuinely concrete fixes.

- **Medium:** plan mode produces a written plan (lands in `docs/features/...`), you approve, then
  the same session implements. Success criteria stated before code (principle 6). No placeholders
  in the plan.

- **Large (needs decomposition):** the plan phase produces a decomposition, then an
  **implementing-coordinator** session (see skill 4) spawns executing sub-sessions, one per
  workstream, and rolls up + reviews their output. The coordinator never loses the thread; the
  sub-sessions never see each other.

**The seam that matters:** the phase that *asks* (planning, grilling, Q&A) and the phase that
*synthesizes into a brief* are distinct. When you write the implementation brief after a planning
discussion, write it as a **synthesis of decisions already made**, not a fresh interview - pull
every resolved decision in; list under "open questions" only what's genuinely still open. Don't
relitigate settled calls while writing the brief.

**Brief format (paste-ready):**
```
Problem:        [the friction being closed, one line, from the workflow's view]
Goal:           [1-2 sentences]
Scope:          in: [...]  out: [...]
Entry surface:  [which skill/prompt/session the implementer enters through]
Files likely:   [paths]
Verification:   [how we'll know it works]
Open questions: [only genuinely-unresolved items]
Mode:           EXECUTING (autonomy applies) | GRILLING (ask, don't ship)
```

---

## 4. coordinator-spawn - delegation with handoffs

**Purpose:** the repeated pattern where one session stays the **coordinator**, hands a
self-contained task to a sub-agent/session that does the work, and hands back for roll-up +
review. Division of responsibility across contexts.

**Why it matters:** context is finite. A big job done in one context degrades as the window fills.
Decomposing into briefed sub-tasks keeps each worker sharp and lets independent work run in
parallel.

**Shape:**
- **Coordinator** decomposes the work into independent units and writes a **self-contained brief
  per unit.** The brief must stand alone - the sub-agent has *none* of the coordinator's
  conversation. Include paths, context, success criteria, and "return X as your result."
- **Sub-agents** execute and return *conclusions/structured results*, not raw file dumps. (If
  your harness supports it: run independent sub-agents in parallel; isolate them in separate
  worktrees when they mutate files concurrently.)
- **Coordinator rolls up:** reviews each result, reconciles conflicts, owns the final conclusion.
  It does NOT just concatenate outputs - it judges them.
- **Hand back to a human** at the decision points the contract reserves for a human (lesson 06,
  autonomy).

**When to reach for it:** any task that (a) won't fit one context, (b) decomposes into independent
parallel pieces, or (c) benefits from independent verification (spawn N skeptics to refute a
finding before you trust it).

**Composability note:** plan→implement (skill 3) at large scale *is* coordinator-spawn (skill 4)
in its implement phase. They're the same primitive at different altitudes.

---

## Other skills worth standing up (as friction appears)

- **simplify** - a quality-only pass over the changed code for duplication / over-engineering /
  copy-paste at a distance. Run once per unit of work, after implementation, before commit. Agents
  over-engineer; this catches it cheaply. Have it read the *whole file*, not just the diff -
  duplication often sits 100+ lines from the change.
- **verify / preview** - drive the actual app (or run the real flow with real input) and observe
  behavior, rather than asserting "it should work." For UI: screenshot. For data: inspect the
  persisted result, don't trust the render.
- **architecture-review** - read-only, repo-wide audit of a named surface: duplication-at-distance,
  large mixed-concern files, weak type boundaries, doc rot. Emits a recommendation + candidates +
  considered-and-rejected, then STOPS at the report (never edits). The judgment-heavy sibling of
  simplify; operator-invoked when you want a refactor scoped before building it.
- **route-feedback → plan-feedback** (a two-skill pipeline) - if you accumulate friction notes
  across sessions: one skill *intakes* a batch of feedback and routes each item to its home
  (logging recurrence counts), the other *plans* - clusters the backlog, prioritizes by recurrence
  + severity, and emits a kickoff brief. Worth it once you have enough sessions that friction
  recurs and you want to act on patterns, not anecdotes.
- **consolidate-memory** - a periodic reflective pass over memory files: merge duplicates, fix
  stale facts, prune the index. Run on a cadence, not just when something feels off.

The pattern across all of these: **read-only auditors that stop at a report** are safer and more
reusable than skills that edit. Separate "find the problem" from "fix the problem" - it lets you
keep a human in the loop at exactly the decision point that matters.

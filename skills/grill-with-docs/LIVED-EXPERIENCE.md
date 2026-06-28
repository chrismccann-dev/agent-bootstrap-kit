# grill-with-docs — Lived Experience

The `SKILL.md` next to this file is the protocol. This doc is the **operating layer that emerged
from ~15+ real grilling sessions** on a long-running agent-driven repo, plus a second repo's first
adoption. The protocol is ~20% of the value; the discipline rules and the mode judgment are the
other 80% — and they're where every failure actually happened. Read this before running a serious
grill.

## Why it exists

Most "bugs" in an agent-driven system are not logic bugs. They are **definition bugs**: a term
means one thing to the human and another to the agent, or a definition changes in one place and not
the others. Grilling is the maintenance ritual that keeps shared language honest across every actor
that reads the repo (the human, the coding agent, future specialist agents, the docs, any external
client). It matters most where imprecise vocabulary causes *real* harm — provenance-sensitive
nouns, source-of-truth rules, actor responsibilities.

## The three discipline rules (R1-R3)

These came out of one brutal session that caught **three confabulations** — terms the agent
confidently declared "missing from the glossary" that already existed as headwords.

**R1. Grep-first, write-second.** Every "X is missing / X has no definition" claim must be
grep-verified against the actual docs *before* you record it. Confabulation under impression-reading
(an agent skimming a long doc and generating structural claims from vibes instead of a verified
index) is the **dominant failure mode** — assume any such claim is false until search proves it. For
any doc over ~500 lines, build a headword index once and cache it before asserting what's in it. If
the glossary is split into zones, grep *every* zone — a term may live outside the file you opened.

```sh
# adapt the headword pattern + file list to your repo
rg -n "^### |^\*\*|\b<TERM>\b" GLOSSARY.md SYSTEM.md AGENTS.md docs
```

**R2. Analytical-vs-operational classification.** Before drafting a glossary entry, classify the
candidate. **Analytical** (belongs in the glossary): concepts the system reasons about, domain nouns
with relationships/cardinality, lifecycle states multiple workflows share. **Operational** (does
*not* belong): procedural steps, command names, equipment instances, file-naming conventions,
one-off implementation detail. Ask: *"does the operational doc describe HOW to use this (out of
scope) or does the glossary need to define WHAT this is relative to the model (in scope)?"* Most
candidates should be **rejected** by this rule — in the session that birthed it, R2 ruled out 6 of 8
candidate terms. A small glossary stays useful.

**R3. Confabulation ledger.** Every search that catches a false claim gets logged during the
session. It's process telemetry, not busywork: if confabulations rise across sessions, grep-first
discipline is slipping.

| Round | Claim | Actual state | Correction |
|---|---|---|---|
| 1 | "`Work` is undefined" | `GLOSSARY.md` defines `Work` | Don't add duplicate; sharpen existing entry if needed |

## Order of operations inside a session

1. Search before making any doc-structure claim (R1).
2. Classify the candidate as analytical or operational (R2).
3. Log confabulations as they happen (R3).
4. Ask one question. Recommend an answer + name the trade-off.
5. Wait for the human's answer.
6. If resolved, update the glossary / system docs **inline** — never batch to the end; precision is
   highest at the moment the decision resolves.
7. Repeat.

## Grilling is not executing (the most important rule)

The repo's normal **autonomy rule** says approved work gets committed, pushed, PR'd, merged,
deployed without extra permission. A grilling session is the **opposite**: the decisions aren't made
yet, and the human's answer is the load-bearing signal. The expensive failure: a grilling kickoff
brief written in *execution* shape (referenced the autonomy rule, pre-picked the implementation,
said "ship via standard PR") — the next session correctly read it as authorization and shipped four
interpretive calls without ever asking.

**Stop-sign header for any grilling kickoff brief:**

```text
THIS IS A GRILLING SESSION. DO NOT EXECUTE.
Interview in long-form prose on every substrate-altering call.
Ask one question at a time. Default to ask, do not ship.
Do not reference the normal autonomy rule.
Do not pre-pick implementation details.
Do not frame the work as a small mechanical sprint.
```

Forbidden phrasing: "ship via standard commit + push + PR", "small mechanical sprint", "should land
cleanly", "add the new enum value", "READY means ship it." For grilling, **READY means well-scoped
enough to discuss next — not approved to implement.**

## When it fires

Run a short grill at the **start and end of non-trivial feature work**, proactively (the human won't
remember to ask). At kickoff: *"does this feature introduce or depend on vocabulary that isn't
locked?"* At close, before the PR: *"did this change introduce new substrate — terms, workflow
boundaries, status values, source-of-truth rules, actor responsibilities?"* If yes, grill and update
the docs **in the same PR** — never a follow-up sprint. Pure refactors usually don't need a grill.

## Mature artifacts (grow them only as pain appears)

- `GLOSSARY.md` — canonical shared vocabulary.
- `docs/adr/` — durable decisions meeting the ADR threshold (hard-to-reverse + surprising + a real
  trade-off). Keep them rare.
- `docs/grilling-queue.md` — queued concepts/questions, graded `READY` / `OBSERVING` / `BRAINSTORM`,
  with an append-only Resolved history.
- a **flagged-ambiguities ledger** — terms whose meaning isn't settled; parked, not force-resolved.
- per-session docs `docs/sprints/grilling-YYYY-MM-DD-topic.md` — summary, new headwords +
  relationships, confabulation ledger, follow-ups.
- a **ratification queue** — recovery list for interpretive calls that accidentally shipped without a
  grill. Its entry count is process-debt telemetry: growing = briefs still being mis-framed; zero =
  healthy.

Don't create all of these on day one. The minimal useful set is just `GLOSSARY.md` + the skill + a
purpose-defining kickoff brief.

## Standalone fallback (no `/domain-modeling` skill present)

The upstream skill is thin because it delegates to a separate `/domain-modeling` skill. If your
runtime doesn't have that, the grill *is* the domain-modeling pass — do it inline:

1. **Read the docs/code/manifests first** (R1).
2. **Identify the concept type** and the nearby existing terms (R2).
3. **Sketch the model**: entities, relationships, cardinality, ownership, lifecycle states, and the
   source-of-truth / write path.
4. **Test the model** with concrete examples and edge cases — invent scenarios that force precise
   boundaries between concepts.
5. **Ask crisp questions**, one at a time, each with a recommended answer.
6. **Update glossary / ADR / docs only after confirmation** — glossary reserved for
   definitions + relationships, ADRs reserved for hard-to-reverse trade-offs.

## The lessons, condensed

1. Confabulation is the **default** failure, not the exception — grep-first exists because a capable
   model will confidently lie about a doc it skimmed.
2. Keep the glossary **tiny** — R2's whole job is saying "no, that's operational."
3. **Inline-as-you-go** beats batch.
4. ADRs stay **rare**.
5. The **mode header is a safety device** — a good kickoff brief prevents accidental implementation;
   a bad one authorizes it.
6. Any surface the agent **can't directly edit** (an external client's memory/instructions, a SaaS
   config) drifts silently and needs a manual review pass at the end of the grill.

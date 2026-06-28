# Data Model — detail

On-demand reference. **Read the relevant section when touching that column or migration.** The
every-session shape lives in `CLAUDE.md`'s Data Model roster; this is the deep detail that would
bloat it.

## [Entity]

### Columns
| Column | Type | Added | Notes / provenance |
|---|---|---|---|
| [col] | [type] | [migration NNN] | [populate-side notes, gotchas] |

### Relationships
- [entity] → [entity] via `[fk_column]` — [cardinality, backfill notes]

## Invariants (the rules that cause silent corruption if violated)
- [e.g. joins are by FK, never text matching]
- [e.g. new rows MUST set X and Y on insert]

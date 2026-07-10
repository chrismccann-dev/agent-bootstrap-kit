# Doc Tripwires

Size caps on **always-loaded** context. Always-loaded docs compete for the agent's finite attention
budget, so we cap them and fire a check when one overflows. The *trigger* is automated; the *prune*
stays operator-led (judgment about what to extract vs cut).

When a doc crosses its cap, the move is almost always **extract detail to an on-demand doc + leave a
thin index/redirect stub**, not delete. Split by loading profile.

## Registry

| Surface | Loading profile | Cap | Current |
|---|---|---|---|
| `CLAUDE.md` | every session | [40] KB | [-] |
| `PRODUCT.md` | read early | [40] KB | [-] |
| `GLOSSARY.md` | as needed | [40] KB | [-] |
| [other always-loaded doc] | [profile] | [cap] | [-] |

## Other tripwires worth registering
- **Tool/endpoint count** crosses [N] → consider consolidating tools.
- **Memory index size** at warning → run the memory-consolidation pass.
- **A single file's churn × size** high → run an architecture review on it.

## Enforcement
- `scripts/check-docs.mjs` enforces this registry (plus required-docs-exist and links-resolve).
  Keep its `SIZE_CAPS_KB` block in sync with the table above, wire it to CI on every PR, and add a
  daily cron as the catch-all. (`lessons/06-enforcement-and-audit.md` describes the pattern.)
- A firing size tripwire triggers a *manual* prune - extract to an on-demand doc + leave a stub,
  don't just trim words. Size caps catch bloat, not rot: schedule a periodic pruning pass too
  (`lessons/08-scale-lessons.md` §3).

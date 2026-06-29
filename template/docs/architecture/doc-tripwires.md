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
- A `check:doc-sizes` script should fail CI when any surface is over cap, with a daily cron catch-all.
  (`lessons/06-enforcement-and-audit.md` describes the pattern; the script itself is per-project.)

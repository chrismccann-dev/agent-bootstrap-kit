#!/usr/bin/env node
// check:privacy - deterministic enforcement of the local content boundary (lessons/10).
//
// OPTIONAL - only for source-bearing repos. .gitignore prevents accidental staging; this script
// catches what it can't: a protected file that was force-added, a protected root nobody ignored.
// Checks:
//   1. No tracked file falls under a protected path.
//   2. Every protected path is covered by the repo's ignore rules.
//   3. The boundary doc exists (the declaration the protections implement).
//
// Exits non-zero and prints exactly what drifted. No dependencies.
// Wire it up:  "check:privacy": "node scripts/check-privacy.mjs"  (+ CI on every PR).

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

// ---- Tune to your repo: keep in sync with docs/local-content-boundary.md ----

const PROTECTED_PREFIXES = ["sources/", "local/"];
const BOUNDARY_DOC = "docs/local-content-boundary.md";

// -----------------------------------------------------------------------------

const failures = [];

if (!existsSync(BOUNDARY_DOC)) {
  failures.push(`missing boundary doc: ${BOUNDARY_DOC} (declare the boundary these checks enforce)`);
}

const tracked = execSync("git ls-files --cached", { encoding: "utf8" }).split("\n").filter(Boolean);

for (const file of tracked) {
  const hit = PROTECTED_PREFIXES.find((p) => file.startsWith(p));
  if (hit) {
    failures.push(`tracked file under protected path ${hit}: ${file} - untrack it (git rm --cached), then investigate how it got added`);
  }
}

for (const prefix of PROTECTED_PREFIXES) {
  // git check-ignore exits 0 iff the path would be ignored.
  const probe = `${prefix}__privacy_probe__`;
  const res = execSync(`git check-ignore -q "${probe}" && echo ignored || echo not-ignored`, {
    encoding: "utf8",
    shell: "/bin/sh",
  }).trim();
  if (res !== "ignored") {
    failures.push(`protected path not covered by ignore rules: ${prefix} - add it to .gitignore`);
  }
}

if (failures.length) {
  console.error(`check:privacy FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`check:privacy OK (${PROTECTED_PREFIXES.length} protected paths, ${tracked.length} tracked files scanned)`);

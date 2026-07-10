#!/usr/bin/env node
// check:docs - the kit's first deterministic enforcement script.
//
// Checks three invariants (lessons 06/07: "prose is insufficient; the script is the enforcement"):
//   1. Required docs exist.
//   2. Every relative markdown link in every tracked .md file resolves to a real file.
//   3. No always-loaded doc exceeds its size cap (the doc-tripwires registry).
//
// Exits non-zero and prints exactly what drifted. No dependencies.
// Wire it up:  "check:docs": "node scripts/check-docs.mjs"  (+ CI on every PR, daily cron).

import { readFileSync, existsSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join, normalize } from "node:path";

// ---- Tune these three blocks to your repo ---------------------------------

const REQUIRED_DOCS = [
  "CLAUDE.md", // or AGENTS.md - whatever your runtime loads every session
  "PRODUCT.md",
  "GLOSSARY.md",
];

// Size caps in KB for always-loaded surfaces. Keep in sync with
// docs/architecture/doc-tripwires.md (that file is the registry; this is the enforcement).
const SIZE_CAPS_KB = {
  "CLAUDE.md": 40,
  "PRODUCT.md": 40,
  "GLOSSARY.md": 40,
};

// Links into these path prefixes are skipped (external tools, generated dirs, etc.).
const SKIP_LINK_PREFIXES = ["node_modules/"];

// ---------------------------------------------------------------------------

const failures = [];

// Tracked + staged markdown files, so new docs are checked before they're committed.
const mdFiles = execSync("git ls-files --cached --others --exclude-standard '*.md'", {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

for (const doc of REQUIRED_DOCS) {
  if (!existsSync(doc)) failures.push(`missing required doc: ${doc}`);
}

for (const [doc, capKb] of Object.entries(SIZE_CAPS_KB)) {
  if (!existsSync(doc)) continue;
  const kb = statSync(doc).size / 1024;
  if (kb > capKb) {
    failures.push(
      `tripwire: ${doc} is ${kb.toFixed(1)}KB (cap ${capKb}KB) - prune by extracting to an on-demand doc, don't just trim words`,
    );
  }
}

// Relative markdown links: [text](path), skipping http(s), mailto, and pure #anchors.
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;

for (const file of mdFiles) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(LINK_RE)) {
    let target = match[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    target = decodeURI(target.split("#")[0]);
    if (!target) continue;
    const resolved = normalize(target.startsWith("/") ? target.slice(1) : join(dirname(file), target));
    if (SKIP_LINK_PREFIXES.some((p) => resolved.startsWith(p))) continue;
    if (!existsSync(resolved)) {
      failures.push(`broken link in ${file}: (${match[1]}) -> ${resolved} does not exist`);
    }
  }
}

if (failures.length) {
  console.error(`check:docs FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`check:docs OK (${mdFiles.length} markdown files scanned)`);

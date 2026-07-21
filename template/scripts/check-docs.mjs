#!/usr/bin/env node
// check:docs - the kit's first deterministic enforcement script.
//
// Checks four invariants (lessons 06/07: "prose is insufficient; the script is the enforcement"):
//   1. Required docs exist.
//   2. Every relative markdown link in every markdown file resolves to a real file.
//   3. Every #anchor (same-file or cross-file into a .md) matches a real heading.
//   4. No always-loaded doc exceeds its size cap (the doc-tripwires registry).
//
// Scans tracked + untracked-but-not-ignored .md files, so new docs are checked before they're
// committed. Links inside fenced code blocks and inline code spans are ignored.
// Exits non-zero and prints exactly what drifted. No dependencies.
// Wire it up:  "check:docs": "node scripts/check-docs.mjs"  (+ CI on every PR, daily cron).

import { readFileSync, existsSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join, normalize } from "node:path";

// ---- Tune these blocks to your repo ---------------------------------------

// The file your runtime loads every session. Auto-discovers the common names so a documented
// rename (CLAUDE.md -> AGENTS.md) doesn't break the check; pin it explicitly once chosen, e.g.:
//   const ROOT_INDEX = "AGENTS.md";
const ROOT_INDEX =
  ["CLAUDE.md", "AGENTS.md"].find((f) => existsSync(f)) ?? "CLAUDE.md";

const REQUIRED_DOCS = [ROOT_INDEX, "PRODUCT.md", "GLOSSARY.md"];

// Size caps in KB for always-loaded surfaces. Keep in sync with
// docs/architecture/doc-tripwires.md (that file is the registry; this is the enforcement).
const SIZE_CAPS_KB = {
  [ROOT_INDEX]: 40,
  "PRODUCT.md": 40,
  "GLOSSARY.md": 40,
};

// Links into these path prefixes are skipped (generated dirs, vendored trees, etc.).
const SKIP_LINK_PREFIXES = ["node_modules/"];

// ---------------------------------------------------------------------------

const failures = [];

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

// Fenced code blocks are invisible to both heading and link scanning. Inline code spans are
// additionally stripped for link scanning only - a heading's `code` text stays part of its slug.
const stripFences = (text) => text.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, "");
const stripInlineCode = (text) => text.replace(/`[^`\n]*`/g, "");

// GitHub-style heading anchors: lowercase, drop punctuation, spaces -> hyphens,
// duplicate headings get -1, -2, ... suffixes.
function headingAnchors(text) {
  const anchors = new Set();
  const seen = new Map();
  for (const m of text.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
    const slug = m[1]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // heading text of a link, not its target
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\- ]/gu, "")
      .trim()
      .replace(/ +/g, "-");
    const n = seen.get(slug) ?? 0;
    seen.set(slug, n + 1);
    anchors.add(n === 0 ? slug : `${slug}-${n}`);
  }
  return anchors;
}

const fenceStripped = new Map(mdFiles.map((f) => [f, stripFences(readFileSync(f, "utf8"))]));
const anchorCache = new Map();
const anchorsOf = (file) => {
  if (!anchorCache.has(file)) {
    anchorCache.set(file, headingAnchors(fenceStripped.get(file) ?? stripFences(readFileSync(file, "utf8"))));
  }
  return anchorCache.get(file);
};

// [text](target), ![alt](target), targets may be <bracketed with spaces> or carry a "title".
const LINK_RE = /!?\[[^\]]*\]\(\s*(<[^>]*>|[^)\s]+)(?:\s+"[^"]*")?\s*\)/g;

for (const file of mdFiles) {
  for (const match of stripInlineCode(fenceStripped.get(file)).matchAll(LINK_RE)) {
    let target = match[1].startsWith("<") ? match[1].slice(1, -1) : match[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue; // http(s):, mailto:, etc.

    const [path, ...anchorParts] = target.split("#");
    const anchor = anchorParts.join("#");
    const resolved = path
      ? normalize(decodeURI(path).startsWith("/") ? decodeURI(path).slice(1) : join(dirname(file), decodeURI(path)))
      : file; // pure #anchor -> same file
    if (SKIP_LINK_PREFIXES.some((p) => resolved.startsWith(p))) continue;

    if (!existsSync(resolved)) {
      failures.push(`broken link in ${file}: (${match[1]}) -> ${resolved} does not exist`);
      continue;
    }
    if (anchor && resolved.endsWith(".md") && !anchorsOf(resolved).has(anchor.toLowerCase())) {
      failures.push(`broken anchor in ${file}: (${match[1]}) -> no heading #${anchor} in ${resolved}`);
    }
  }
}

if (failures.length) {
  console.error(`check:docs FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`check:docs OK (${mdFiles.length} markdown files scanned)`);

#!/usr/bin/env node
// Fixture tests for template/scripts/check-docs.mjs.
//
// Lives at the KIT level (not in template/) so fixtures don't ride along into every new repo.
// Each case builds a throwaway git repo in a tmp dir, runs the checker, and asserts on exit code
// + failure messages. Run:  node tests/check-docs.test.mjs

import { mkdtempSync, rmSync, mkdirSync, writeFileSync, cpSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KIT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER = join(KIT_ROOT, "template", "scripts", "check-docs.mjs");

let passed = 0;
const errors = [];

function runCase(name, { files, expectExit, expectMsgs = [], rejectMsgs = [] }) {
  const dir = mkdtempSync(join(tmpdir(), "check-docs-test-"));
  try {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(join(dir, dirname(path)), { recursive: true });
      writeFileSync(join(dir, path), content);
    }
    mkdirSync(join(dir, "scripts"), { recursive: true });
    cpSync(CHECKER, join(dir, "scripts", "check-docs.mjs"));
    execSync("git init -q && git add -A", { cwd: dir });

    const res = spawnSync("node", ["scripts/check-docs.mjs"], { cwd: dir, encoding: "utf8" });
    const out = res.stdout + res.stderr;
    const problems = [];
    if (res.status !== expectExit) problems.push(`expected exit ${expectExit}, got ${res.status}`);
    for (const msg of expectMsgs) if (!out.includes(msg)) problems.push(`missing expected output: "${msg}"`);
    for (const msg of rejectMsgs) if (out.includes(msg)) problems.push(`unexpected output: "${msg}"`);

    if (problems.length) errors.push(`FAIL ${name}\n  ${problems.join("\n  ")}\n  --- output ---\n${out}`);
    else passed++;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const CORE = {
  "PRODUCT.md": "# Product\n",
  "GLOSSARY.md": "# Glossary\n\n## Terms\n",
};

runCase("claude-root passes", {
  files: { ...CORE, "CLAUDE.md": "# Root\n\nSee [product](PRODUCT.md).\n" },
  expectExit: 0,
});

runCase("agents-root passes (documented Codex rename)", {
  files: { ...CORE, "AGENTS.md": "# Root\n\nSee [product](PRODUCT.md).\n" },
  expectExit: 0,
});

runCase("no root index fails with the claude default", {
  files: { ...CORE },
  expectExit: 1,
  expectMsgs: ["missing required doc: CLAUDE.md"],
});

runCase("valid link/anchor forms all pass", {
  files: {
    ...CORE,
    "CLAUDE.md": "# Root\n",
    "docs/my file.md": "# Spaced\n",
    "docs/img.png": "png",
    "docs/a.md": [
      "# Fixture Doc",
      "",
      "## Setup Notes",
      "## Setup Notes",
      "### With `code` in heading",
      "",
      "[same-file](#setup-notes) [dup](#setup-notes-1) [code-head](#with-code-in-heading)",
      "[cross](../GLOSSARY.md#terms) [spaced](<my file.md>) [titled](../PRODUCT.md \"t\")",
      "![img](img.png) [ext](https://example.com/x#y) [mail](mailto:a@b.c)",
      "",
      "```bash",
      "# not a heading",
      "[ignored](nope-in-fence.md)",
      "```",
      "",
      "Inline `[ignored too](nope-inline.md)` code.",
      "",
    ].join("\n"),
  },
  expectExit: 0,
  rejectMsgs: ["nope-in-fence", "nope-inline"],
});

runCase("broken link, broken anchors, and size tripwire all fire", {
  files: {
    ...CORE,
    "CLAUDE.md": "# Root\n" + "x".repeat(45 * 1024),
    "docs/a.md": "# A\n\n[gone](missing.md) [bad](#nope) [xbad](../GLOSSARY.md#nope)\n",
  },
  expectExit: 1,
  expectMsgs: [
    "docs/missing.md does not exist",
    "no heading #nope in docs/a.md",
    "no heading #nope in GLOSSARY.md",
    "tripwire: CLAUDE.md",
  ],
});

if (errors.length) {
  console.error(errors.join("\n\n"));
  console.error(`\n${passed} passed, ${errors.length} failed`);
  process.exit(1);
}
console.log(`all ${passed} cases passed`);

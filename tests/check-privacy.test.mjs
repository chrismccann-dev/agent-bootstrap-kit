#!/usr/bin/env node
// Fixture tests for template/scripts/check-privacy.mjs. Run: node tests/check-privacy.test.mjs

import { mkdtempSync, rmSync, mkdirSync, writeFileSync, cpSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KIT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECKER = join(KIT_ROOT, "template", "scripts", "check-privacy.mjs");

let passed = 0;
const errors = [];

function runCase(name, { files, setup, expectExit, expectMsgs = [] }) {
  const dir = mkdtempSync(join(tmpdir(), "check-privacy-test-"));
  try {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(join(dir, dirname(path)), { recursive: true });
      writeFileSync(join(dir, path), content);
    }
    mkdirSync(join(dir, "scripts"), { recursive: true });
    cpSync(CHECKER, join(dir, "scripts", "check-privacy.mjs"));
    execSync("git init -q && git add -A", { cwd: dir });
    if (setup) execSync(setup, { cwd: dir });

    const res = spawnSync("node", ["scripts/check-privacy.mjs"], { cwd: dir, encoding: "utf8" });
    const out = res.stdout + res.stderr;
    const problems = [];
    if (res.status !== expectExit) problems.push(`expected exit ${expectExit}, got ${res.status}`);
    for (const msg of expectMsgs) if (!out.includes(msg)) problems.push(`missing expected output: "${msg}"`);

    if (problems.length) errors.push(`FAIL ${name}\n  ${problems.join("\n  ")}\n  --- output ---\n${out}`);
    else passed++;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const CLEAN = {
  ".gitignore": "sources/\nlocal/\n",
  "docs/local-content-boundary.md": "# Local Content Boundary\n",
  "README.md": "# Repo\n",
};

runCase("clean source-bearing repo passes", {
  files: CLEAN,
  expectExit: 0,
});

runCase("force-added protected file fails", {
  files: { ...CLEAN, "sources/secret.md": "confidential\n" },
  setup: "git add -f sources/secret.md",
  expectExit: 1,
  expectMsgs: ["tracked file under protected path sources/: sources/secret.md"],
});

runCase("uncovered protected path fails", {
  files: { ...CLEAN, ".gitignore": "sources/\n" }, // local/ not ignored
  expectExit: 1,
  expectMsgs: ["protected path not covered by ignore rules: local/"],
});

runCase("missing boundary doc fails", {
  files: { ".gitignore": "sources/\nlocal/\n", "README.md": "# Repo\n" },
  expectExit: 1,
  expectMsgs: ["missing boundary doc: docs/local-content-boundary.md"],
});

if (errors.length) {
  console.error(errors.join("\n\n"));
  console.error(`\n${passed} passed, ${errors.length} failed`);
  process.exit(1);
}
console.log(`all ${passed} cases passed`);

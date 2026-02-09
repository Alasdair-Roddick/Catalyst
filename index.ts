#!/usr/bin/env bun

import { resolve, join } from "path";
import { cpSync, readFileSync, writeFileSync, existsSync } from "fs";

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
  console.log("\x1b[31mUsage:\x1b[0m bunx create-catalyst <project-name>");
  process.exit(1);
}

const targetDir = resolve(process.cwd(), projectName);

if (existsSync(targetDir)) {
  console.log(`\x1b[31mError:\x1b[0m Directory "${projectName}" already exists.`);
  process.exit(1);
}

const templateDir = resolve(import.meta.dir, "template");

console.log();
console.log("\x1b[1m\x1b[33m  Catalyst\x1b[0m");
console.log();
console.log(`  Creating \x1b[1m${projectName}\x1b[0m...`);

// Copy template
cpSync(templateDir, targetDir, { recursive: true });

// Update package.json name
const pkgPath = join(targetDir, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
pkg.name = projectName;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

// Install dependencies
console.log("  Installing dependencies...\n");
const result = Bun.spawnSync(["bun", "install"], {
  cwd: targetDir,
  stdout: "inherit",
  stderr: "inherit",
});

if (result.exitCode !== 0) {
  console.log("\n\x1b[31m  Failed to install dependencies.\x1b[0m");
  process.exit(1);
}

console.log();
console.log("  \x1b[32mDone!\x1b[0m Your Catalyst app is ready.\n");
console.log("  Next steps:\n");
console.log(`    cd ${projectName}`);
console.log("    bun run dev\n");

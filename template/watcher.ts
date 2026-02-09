/**
 * Catalyst dev server — watches src/ for changes,
 * rebuilds Tailwind CSS, and restarts the server.
 */

import { watch } from "fs";
import { resolve, basename, extname } from "path";

const PROJECT_ROOT = import.meta.dir;
const SRC_DIR = resolve(PROJECT_ROOT, "src");
const DEBOUNCE_MS = 800;

const IGNORE_NAMES = new Set(["output.css", ".DS_Store"]);
const IGNORE_SUFFIXES = [".swp", ".tmp", "~"];
const WATCH_EXTENSIONS = new Set([".tsx", ".ts", ".css"]);

let serverProcess: ReturnType<typeof Bun.spawn> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingFiles = new Set<string>();

function buildTailwind() {
  console.log("[catalyst] Rebuilding CSS...");
  Bun.spawnSync(
    ["bunx", "@tailwindcss/cli", "-i", "src/app/styles/input.css", "-o", "public/output.css"],
    { cwd: PROJECT_ROOT, stdout: "inherit", stderr: "inherit" },
  );
}

async function restartServer() {
  if (serverProcess) {
    console.log("[catalyst] Restarting server...");
    serverProcess.kill();
    await serverProcess.exited;
  }

  serverProcess = Bun.spawn(["bun", "run", "src/app/server.tsx"], {
    cwd: PROJECT_ROOT,
    stdout: "inherit",
    stderr: "inherit",
  });
}

function shouldIgnore(filename: string): boolean {
  if (IGNORE_NAMES.has(filename)) return true;
  return IGNORE_SUFFIXES.some((s) => filename.endsWith(s));
}

function handleChange(filename: string) {
  const ext = extname(filename);
  if (!WATCH_EXTENSIONS.has(ext)) return;
  if (shouldIgnore(basename(filename))) return;

  pendingFiles.add(filename);

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const files = [...pendingFiles].sort();
    pendingFiles.clear();
    console.log(`[catalyst] Changed: ${files.join(", ")}`);
    buildTailwind();
    restartServer();
  }, DEBOUNCE_MS);
}

// Initial build
buildTailwind();
await restartServer();

// Watch for changes
const watcher = watch(SRC_DIR, { recursive: true }, (_event, filename) => {
  if (filename) handleChange(filename);
});

console.log("[catalyst] Watching for changes... (Ctrl+C to stop)\n");

process.on("SIGINT", () => {
  console.log("\n[catalyst] Shutting down...");
  watcher.close();
  if (serverProcess) serverProcess.kill();
  process.exit(0);
});

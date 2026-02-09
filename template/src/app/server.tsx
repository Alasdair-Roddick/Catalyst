import { renderToString } from "react-dom/server";
import { Glob } from "bun";
import { resolve, dirname } from "path";
import React from "react";

const PAGES_DIR = resolve(import.meta.dir, "pages");

// --- Auto route + layout discovery ---

type Route = {
  page: React.ComponentType;
  layouts: React.ComponentType<{ children: React.ReactNode }>[];
};

async function discoverRoutes(): Promise<Map<string, Route>> {
  const routes = new Map<string, Route>();
  const glob = new Glob("**/page.tsx");

  for await (const file of glob.scan(PAGES_DIR)) {
    const fullPath = resolve(PAGES_DIR, file);
    const dir = dirname(file);

    const urlPath = dir === "." ? "/" : "/" + dir;

    const pageModule = await import(fullPath);

    // Collect layouts from root down to this page's directory
    const layouts: React.ComponentType<{ children: React.ReactNode }>[] = [];
    const segments = dir === "." ? [] : dir.split("/");

    // Root layout
    await tryAddLayout(PAGES_DIR, layouts);

    // Nested layouts
    let current = PAGES_DIR;
    for (const segment of segments) {
      current = resolve(current, segment);
      await tryAddLayout(current, layouts);
    }

    routes.set(urlPath, { page: pageModule.default, layouts });
  }

  return routes;
}

async function tryAddLayout(
  dir: string,
  layouts: React.ComponentType<{ children: React.ReactNode }>[],
) {
  const layoutPath = resolve(dir, "layout.tsx");
  const file = Bun.file(layoutPath);
  if (await file.exists()) {
    const mod = await import(layoutPath);
    layouts.push(mod.default);
  }
}

// Discover routes at startup
const routes = await discoverRoutes();

console.log(`[catalyst] ${routes.size} route(s):`);
for (const [path] of routes) {
  console.log(`  ${path}`);
}

// --- Server ---

Bun.serve({
  port: 2020,

  fetch(req) {
    const url = new URL(req.url);

    // Live reload SSE
    if (url.pathname === "/livereload") {
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue("data: connected\n\n");
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        },
      );
    }

    // Static files from public/
    if (url.pathname === "/output.css") {
      return new Response(Bun.file("public/output.css"), {
        headers: { "Content-Type": "text/css" },
      });
    }

    // Auto routing
    const route = routes.get(url.pathname);
    if (route) {
      let element = React.createElement(route.page);
      for (let i = route.layouts.length - 1; i >= 0; i--) {
        element = React.createElement(route.layouts[i], null, element);
      }

      const html = renderToString(element);
      return new Response("<!DOCTYPE html>" + html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("[catalyst] http://localhost:2020\n");

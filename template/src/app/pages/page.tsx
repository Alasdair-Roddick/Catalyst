import { Route, Layers, RefreshCw, Terminal } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <p className="text-sm font-medium tracking-widest uppercase text-stone-400">
          Welcome to
        </p>
        <h1 className="mt-3 text-7xl font-bold tracking-tight text-stone-900">
          Catalyst
        </h1>
        <p className="mt-4 text-lg text-stone-500">
          A lightweight SSR framework powered by Bun.
          <br />
          File routing, nested layouts, live reload — zero config.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
          <div className="rounded-lg border border-stone-200 p-5 bg-white">
            <Route className="size-5 text-stone-400" />
            <h3 className="mt-3 font-semibold text-stone-800">File Routing</h3>
            <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
              Drop a page.tsx in any directory under pages/ and it becomes a route.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-5 bg-white">
            <Layers className="size-5 text-stone-400" />
            <h3 className="mt-3 font-semibold text-stone-800">Nested Layouts</h3>
            <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
              Add layout.tsx at any level to wrap all child routes automatically.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-5 bg-white">
            <RefreshCw className="size-5 text-stone-400" />
            <h3 className="mt-3 font-semibold text-stone-800">Live Reload</h3>
            <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
              Save a file and your browser refreshes instantly. No config needed.
            </p>
          </div>
        </div>

        <div className="mt-14 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-5 py-3">
          <Terminal className="size-4 text-stone-400" />
          <code className="text-sm text-stone-600">
            bunx create-catalyst my-app
          </code>
        </div>

        <p className="mt-8 text-xs text-stone-400">
          Edit{" "}
          <code className="text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
            src/app/pages/page.tsx
          </code>{" "}
          to get started
        </p>
      </div>
    </div>
  );
}

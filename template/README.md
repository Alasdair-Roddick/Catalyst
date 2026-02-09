# Catalyst

A lightweight SSR framework powered by Bun.

## Getting Started

```bash
bun run dev
```

Open [http://localhost:2020](http://localhost:2020).

## Project Structure

```
src/app/
├── server.tsx              # Bun HTTP server with auto-routing
├── styles/
│   └── input.css           # Tailwind CSS entry point
└── pages/
    ├── layout.tsx           # Root layout (wraps all pages)
    ├── page.tsx             # / route
    └── about/
        └── page.tsx         # /about route
```

## Routing

Routes are file-based. Any `page.tsx` inside `src/app/pages/` becomes a route automatically.

| File | Route |
|------|-------|
| `pages/page.tsx` | `/` |
| `pages/about/page.tsx` | `/about` |
| `pages/blog/page.tsx` | `/blog` |
| `pages/blog/post/page.tsx` | `/blog/post` |

To add a new page, create a directory with a `page.tsx` that default-exports a component:

```tsx
// src/app/pages/about/page.tsx
export default function Page() {
  return <h1>About</h1>;
}
```

Restart the dev server and the route is live.

## Layouts

Add a `layout.tsx` at any level to wrap all pages at or below that directory.

```tsx
// src/app/pages/dashboard/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      {children}
    </div>
  );
}
```

Layouts nest automatically — a page at `pages/dashboard/settings/page.tsx` is wrapped by both the root layout and the dashboard layout.

## Live Reload

The dev server includes live reload out of the box. Save any `.tsx`, `.ts`, or `.css` file and your browser refreshes automatically.

## Styling

Catalyst uses [Tailwind CSS](https://tailwindcss.com). Write utility classes directly in your components — the CSS is rebuilt on every file change.

## How It Works

- **Runtime** — Bun (no Node.js, no bundler)
- **Rendering** — Server-side with React `renderToString`
- **Watcher** — `fs.watch` with debounce, rebuilds CSS and restarts the server on changes
- **Routing** — `Bun.Glob` scans for `page.tsx` files at startup and builds a route map
- **Layouts** — Discovered by walking from root to each page's directory, collecting `layout.tsx` files

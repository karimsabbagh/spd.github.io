# SPD — Simple Project Dashboard

A lightweight, installable PWA task manager. Zero-build, zero-dependencies frontend using native ES modules and Web Components.

## Tech Stack

- **UI**: [Lit Element](https://lit.dev/) (Web Components) via a pre-bundled `lit.all.bundle.js`
- **Routing**: [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) with URL pattern matching
- **State**: Lit Signals (`State` / `Computed`) with `SignalWatcher` mixin
- **Storage**: IndexedDB (fully client-side, no server needed)
- **Styling**: Native CSS with custom properties, nesting, and `color-mix()`
- **PWA**: Service worker with asset precaching + offline support, installable via `manifest.json`

No build step, no bundler, no Node.js runtime. Served as plain static files.

## Project Structure

```
spd-static/
├── index.html                  # Entry point + import map
├── config.js                   # Base path configuration
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker (caching + offline)
├── css/
│   ├── variables.css           # Design tokens
│   ├── general.css             # Reset + base styles
│   ├── buttons.css             # Button variants
│   ├── form.css                # Floating label inputs
│   ├── app.css                 # Page-specific styles
│   └── root-app.css            # Root layout + nav
├── js/
│   ├── lit.all.bundle.js       # Pre-bundled Lit + Signals + Directives
│   └── router.js               # Navigation API router
├── views/                      # Page components (light DOM)
│   ├── root-app.js             # App shell, tabs, router setup
│   ├── home-page.js            # Dashboard with stats + quick add
│   ├── tasks-page.js           # Task list with pending/completed tabs
│   └── settings-page.js        # App info
├── components/                 # Reusable components (shadow DOM)
│   ├── top-nav.js              # Back button + page title
│   └── toast-notification.js   # Toast notification system
├── state/
│   ├── app-signals.js          # Reactive state (tasks, loading, computed)
│   └── db.js                   # IndexedDB wrapper
└── assets/icons/               # PWA icons
    ├── favicon.png
    ├── icon-192.png
    └── icon-512.png
```

## Running Locally

Open the project folder in VS Code and use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension. No install or build required.

## Configuration

All path configuration lives in `config.js`:

```js
export const BASE = "/pou/spd";
```

This `BASE` value is imported by the router and view components to prefix all navigation paths. It allows the app to be served from any subdirectory.

> **Note**: The service worker (`sw.js`) cannot use ES module imports, so it has its own `BASE` constant declared inline. Keep both in sync.

## Deploying to a Subdirectory

When serving from a path like `https://example.com/pou/spd`:

1. `config.js` — set `BASE` to `"/pou/spd"`
2. `sw.js` — set the inline `BASE` to `"/pou/spd"`
3. `manifest.json` — set `start_url` and `scope` to `"/pou/spd/"`, prefix icon `src` paths with `/pou/spd/`

## Moving to Its Own Domain

When the app moves to the root of its own domain (e.g. `https://spd.example.com`):

1. `config.js` — set `BASE` to `""`
2. `sw.js` — set the inline `BASE` to `""`
3. `manifest.json` — update:
   ```json
   {
     "start_url": "/",
     "scope": "/",
     "icons": [
       { "src": "/assets/icons/icon-192.png", ... },
       { "src": "/assets/icons/icon-512.png", ... }
     ]
   }
   ```

## Architecture Notes

- **Views** use light DOM (`createRenderRoot() { return this; }`) so global CSS applies directly
- **Components** use shadow DOM for style encapsulation
- **Data flow**: component → `appSignals` method → IndexedDB write → signal update → reactive re-render
- All data persists in the browser's IndexedDB — there is no backend

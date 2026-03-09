# SPD — Sterile Processing Department

A lightweight, installable PWA for medical device tracking and disposition. Scan products via RFID reader (or simulate scans), match them against a product catalog, and track dispositions. Zero-build, zero-dependencies frontend using native ES modules and Web Components.

## Tech Stack

- **UI**: [Lit Element](https://lit.dev/) (Web Components) via a pre-bundled `lit.all.bundle.js`
- **Routing**: [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) with URL pattern matching
- **State**: Lit Signals (`State` / `Computed`) with `SignalWatcher` mixin
- **Storage**: IndexedDB (fully client-side, no server needed)
- **Styling**: Native CSS with custom properties, nesting, and `color-mix()`
- **PWA**: Service worker with asset precaching + offline support, installable via `manifest.json`

No build step, no bundler, no Node.js runtime. Served as plain static files.

## How It Works

### Product Catalog
On app load, a product catalog (500 medical devices) is fetched from a webservice (currently mocked) and stored in the IndexedDB `products` table. Each product has an RFID tag, manufacturer, product name, model, lot/serial, HIS code, disposition, and category. If the network fetch fails, the app falls back to the previously cached catalog in IndexedDB.

### RFID Scanning
When an RFID tag is scanned (via a physical reader or the simulate button), the app looks up the tag in the `products` IndexedDB store using an indexed `rfid` field. If a match is found, the product details are saved to the `scans` store and displayed in the disposition table.

### Data Model

| IndexedDB Store | Purpose |
|---|---|
| `products` | Product catalog (500 items, refreshed from webservice on load) |
| `scans` | Scanned/dispositioned items (persists across sessions) |

## Project Structure

```
spd/
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
│   ├── root-app.js             # App shell, router setup, catalog + scan init
│   └── home-page.js            # Disposition table, RFID listener, simulate scan
├── components/
│   └── toast-notification.js   # Toast notification system
├── state/
│   ├── app-signals.js          # Reactive state (scans, catalog, RFID resolution)
│   ├── db.js                   # IndexedDB wrapper (products + scans stores)
│   └── mock-api.js             # Mock webservice returning 500 medical products
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
export const BASE = "/spd.github.io";
```

This `BASE` value is imported by the router and view components to prefix all navigation paths. It allows the app to be served from any subdirectory.

> **Note**: The service worker (`sw.js`) cannot use ES module imports, so it has its own `BASE` constant declared inline. Keep both in sync.

## Architecture Notes

- **Views** use light DOM (`createRenderRoot() { return this; }`) so global CSS applies directly
- **Components** use shadow DOM for style encapsulation
- **Data flow**: RFID scan → `resolveRfidTag()` → IndexedDB `products` lookup by RFID index → save to `scans` store → signal update → reactive re-render
- **Offline support**: Product catalog is cached in IndexedDB; if the network fetch fails on reload, the existing catalog is used. Scanned items always persist locally.

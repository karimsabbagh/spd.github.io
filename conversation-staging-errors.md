# Conversation: Staging Errors

**Karim:**

```
GET https://stagewmdrive.wavemark.net/pou/spd/spd/manifest.json 401 (Unauthorized)
spd/:1 Manifest fetch from https://stagewmdrive.wavemark.net/pou/spd/spd/manifest.json failed, code 401
app.css:1 GET https://stagewmdrive.wavemark.net/fonts/open-sans-var.woff2 404 (Not Found)
manifest.json:1 GET https://stagewmdrive.wavemark.net/pou/spd/spd/manifest.json 401 (Unauthorized)
spd/:1 Manifest fetch from https://stagewmdrive.wavemark.net/pou/spd/spd/manifest.json failed, code 401
spd/:1 <meta name="apple-mobile-web-app-capable" content="yes"> is deprecated. Please include <meta name="mobile-web-app-capable" content="yes">
```

**Copilot:**

Here's what's happening — 3 separate issues:

1. **Manifest 401 (Unauthorized)** — The manifest link at `index.html:16` uses a relative path `href="manifest.json"`. The app is served at `https://stagewmdrive.wavemark.net/pou/spd/spd/`, so the browser resolves it to `.../spd/manifest.json`. The 401 means the server requires authentication for that path. This is likely a server/reverse proxy config issue — the manifest file needs to be accessible without auth, or auth needs to be passed through.

2. **Font 404 (Not Found)** — In `css/app.css:4`, the font URL is an absolute path: `url("/fonts/open-sans-var.woff2")`. This resolves to `https://stagewmdrive.wavemark.net/fonts/open-sans-var.woff2` — the root of the domain, not relative to the app. The font file either doesn't exist there or needs a path relative to the app.

3. **Deprecated meta tag** — At `index.html:12`, `apple-mobile-web-app-capable` is deprecated.

**Karim:**

Yes the font exists.

**Copilot:**

Good, then the relative path fix should resolve the 404. The manifest 401 remains a server-side auth config issue on your end.

**Karim:**

So why does the JSON require authentication but not the JS or CSS files?

**Copilot:**

That's a good question — it likely comes down to how your reverse proxy or server is configured. Common reasons:

1. **File extension filtering** — The server may whitelist known static asset extensions (`.js`, `.css`, `.html`, `.png`, `.woff2`) but not `.json`, so `manifest.json` gets routed through the auth layer instead of being served directly.
2. **MIME type routing** — Some proxies route requests based on content type. JSON requests might be treated as API calls and require auth, while typical static assets pass through.
3. **Path-based rules** — If auth rules are applied per-path pattern, `manifest.json` might not match the patterns that exempt static files.

Check your reverse proxy config (likely Nginx or Apache) for the rules that bypass authentication — you probably just need to add `*.json` or specifically `manifest.json` to the allowed static file patterns.

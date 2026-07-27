# Kadamba

A static web app for browsing the building blocks of Vedic astrology:
**9 planets (grahas)**, **12 signs (rāśis)**, **12 houses (bhāvas)** — their
characteristics, significations and classifications.

## Run it

No build step, no dependencies:

- **Easiest:** double-click `index.html` — it works straight from disk, or
- **Serve it:** `python3 -m http.server 8000` then open <http://localhost:8000>

## Features

- Browse planets / signs / houses as cards, click through to detail pages
- Every detail page cross-links: sign → ruling planet, planet → ruled signs
  and karaka houses, house → karaka planets and classifications
- Search across everything (press `/` to jump to the search box, `Esc` to clear)
- Concepts section: classifications, Chara Kārakas, purusharthas,
  interpretation guides
- Responsive — works on phone and desktop
- **PWA**: installable on Android/iOS with its own icon, fully offline

## Installing as an app (PWA)

Service workers require HTTPS (or localhost), so host the folder first —
e.g. GitHub Pages, Netlify Drop, or any static host. Then:

- **Android (Chrome):** open the site → tap **Install app** in the header
  (or browser menu → *Install app / Add to Home screen*)
- **iPhone (Safari):** open the site → Share → **Add to Home Screen**

Once installed it launches full-screen and works with no connection.

## Project layout

| File | Purpose |
|---|---|
| `index.html`, `styles.css`, `app.js` | The app (vanilla JS, hash routing) |
| `manifest.webmanifest`, `sw.js` | PWA manifest + service worker (offline cache) |
| `icons/` | Generated app icons |
| `generate-icons.py` | Regenerates icons: `python3 generate-icons.py` |
| `data/*.json` | **Content — edit these to change what the app shows** |
| `build-data.py` | Regenerates `data.js` from `data/*.json` |
| `data.js` | Generated content bundle (don't edit by hand) |
| `test-app.js` | Headless smoke test: `node test-app.js` |
| `*.docx` | Original source documents |
| `REQUIREMENTS.md` | Requirements doc |

## Editing content

1. Edit the relevant file in `data/` (e.g. `data/planets.json`)
2. Run `python3 build-data.py`
3. Refresh the browser — that's it

If the app is installed as a PWA, also bump `CACHE_VERSION` in `sw.js`
so installed copies pick up the new content.

Run `node test-app.js` afterwards to check nothing broke.

# CLAUDE.md

Kadamba — a static Jyotish (Vedic astrology) reference PWA. See `README.md`
for the run/edit workflow and `REQUIREMENTS.md` for requirements and status.

## Source documents

The **default document folder** for this project is
`/Users/nagnamburi/Documents/KadambaWorkspace/Data` — the `Data` folder next
to this repo. The user's master Word/PDF source documents live there; when
adding content to the app, look there first.

Don't confuse it with this repo's own `data/` folder (lowercase), which holds
the app's JSON content (`planets`, `signs`, `houses`, `concepts`) that
`build-data.py` bundles into `data.js`.

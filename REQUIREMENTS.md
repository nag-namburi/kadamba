# Requirements — Kadamba

> Status: **v1 built & deployed** — https://skipit.github.io/kadamba/

## 1. Purpose

A web app that displays the characteristics of Vedic astrology entities —
**planets (grahas)**, **signs (rashis)**, and **houses (bhavas)** — as a clean,
browsable reference. Think "interactive encyclopedia of Kadamba building blocks."

## 2. Target Users

- ❓ Assumption: astrology students, enthusiasts, and practitioners looking up
  significations quickly. (Personal use or public — TBD.)

## 3. Content Model

> ✅ Confirmed. Source: user's Word docs (`Graha Naisargika Kārakatvas.docx`,
> `Bhāva - Karakatwas.docx`, `Rasi -Characterstics.docx`), converted into
> `data/planets.json`, `data/signs.json`, `data/houses.json`, `data/concepts.json`.

### 3.1 Planet (Graha) — 9 entities ✅ converted
Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu.

Each planet has: id, name, Sanskrit name, one-word essence, primary
significations, represents (full list), psychological qualities, professions.

### 3.2 Sign (Rashi) — 12 entities ✅ converted
Mesha (Aries) through Meena (Pisces).

Each sign has: id, name, Sanskrit name, number (1–12), ruling planet, element,
modality, purushartha, gender, nature, characteristics, strengths, weaknesses.

### 3.3 House (Bhava) — 12 entities ✅ converted

Each house has: id, number, name, Sanskrit name, primary significations,
represents, questions it answers, natural karakas, classifications
(Kendra/Trikona/Upachaya/Dusthana/Panaphara/Apoklima), purushartha.

### 3.4 Concepts — 8 supplementary guides ✅ converted
Planet essences table, Chara Karakas (Jaimini), classical sign classifications,
how to interpret a Rāśi, house classification groups, houses & purusharthas,
houses in Jaimini, and the "who/how/where" big-picture analogy.

## 4. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Home screen listing the three categories | Must |
| FR-2 | Browse all entities within a category (grid/list) | Must |
| FR-3 | Detail view per entity showing all its attributes | Must |
| FR-4 | Search across entities by name (Sanskrit or English) | Must |
| FR-5 | Cross-links between entities (e.g., Mars ↔ Mesha, planet ↔ exaltation sign) | Should |
| FR-6 | Responsive layout (usable on phone and desktop) | Must |
| FR-7 | Filter bhavas by category, signs by element, planets by nature | Nice |
| FR-8 | "Concepts" section with the 8 supplementary guides | Should |

## 5. Non-Functional Requirements

- Fast: static content, no backend needed for v1
- ~~Works offline after first load~~ ✅ PWA done (service worker + manifest + icons)
- Content stored as structured data (JSON), separate from code — easy to edit/extend
- ~~Language: English UI with Sanskrit terms included~~ ✅ confirmed by content

## 6. Out of Scope (v1)

- Birth chart (kundali) calculation or chart drawing
- User accounts, saving data, predictions/horoscopes
- Western astrology correspondences (❓ confirm Vedic-only)

## 7. Nice-to-Haves (future versions)

- Quiz / flashcard mode for students
- Comparison view (two entities side by side)
- Dark mode
- Hindi or other language translations
- Later: full kundali calculation from birth details

## 8. Tech Approach ✅ built

- Static single-page app, no server or build step required (vanilla HTML/CSS/JS)
- Content lives in `data/*.json`, bundled to `data.js` by `build-data.py`
  (so the app works from `file://` too)
- Hash-based routing, live search, cross-linked entities, responsive layout

## 9. Open Questions — resolved / deferred

1. ~~Vedic-only?~~ → Vedic (Parāśara + Jaimini), per source documents
2. Just for you, or will you publish it for others? — *open*
3. ~~Content depth?~~ → compact reference style, per source documents
4. ~~Framework?~~ → vanilla JS (no installs needed)
5. ~~App name preference?~~ → **Kadamba** (app + repo renamed 2026-07-26)

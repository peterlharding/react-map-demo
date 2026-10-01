# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A small demo of the `@react-google-maps/api` package, built with Vite 8, React 19, TypeScript 6 and React Router 8 (data mode).
Layout uses react-bootstrap 2 with Bootstrap 5 CSS.

## Commands

```sh
make setup           # create .env from setup/env.template (never overwrites)
npm install          # or: make install
npm run dev          # Vite dev server on HOST:PORT from .env
npm run build        # tsc -b, then production build to dist/
npm run lint         # ESLint flat config (typescript-eslint, react-hooks, react-refresh)
npm run typecheck    # tsc -b
npm test             # Vitest, single run (npm run test:watch for watch mode)
npx vitest run src/app/routes.test.tsx -t "redirects"   # single file / single test
make check           # lint + typecheck + test
```

TypeScript is pinned to 6.0 because typescript-eslint does not support TypeScript 7 yet.

## Configuration and secrets

All sensitive local files are untracked and initialized from templates in `setup/`; add a template there for any new one.
The root `.env` (from `setup/env.template`) holds:
- `HOST` / `PORT` - read in `vite.config.ts` via `loadEnv` for the dev and preview servers.
- `MAPS_API_KEY` - exposed to the client because `envPrefix` includes `MAPS_`; read only in `src/config.ts`.
- `MAPS_MAP_ID` - optional, defaults to `DEMO_MAP_ID`; a map ID is required for Advanced Markers.

## Architecture

- `src/app/demos.ts` is the single list of demos (path, title, summary, "Try" hint) in teaching order.
  `HomePage`, `NavBar` and each page's `DemoPage` header all read from it, so adding a demo means a `demos.ts` entry, a page in `src/pages/` wrapped in `DemoPage`, and a route.
- `src/app/routes.tsx` holds the route table; `App.tsx` wraps it in `createBrowserRouter`, and tests use `createMemoryRouter` on the same `routes`.
  `Layout` (navbar + `<main>`) is the root element; only the demo routes sit under the `MapsLayout` route, so `/` and `NotFoundPage` work without an API key.
  The demo pages and `MapsLayout` (which wraps `MapsLoader`) are lazy routes, so the Maps library stays out of the home page bundle; keep new demo pages lazy too.
  Pre-0.3.0 paths (`/mapper`, `/mapper2`, `/map-edit`, `/map-view`) redirect to the renamed demos.
- `MapsLoader` calls `useJsApiLoader` once with the `marker` library, and shows an alert if the key is missing or loading fails.
  Pages must not add their own `LoadScript`.
- `MapCanvas` is the shared `<GoogleMap>` (zoom, sizing via the `.map-canvas` class, `mapId`).
- `AdvancedMarker` is a local wrapper around `google.maps.marker.AdvancedMarkerElement`, attached via `useGoogleMap()`.
  It exists because the library only wraps the deprecated `google.maps.Marker`; use it instead of `Marker`/`MarkerF`.
  Optional `label` (white text in a `PinElement`), `title` and `onClick` (which sets `gmpClickable`; `gmp-click` does not fire without it).
  On drag end it records the time in `markerDrag.ts`, and `MapCanvas` drops the map click Google sends about 300 ms later for the same gesture.
  So `MapCanvas` `onClick` never fires for a marker drag; do not add other workarounds for it.
- `src/inputModality.ts` sets `data-input-modality` (`pointer` or `keyboard`) on `<html>`.
  Google moves focus after mouse use (to a dragged marker, into an opened info window) in a way that matches `:focus-visible`, so `index.css` hides focus styles while the modality is `pointer`.
- `MapCanvas` takes a stable `center`; `GoogleMap` only re-centres when the object changes, so use `map.panTo` (via `onLoad`) to move to a selected item.
- `geo.ts` holds the shared `LatLng` type, the `melbourneCoords` default and coordinate formatting.
- Page titles are set with React 19's `<title>` element inside each page.

## Changelog and releases

`CHANGELOG.md` (Keep a Changelog) is maintained by hand: add each user-visible change under `## [Unreleased]` in the same change.
At release time the Unreleased items move to a dated version section and `release_notes/v<version>.md` is written (structure in `release_notes/README.md`).
`RELEASING.md` has the release steps and the commit message prefixes (`feat:`, `fix:`, `docs:`, `build:` and so on).

## Testing

jsdom cannot load the Maps JavaScript API, so tests `vi.mock('@react-google-maps/api')` and `vi.mock('../config')`.
See `src/app/routes.test.tsx` for the pattern.

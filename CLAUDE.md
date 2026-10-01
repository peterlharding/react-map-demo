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

- `src/app/routes.tsx` holds the route table; `App.tsx` wraps it in `createBrowserRouter`, and tests use `createMemoryRouter` on the same `routes`.
  `/` redirects to `/map-view`, and `*` renders `NotFound`.
- `Layout` (the root route element) wraps every page in `MapsLoader` and renders the `Footer` nav.
- `MapsLoader` calls `useJsApiLoader` once for the whole app with the `marker` library, and shows an alert if the key is missing or loading fails.
  Pages must not add their own `LoadScript`.
- `MapCanvas` is the shared `<GoogleMap>` (zoom, sizing via the `.map-canvas` class, `mapId`).
- `AdvancedMarker` is a local wrapper around `google.maps.marker.AdvancedMarkerElement`, attached via `useGoogleMap()`.
  It exists because the library only wraps the deprecated `google.maps.Marker`; use it instead of `Marker`/`MarkerF`.
- `geo.ts` holds the shared `LatLng` type, the `melbourneCoords` default and coordinate formatting.
- Pages: `MapView` (browser geolocation with Melbourne fallback, draggable marker), `Mapper` (bare map), `Mapper2` (untracked draggable marker), `MapEdit` (draggable marker from optional `position` prop).

## Changelog and releases

`CHANGELOG.md` (Keep a Changelog) is maintained by hand: add each user-visible change under `## [Unreleased]` in the same change.
At release time the Unreleased items move to a dated version section and `release_notes/v<version>.md` is written (structure in `release_notes/README.md`).
`RELEASING.md` has the release steps and the commit message prefixes (`feat:`, `fix:`, `docs:`, `build:` and so on).

## Testing

jsdom cannot load the Maps JavaScript API, so tests `vi.mock('@react-google-maps/api')` and `vi.mock('../config')`.
See `src/app/routes.test.tsx` for the pattern.

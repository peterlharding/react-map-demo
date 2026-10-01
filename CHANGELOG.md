# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-10-01

See [release_notes/v0.5.0.md](release_notes/v0.5.0.md) for details.

### Added

- Shapes and Measuring demo (`/shapes`): draw an editable route, area and circle, and see their length, area, perimeter and radius update as they are reshaped.
- An error page for pages that fail to load or render, which keeps the navigation bar, offers to reload or go back to the demo list, and hides API keys in its error details.
  Previously React Router's default developer error screen was shown.

## [0.4.0] - 2026-10-01

See [release_notes/v0.4.0.md](release_notes/v0.4.0.md) for details.

### Added

- Add Places demo (`/add-places`): click the map to add numbered places, listed beside the map.
  Clicking a marker or list entry opens an info window with the place's details and a Remove button, markers can be dragged, and places can be removed one at a time or all at once.

### Changed

- Focus outlines inside maps, including on buttons in info windows, now show only after keyboard use, generalising the marker fix from 0.2.1.

## [0.3.0] - 2026-10-01

See [release_notes/v0.3.0.md](release_notes/v0.3.0.md) for details.

### Added

- Home page listing the demos in order, each with a short description.
- Each demo page opens with a description of what it shows and a "Try" hint saying what to do.
- Each page sets its own browser tab title.

### Changed

- Demos renamed to describe what they show: Mapper is now Basic Map (`/basic-map`), Mapper2 is Marker (`/marker`), Map Edit is Pick a Location (`/pick-location`) and Map View is My Location (`/my-location`).
  The old paths redirect to the new ones.
- Navigation moved from the footer to a top bar, ordered from the simplest demo to the most involved, which collapses into a menu on narrow screens.
- `/` shows the home page instead of redirecting to Map View.
- The home page and the "Page Not Found" page no longer need a Google Maps API key; only the demo pages load the Maps API.
- The demo pages and the Maps library load when a demo is first opened, so the home page downloads about a third less JavaScript.

## [0.2.1] - 2026-10-01

See [release_notes/v0.2.1.md](release_notes/v0.2.1.md) for details.

### Fixed

- Dragging a marker with the mouse left a square blue focus outline around it.
  The outline now only shows when the marker is focused or moved from the keyboard.

## [0.2.0] - 2026-10-01

See [release_notes/v0.2.0.md](release_notes/v0.2.0.md) for details.

### Added

- `make setup` creates `.env` from `setup/env.template`, which documents every setting.
- `MAPS_MAP_ID` setting for Advanced Markers, defaulting to Google's `DEMO_MAP_ID`.
- Loading spinner while the Maps API loads, and messages for a missing API key or a failed load.
- Location status line on Map View, showing whether the map is on your location or why it fell back to Melbourne.
- "Page Not Found" page for unknown paths.
- Active page highlighting in the navigation.
- Makefile targets `setup`, `build`, `preview`, `lint`, `typecheck`, `test` and `check`.
- Route and API key tests with Vitest and Testing Library.
- ESLint with typescript-eslint, react-hooks and react-refresh rules.
- `CLAUDE.md` with guidance for Claude Code.

### Changed

- Build tooling moved from Create React App to Vite 8.
- Upgraded to React 19, React Router 8 (data router), react-bootstrap 2, Bootstrap 5.3 and TypeScript 6.0.
- The Google Maps API key is read from `MAPS_API_KEY` in `.env` instead of a hand-written `src/localization.ts`.
- The dev server address comes from `HOST` and `PORT` in `.env`.
- The Maps JavaScript API is loaded once for the whole app instead of once per page.
- Markers use `google.maps.marker.AdvancedMarkerElement` instead of the deprecated `google.maps.Marker`.
- `/` now redirects to `/map-view`.
- Maps fill the page width instead of 80% of an 80%-wide container.
- Coordinates are shown to 6 decimal places.
- Node 22.22 or later is required.
- README rewritten with setup steps and an explanation of each demo.

### Removed

- `src/localization.ts` and the unused `src/.env`.
- Create React App boilerplate: PWA manifest, logos, `App.css` and the React logo.
- Console logging on every render.
- The Bootstrap 4 class `text-left`, which has no effect under Bootstrap 5.

### Fixed

- Map View asked for the browser's location after every render, causing a loop of location requests and re-renders.
- `make dev` called a `dev` script that did not exist.
- The root `.env` was not gitignored, so the API key could be committed.
- The README named the wrong key file (`src/localizations.ts`).

## [0.1.0] - 2021-07-18

See [release_notes/v0.1.0.md](release_notes/v0.1.0.md) for details.

### Added

- Create React App demo of `@react-google-maps/api` with React 17, React Router 5 and react-bootstrap.
- Map View page centred on the browser's location, with a draggable marker and its coordinates.
- Mapper page with a bare map centred on Melbourne.
- Mapper2 page with a draggable marker.
- Map Edit page with a draggable marker and its coordinates.
- Footer navigation between the pages.

[Unreleased]: https://github.com/peterlharding/react-map-demo/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/peterlharding/react-map-demo/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/peterlharding/react-map-demo/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/peterlharding/react-map-demo/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/peterlharding/react-map-demo/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/peterlharding/react-map-demo/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/peterlharding/react-map-demo/releases/tag/v0.1.0

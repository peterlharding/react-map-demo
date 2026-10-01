React Map Demo
==============

Demo of the @react-google-maps/api module, built with Vite, React 19, TypeScript and React Router 8.
It shows four ways of putting a Google Map on a page, from a bare map up to a map with an editable marker.

# Setup

Requires Node 22.22 or later.

Sensitive files are not committed.
They are initialized from templates in `setup/`:

 $ make setup      # copies setup/env.template to .env (never overwrites an existing .env)

Then edit `.env`:

 HOST=127.0.0.1               # dev server address
 PORT=8080                    # dev server port
 MAPS_API_KEY=<your key>      # Google Maps JavaScript API key
 MAPS_MAP_ID=                 # optional, see below

`MAPS_API_KEY` is required.
Without it the app shows a warning explaining how to set it instead of a map.
See https://developers.google.com/maps/gmp-get-started for how to create a key.

`MAPS_MAP_ID` is optional and defaults to Google's `DEMO_MAP_ID`.
A map ID is needed for the Advanced Markers used in the demos, and the demo ID is fine for development.
Set your own map ID from the Google Cloud console to apply custom map styling.

# Running

 $ make install    # npm install
 $ make dev        # start the dev server on HOST:PORT from .env
 $ make check      # lint, typecheck and tests
 $ make build      # production build to dist/
 $ make preview    # serve the production build on HOST:PORT

Open `http://HOST:PORT/` in a browser.
Use the links under the map to switch between the demos.

# The Demos

All demos start around Melbourne, zoomed to show the city and inner suburbs.
The Google Maps script is loaded once for the whole app, so switching between demos does not reload it.

## Map View (`/map-view`)

Centres the map on your current location.

* On first visit the browser asks for permission to use your location.
* The status line under the heading shows the result:
  "Locating you...", "Showing your location", or why the location is unavailable.
* If location access is denied or unsupported, the map stays on Melbourne.
* A draggable marker shows the current position, and its latitude and longitude are shown above the map.
* Dragging the marker updates the coordinates and re-centres the map on the new position.

This is also the home page: `/` redirects here.

## Mapper (`/mapper`)

The simplest possible use of the library: a map centred on Melbourne with no marker and no state.
It is a good starting point for seeing the bare `GoogleMap` component and its default controls
(Map/Satellite toggle, full screen, camera controls and Street View).

## Mapper2 (`/mapper2`)

Adds a marker to the bare map.
The marker is draggable, but the app does not track where it is dropped.
It shows the difference between displaying a marker and wiring its events into React state, which the next demo does.

## Map Edit (`/map-edit`)

An editor for a single position.

* Starts with a marker on Melbourne, or on a `position` passed in as a prop when the component is reused elsewhere.
* Dragging the marker updates the latitude and longitude shown above the map and re-centres the map.
* Unlike Map View it never asks for your location, so it suits picking a position rather than finding yourself.

## Unknown pages

Any other path shows a "Page Not Found" message with a link back to Map View.

# How It Works

* `src/app/routes.tsx` defines the pages, wrapped in a shared layout with the navigation links.
* `src/components/MapsLoader.tsx` loads the Google Maps JavaScript API once and shows a spinner while loading,
  or an error message if the key is missing or the API fails to load.
* `src/components/MapCanvas.tsx` is the shared map: size, zoom and map ID.
* `src/components/AdvancedMarker.tsx` renders Google's current `AdvancedMarkerElement`.
  The library only wraps the older `google.maps.Marker`, which Google has deprecated, so this small component attaches the new marker to the map itself.
* `src/config.ts` reads `MAPS_API_KEY` and `MAPS_MAP_ID` from `.env`.

# Testing

 $ npm test                                                 # all tests
 $ npx vitest run src/app/routes.test.tsx -t "redirects"   # one test

The Google Maps API cannot load in the test environment, so tests replace the map with a placeholder.
They cover routing, navigation and the missing API key message.
Check the maps themselves in a browser with `make dev`.

# Also see

* https://developers.google.com/maps/gmp-get-started
* https://cloud.google.com/maps-platform/
* https://developers.google.com/maps/documentation/javascript/advanced-markers/overview
* https://github.com/JustFly1984/react-google-maps-api

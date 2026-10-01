React Map Demo
==============

Demo of the @react-google-maps/api module, built with Vite, React 19, TypeScript and React Router 8.
It shows seven ways of working with a Google Map, from a bare map up to drawing shapes and sharing a view as a link.

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
The home page lists the demos, and the bar at the top links to each one.

# The Demos

The demos are ordered so that each builds on the one before it.
All of them start around Melbourne, zoomed to show the city and inner suburbs.
The Google Maps script is loaded once, when the first demo is opened, so switching between demos does not reload it.
Each demo page opens with a one-line description of what it shows and a "Try" hint saying what to do.

## 1. Basic Map (`/basic-map`)

The simplest possible use of the library: a map centred on Melbourne with no marker and no state.
It is a good starting point for seeing the bare `GoogleMap` component and its default controls
(Map/Satellite toggle, full screen, camera controls and Street View).

## 2. Marker (`/marker`)

Adds a marker to the basic map.
The marker is draggable, but nothing listens to where it is dropped, so the app never learns its new position.
It shows the difference between displaying a marker and wiring its events into React state, which the next demo does.

## 3. Pick a Location (`/pick-location`)

An editor for a single position.

* Starts with a marker on Melbourne, or on a `position` passed in as a prop when the component is reused elsewhere.
* Dragging the marker updates the latitude and longitude shown above the map and re-centres the map.
* It never asks for your location, so it suits choosing a position rather than finding yourself.

## 4. My Location (`/my-location`)

Centres the map on your current location.

* On first visit the browser asks for permission to use your location.
* The status line under the description shows the result:
  "Locating you...", "Showing your location", or why the location is unavailable.
* If location access is denied or unsupported, the map stays on Melbourne.
* As in Pick a Location, dragging the marker updates the coordinates and re-centres the map.

## 5. Add Places (`/add-places`)

Keeps a whole list of markers in React state, rather than a single position.

* Clicking the map adds a numbered place there, and it appears in the list beside the map (below it on narrow screens).
  Clicking one of Google's own points of interest adds a place too, instead of opening Google's information popup.
* Clicking a marker, or a place in the list, opens an info window with its coordinates and a Remove button.
  Choosing from the list also pans the map to that place.
* Dragging a marker moves its place, and the list and any open info window follow it.
* Places can be removed one at a time from the list or the info window, or all at once with Clear all.

Places are not saved, so reloading the page starts again.

## 6. Shapes and Measuring (`/shapes`)

Draws editable shapes and measures them with the Maps `geometry` library.

* Choose a tool, then click the map:
  * **Route** adds points to a line, and shows its length.
  * **Area** adds corners to a polygon, and shows its area and perimeter once it has three corners.
  * **Circle** places a circle with a 1 km radius, or moves it, and shows its radius and area.
* All three shapes can be on the map at once, each in its own colour.
* Drag a shape's white handles to reshape it.
  On a route or area, dragging one of the faint handles between two points adds a new point there.
* **Undo last point** removes the most recent point of the selected route or area, and each shape can be cleared from the Measurements panel.

Distances are shown in metres below 1 km and kilometres above.
Areas are shown in square metres, hectares or square kilometres, depending on their size.
Shapes are not saved, so reloading the page starts again.

## 7. Map State in the URL (`/map-state`)

Keeps the whole map view in the page address, for example `/map-state?lat=-37.8634&lng=144.9714&zoom=16&type=satellite`.
The address is the only state: the map shows what it says, and moving the map writes back to it.

* **Go to** buttons jump to a few places around Melbourne, each with its own zoom and map type.
  Each jump adds a history entry, so the browser's Back and Forward buttons step between views.
* Panning and zooming update the address as soon as the map stops moving, replacing the current history entry rather than adding new ones.
* The **Map type** picker, and the map's own Map/Satellite control, change the `type` in the address and add a history entry.
* **Link to this view** shows the full address, with a button to copy it.
  Opening that link, or a bookmark of it, shows exactly the same view.
* Missing or invalid values in the address fall back to the default view and are corrected in the address.

## Old links and unknown pages

The paths used before 0.3.0 (`/mapper`, `/mapper2`, `/map-edit` and `/map-view`) redirect to the matching demo.
Any other path shows a "Page Not Found" message with a link to the home page.
If a page fails to load or hits an unexpected error, an error page replaces it, keeping the navigation bar.
It offers to reload the page or go back to the demo list, and shows the error details with any API key hidden.

# How It Works

* `src/app/demos.ts` lists the demos in order, with each one's path, title, description and "Try" hint.
  The home page, the navigation bar and the demo page headings are all built from it.
* `src/app/routes.tsx` defines the pages and the redirects from old paths.
* `src/pages/` holds one component per page, and `src/components/DemoPage.tsx` renders the shared heading and description.
* `src/components/MapsLoader.tsx` loads the Google Maps JavaScript API once and shows a spinner while loading,
  or an error message if the key is missing or the API fails to load.
  It wraps only the demo pages, so the home page works without a key.
  The demo pages and the Maps library are loaded only when a demo is first opened, which keeps the home page small.
* `src/components/MapCanvas.tsx` is the shared map: size, zoom and map ID.
* `src/components/AdvancedMarker.tsx` renders Google's current `AdvancedMarkerElement`.
  The library only wraps the older `google.maps.Marker`, which Google has deprecated, so this small component attaches the new marker to the map itself.
* `src/components/markerDrag.ts` drops the extra map click that Google sends when a dragged marker is released,
  so dragging a marker never adds a place or opens a popup.
* `src/inputModality.ts` records whether the mouse or the keyboard was used last.
  Google Maps moves focus after mouse use too (to a dragged marker, or into an opened info window), so focus outlines are shown only to keyboard users.
* `src/pages/RouteErrorPage.tsx` is the error page, set as the `errorElement` of the routes in `src/app/routes.tsx`.
* `src/config.ts` reads `MAPS_API_KEY` and `MAPS_MAP_ID` from `.env`.

To add a demo, add an entry to `src/app/demos.ts`, a page in `src/pages/` wrapped in `DemoPage`, and a lazy route in `src/app/routes.tsx`.

# Testing

 $ npm test                                                 # all tests
 $ npx vitest run src/app/routes.test.tsx -t "redirects"   # one test

The Google Maps API cannot load in the test environment, so tests replace the map with a placeholder.
They cover routing, the home page, navigation, the old path redirects, the missing API key message,
adding, showing and removing places in Add Places, drawing and measuring in Shapes and Measuring,
reading and writing the view in Map State in the URL, and the error page.
Check the maps themselves in a browser with `make dev`.

# Also see

* https://developers.google.com/maps/gmp-get-started
* https://cloud.google.com/maps-platform/
* https://developers.google.com/maps/documentation/javascript/advanced-markers/overview
* https://github.com/JustFly1984/react-google-maps-api

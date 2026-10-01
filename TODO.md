# TODO

Planned enhancements, in the order they were proposed.
Released so far: 0.6.0, with seven demos (see `CHANGELOG.md`).

## Before adding another demo

- **Navigation bar width.**
  The seven demo titles already need about 1000 px, so the bar collapses into a menu below 1200 px (`expand='xl'` in `src/components/NavBar.tsx`).
  An eighth demo will not fit on one line even at 1200 px.
  Options: group demos under a "More" dropdown, shorten the nav labels (for example a `navTitle` field in `src/app/demos.ts`), or rely on the home page and keep only a few links in the bar.
  Check the bar at 1200 px and above after any change.

## New demos that need only the current API key

### Layers

- Toggles for Google's traffic, transit and bicycling layers (`TrafficLayerF`, `TransitLayerF`, `BicyclingLayerF` from `@react-google-maps/api`).
- A small GeoJSON file kept in the repo, for example a few Melbourne areas, loaded into the map's Data layer (`DataF`).
  Style each feature by one of its properties, and show its details when clicked.
- Make sure the GeoJSON is our own data or openly licensed.

### Lots of markers

- A few thousand generated points around Melbourne, grouped into clusters as the map zooms out.
- Use `@googlemaps/markerclusterer`, which works with the `AdvancedMarkerElement` markers this project already uses.
  Do not use the library's `MarkerClusterer`, which wraps the deprecated `google.maps.Marker`.
- Shows how to stay fast with many markers: create them imperatively rather than as one React component each.

### Street View

- A map beside a Street View panorama, with the panorama following a draggable marker.
- Uses `StreetViewPanorama` and `StreetViewService` (to find the nearest panorama to the marker).
- Handle places with no Street View coverage.

## New demos that need extra APIs on the key

These need further APIs enabled in Google Cloud, and may add billing, so confirm before starting.
Document the required API in `setup/env.template` and the README.

### Place search

- Search for places with the new `PlaceAutocompleteElement` (Places API (New)), then show the chosen place on the map.
- Do not use the legacy `Autocomplete` or `StandaloneSearchBox`, which Google is retiring.

### Directions

- Route between two draggable markers using the Routes API, showing distance, time and the route line.
- Do not use the legacy `DirectionsService`.

## Avoid

The library still wraps these, but they are deprecated, so a demo should not teach them:
`DrawingManager`, `HeatmapLayer` (visualization library), the legacy `Autocomplete`, and `google.maps.Marker` (`Marker`, `MarkerF`).
Check Google's current deprecation dates before relying on this list.

// The demos in the order they build on each other. This one list drives the
// home page, the navigation bar and each demo page's description.

export interface Demo {
  path: string;
  title: string;
  summary: string;
  tryIt: string;
}

export const demos = {
  basicMap: {
    path: '/basic-map',
    title: 'Basic Map',
    summary: 'The smallest working example: a map centred on Melbourne, with no marker and no React state.',
    tryIt: 'Pan and zoom, and switch between Map and Satellite with the built-in controls.'
  },
  marker: {
    path: '/marker',
    title: 'Marker',
    summary: 'Adds a draggable marker to the basic map. Nothing listens to where it is dropped, so the page never learns its new position.',
    tryIt: 'Drag the marker, then compare with Pick a Location, which tracks every move.'
  },
  pickLocation: {
    path: '/pick-location',
    title: 'Pick a Location',
    summary: 'Connects the marker to React state: each drag updates the position, which re-renders the coordinates and re-centres the map.',
    tryIt: 'Drag the marker and watch the latitude and longitude update.'
  },
  myLocation: {
    path: '/my-location',
    title: 'My Location',
    summary: 'Asks the browser for your location and centres the map there, falling back to Melbourne if the location is unavailable.',
    tryIt: 'Allow location access when the browser asks, then drag the marker to explore nearby.'
  },
  addPlaces: {
    path: '/add-places',
    title: 'Add Places',
    summary: 'Keeps a list of markers in React state: clicking the map adds a place, and each marker opens an info window with its details.',
    tryIt: 'Click the map a few times, then click a marker or a list entry to see its details. Drag markers to move them.'
  }
} satisfies Record<string, Demo>;

export const demoList: Demo[] = [
  demos.basicMap, demos.marker, demos.pickLocation, demos.myLocation, demos.addPlaces
];

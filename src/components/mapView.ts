import {melbourneCoords, type LatLng} from './geo';

// A map view as kept in the page address: ?lat=…&lng=…&zoom=…&type=…

export const mapTypes = ['roadmap', 'satellite', 'hybrid', 'terrain'] as const;
export type MapType = typeof mapTypes[number];

export interface MapView {
  center: LatLng;
  zoom: number;
  mapType: MapType;
}

export const defaultView: MapView = {center: melbourneCoords, zoom: 13, mapType: 'roadmap'};

// 5 decimal places is about 1 m, and vector maps can zoom in fractions. Rounding
// also lets the map settle: moving it to a rounded position rounds back the same.
const round = (value: number, places: number) => Number(value.toFixed(places));

const parseNumber = (text: string | null, min: number, max: number) => {
  if (text === null || text.trim() === '') {
    return undefined;
  }
  const value = Number(text);
  return Number.isFinite(value) && value >= min && value <= max ? value : undefined;
};

const isMapType = (text: string | null): text is MapType =>
  (mapTypes as readonly (string | null)[]).includes(text);

// Missing or invalid values fall back to the default view, one field at a time
export const parseView = (params: URLSearchParams): MapView => {
  const lat = parseNumber(params.get('lat'), -85, 85);
  const lng = parseNumber(params.get('lng'), -180, 180);
  const zoom = parseNumber(params.get('zoom'), 0, 22);
  const type = params.get('type');

  return {
    center: lat !== undefined && lng !== undefined ? {lat: round(lat, 5), lng: round(lng, 5)} : defaultView.center,
    zoom: zoom !== undefined ? round(zoom, 2) : defaultView.zoom,
    mapType: isMapType(type) ? type : defaultView.mapType
  };
};

export const viewToParams = ({center, zoom, mapType}: MapView) =>
  new URLSearchParams({
    lat: String(round(center.lat, 5)),
    lng: String(round(center.lng, 5)),
    zoom: String(round(zoom, 2)),
    type: mapType
  });

export const sameView = (a: MapView, b: MapView) =>
  viewToParams(a).toString() === viewToParams(b).toString();

// Reads the view a map is showing, or undefined while it has no centre yet
export const viewOfMap = (map: google.maps.Map): MapView | undefined => {
  const center = map.getCenter()?.toJSON();
  const zoom = map.getZoom();
  const type = map.getMapTypeId() ?? null;
  if (!center || zoom === undefined) {
    return undefined;
  }
  return {center, zoom, mapType: isMapType(type) ? type : defaultView.mapType};
};

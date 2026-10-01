export type LatLng = google.maps.LatLngLiteral;

export const melbourneCoords: LatLng = {
  lat: -37.813862735640086,
  lng: 144.96287723964844
};

export const formatCoord = (value: number) => value.toFixed(6);

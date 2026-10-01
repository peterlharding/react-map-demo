export type LatLng = google.maps.LatLngLiteral;

export const melbourneCoords: LatLng = {
  lat: -37.813862735640086,
  lng: 144.96287723964844
};

export const formatCoord = (value: number) => value.toFixed(6);

// Fixed locale so the demo reads the same everywhere, and tests are stable
const wholeNumber = new Intl.NumberFormat('en', {maximumFractionDigits: 0});
const twoDecimals = new Intl.NumberFormat('en', {minimumFractionDigits: 2, maximumFractionDigits: 2});

// Metres below 1 km, kilometres above
export const formatDistance = (metres: number) =>
  Math.round(metres) < 1000 ? `${wholeNumber.format(metres)} m` : `${twoDecimals.format(metres / 1000)} km`;

// Square metres below a hectare, hectares below a square kilometre, then square kilometres
export const formatArea = (squareMetres: number) => {
  if (Math.round(squareMetres) < 10_000) {
    return `${wholeNumber.format(squareMetres)} m²`;
  }
  if (squareMetres < 1_000_000) {
    return `${twoDecimals.format(squareMetres / 10_000)} ha`;
  }
  return `${twoDecimals.format(squareMetres / 1_000_000)} km²`;
};

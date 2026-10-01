import {useState, useEffect} from 'react';

import MapCanvas      from './MapCanvas';
import AdvancedMarker from './AdvancedMarker';
import {melbourneCoords, formatCoord, type LatLng} from './geo';

const hasGeolocation = () => 'geolocation' in navigator;

// Centers on the browser's location (falling back to Melbourne) with a draggable marker
const MapView = () => {

  const [currentPosition, setCurrentPosition] = useState<LatLng>(melbourneCoords);
  const [locationStatus, setLocationStatus] = useState(() =>
    hasGeolocation() ? 'Locating you...' : 'Geolocation is not supported, showing Melbourne');

  useEffect(() => {
    if (!hasGeolocation()) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({lat: position.coords.latitude, lng: position.coords.longitude});
        setLocationStatus('Showing your location');
      },
      (error) => setLocationStatus(`Location unavailable (${error.message}), showing Melbourne`)
    );
  }, []);

  return (
    <section>
      <h1 className='text-info h2 mb-3'>Map View Interface</h1>
      <p className='mb-1 text-body-secondary'>{locationStatus}</p>
      <p>Lat: {formatCoord(currentPosition.lat)}<br />Long: {formatCoord(currentPosition.lng)}</p>
      <MapCanvas center={currentPosition}>
        <AdvancedMarker position={currentPosition} draggable onDragEnd={setCurrentPosition} />
      </MapCanvas>
    </section>
  );

};

export default MapView;

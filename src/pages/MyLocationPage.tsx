import {useState, useEffect} from 'react';

import DemoPage       from '../components/DemoPage';
import MapCanvas      from '../components/MapCanvas';
import AdvancedMarker from '../components/AdvancedMarker';
import {melbourneCoords, formatCoord, type LatLng} from '../components/geo';
import {demos} from '../app/demos';

const hasGeolocation = () => 'geolocation' in navigator;

const MyLocationPage = () => {

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
    <DemoPage demo={demos.myLocation}>
      <p className='mb-1 fst-italic'>{locationStatus}</p>
      <p>Lat: {formatCoord(currentPosition.lat)}<br />Long: {formatCoord(currentPosition.lng)}</p>
      <MapCanvas center={currentPosition}>
        <AdvancedMarker position={currentPosition} draggable onDragEnd={setCurrentPosition} />
      </MapCanvas>
    </DemoPage>
  );

};

export default MyLocationPage;

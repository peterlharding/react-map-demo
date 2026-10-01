import {useState} from 'react';

import MapCanvas      from './MapCanvas';
import AdvancedMarker from './AdvancedMarker';
import {melbourneCoords, formatCoord, type LatLng} from './geo';

interface MapProps {
  position?: LatLng;
}

// Drag the marker to edit a position, starting from props.position (or Melbourne)
const MapEdit = ({position = melbourneCoords}: MapProps) => {

  const [currentPosition, setCurrentPosition] = useState<LatLng>(position);

  return (
    <section>
      <h1 className='text-info h2 mb-3'>Edit Map Interface</h1>
      <p>Lat: {formatCoord(currentPosition.lat)}<br />Long: {formatCoord(currentPosition.lng)}</p>
      <MapCanvas center={currentPosition}>
        <AdvancedMarker position={currentPosition} draggable onDragEnd={setCurrentPosition} />
      </MapCanvas>
    </section>
  );

};

export default MapEdit;

import {useState} from 'react';

import DemoPage       from '../components/DemoPage';
import MapCanvas      from '../components/MapCanvas';
import AdvancedMarker from '../components/AdvancedMarker';
import {melbourneCoords, formatCoord, type LatLng} from '../components/geo';
import {demos} from '../app/demos';

interface Props {
  position?: LatLng;
}

// Starts from props.position (or Melbourne) so the page can be reused as a picker
const PickLocationPage = ({position = melbourneCoords}: Props) => {

  const [currentPosition, setCurrentPosition] = useState<LatLng>(position);

  return (
    <DemoPage demo={demos.pickLocation}>
      <p>Lat: {formatCoord(currentPosition.lat)}<br />Long: {formatCoord(currentPosition.lng)}</p>
      <MapCanvas center={currentPosition}>
        <AdvancedMarker position={currentPosition} draggable onDragEnd={setCurrentPosition} />
      </MapCanvas>
    </DemoPage>
  );

};

export default PickLocationPage;

import DemoPage       from '../components/DemoPage';
import MapCanvas      from '../components/MapCanvas';
import AdvancedMarker from '../components/AdvancedMarker';
import {melbourneCoords} from '../components/geo';
import {demos} from '../app/demos';

const MarkerPage = () => (
  <DemoPage demo={demos.marker}>
    <MapCanvas center={melbourneCoords}>
      <AdvancedMarker position={melbourneCoords} draggable />
    </MapCanvas>
  </DemoPage>
);

export default MarkerPage;

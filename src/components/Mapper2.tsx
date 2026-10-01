import MapCanvas      from './MapCanvas';
import AdvancedMarker from './AdvancedMarker';
import {melbourneCoords} from './geo';

// Draggable marker whose position is not tracked
const Mapper2 = () => (
  <section>
    <h1 className='text-info h2 mb-3'>Map Interface with Marker</h1>
    <MapCanvas center={melbourneCoords}>
      <AdvancedMarker position={melbourneCoords} draggable />
    </MapCanvas>
  </section>
);

export default Mapper2;

import MapCanvas from './MapCanvas';
import {melbourneCoords} from './geo';

// Bare map, no marker
const Mapper = () => (
  <section>
    <h1 className='text-info h2 mb-3'>Map Interface</h1>
    <MapCanvas center={melbourneCoords} />
  </section>
);

export default Mapper;

import DemoPage  from '../components/DemoPage';
import MapCanvas from '../components/MapCanvas';
import {melbourneCoords} from '../components/geo';
import {demos} from '../app/demos';

const BasicMapPage = () => (
  <DemoPage demo={demos.basicMap}>
    <MapCanvas center={melbourneCoords} />
  </DemoPage>
);

export default BasicMapPage;

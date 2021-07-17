
import {GoogleMap, LoadScript} from '@react-google-maps/api';

// import {Coords, GoogleApiCoords, Position, melbourneCoords} from 'MapView';
import {melbourneCoords} from './MapView';
import {GoogleMapsApiKey} from '../localization';

const Mapper = () => {

  const mapStyles = {
    height: '80vh',
    width: '80%'
  };


  console.log('[Mapper]        locnCenter |' + JSON.stringify(melbourneCoords) + '|');

  return (
    <div className='container text-left' style={{padding: '10px', maxWidth: '80%'}}>
      <h1 className='text-info p-2'>Map Interface</h1>
      <LoadScript googleMapsApiKey={GoogleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={melbourneCoords}>
        </GoogleMap>
      </LoadScript>
    </div>
  );

}

export default Mapper;

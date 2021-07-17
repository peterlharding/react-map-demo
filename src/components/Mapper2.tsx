import {useState} from 'react';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

import {melbourneCoords} from './MapView';
import {GoogleMapsApiKey} from '../localization';

const Mapper2 = () => {

  // console.log('[Mapper2]  props |' + JSON.stringify(props) + '|')

  // const [currentPosition, setCurrentPosition] = useState(props);

  // console.log('[Mapper2]  currentPosition |' + JSON.stringify(currentPosition) + '|')

  // useEffect(() => {setCurrentPosition(props);}, [props]);


  // const success = position => {
  //     const currentPosition = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //     }
  //     setCurrentPosition(currentPosition);
  // };

  // useEffect(() => {
  //     navigator.geolocation.getCurrentPosition(success);
  // });

  // const onMarkerDragEnd = (e) => {
  //     const lat = e.latLng.lat();
  //     const lng = e.latLng.lng();
  //     setCurrentPosition({lat, lng})
  // };


  const mapStyles = {
    height: '80vh',
    width: '80%'
  };

  
  const [currentPosition] = useState(melbourneCoords);

  console.log('[Mapper2]  currentPosition |' + JSON.stringify(currentPosition) + '|')

  return (
    <div className='container text-left' style={{padding: '10px', maxWidth: '80%'}}>
      <h1 className='text-info p-2'>Map Interface</h1>
      <LoadScript googleMapsApiKey={GoogleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={currentPosition}>
          {
            (
              currentPosition.lat ?
                  <Marker
                      position={currentPosition}
                      draggable={true} /> : null
            )
          }
        </GoogleMap>
      </LoadScript>
    </div>
  );

}

export default Mapper2;

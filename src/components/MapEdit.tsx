import {useState, useEffect} from 'react';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
//import {} from 'google.maps';

import {GoogleMapsApiKey} from '../localization';
import {melbourneCoords, GoogleApiCoords} from './MapView';

/// <reference types="google.maps" />

interface MapProps {
  position: GoogleApiCoords;
}

const MapEdit = (props: MapProps) => {

  console.log('[MapEdit]                    props |' + JSON.stringify(props) + '|');

  let position: GoogleApiCoords;

  if (props.position !== undefined) {
    position = {
      lat: props.position.lat,
      lng: props.position.lng
    };
  } else {
    position = melbourneCoords;
  }


  console.log('[MapEdit]                propsPosn |' + JSON.stringify(position) + '|');

  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  console.log('[MapEdit]          currentPosition |' + JSON.stringify(currentPosition) + '|');

  const onMarkerDragEnd = (e: unknown) => {

    const mme = e as google.maps.MapMouseEvent;

    // GoogleMapsNativeMouseEvent
    console.log(mme);
    console.log(mme.latLng);

    const lat = mme.latLng.lat();
    const lng = mme.latLng.lng();
    setCurrentPosition({lat, lng});
    // props.onChange({lat, lng});
  };

  // const placeMarkerAndPanTo = (latLng: google.maps.LatLng, map: google.maps.Map) => {
  //   new google.maps.Marker({
  //     position: latLng,
  //     map: map,
  //   });
  //   map.panTo(latLng);
  // }

  const mapStyles = {
    height: '80vh',
    width: '80%'
  };

  console.log(props);

  return (
    <div className='container text-left ' style={{width: '80%'}}>
      <h1 className='text-info p-2'>Edit Map Interface</h1>
      <p>Lat: {currentPosition.lat}<br />Long: {currentPosition.lng}</p>
      <LoadScript
        googleMapsApiKey={GoogleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={currentPosition}>
          {
            (
              currentPosition.lat ?
                <Marker
                  position={currentPosition}
                  onDragEnd={(e) => onMarkerDragEnd(e)}
                  draggable={true} /> : null
            )
          }
        </GoogleMap>
      </LoadScript>
    </div>
  );

}

export default MapEdit;

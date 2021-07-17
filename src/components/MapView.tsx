import {useState, useEffect} from 'react';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

import {GoogleMapsApiKey} from '../localization';


export interface Coords {
  latitude: number,
  longitude: number
}

export interface GoogleApiCoords {
  lat: number,
  lng: number
}

export interface Position {
  coords: Coords
}

export const melbourneCoords: GoogleApiCoords = {
  lat: -37.8957,
  lng: 145.0337
}


const MapView = () => {

  const [currentPosition, setCurrentPosition] = useState(melbourneCoords);

  const success = (position: Position) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    setCurrentPosition(currentPosition);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  });

  const onMarkerDragEnd = (e: any) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setCurrentPosition({lat, lng})
  };

  const mapStyles = {
    height: '80vh',
    width: '80%'
  };

  // const defaultCenter = {
  //     lat: -37.9, lng: 145.05  // Home!
  // }

  return (
    <div className='container text-left ' style={{width: '80%'}}>
      <h1 className='text-info p-2'>Map View Interface</h1>
      <p>Lat: {currentPosition.lat}<br />Long: {currentPosition.lng}</p>
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
                  onDragEnd={(e) => onMarkerDragEnd(e)}
                  draggable={true} /> : null
            )
          }
        </GoogleMap>
      </LoadScript>

    </div>
  );

}

export default MapView;

import {useRef, type ReactNode} from 'react';
import {GoogleMap} from '@react-google-maps/api';

import {GoogleMapId} from '../config';
import type {LatLng} from './geo';
import {isMarkerDragClick} from './markerDrag';

// Module constant so GoogleMap does not call setOptions on every render
const options: google.maps.MapOptions = {mapId: GoogleMapId};

interface Props {
  // GoogleMap re-centres only when this object changes, so pass a stable
  // value to let the user (or map.panTo) move the map freely
  center: LatLng;
  // Not called for the click that ends a marker drag
  onClick?: (event: google.maps.MapMouseEvent) => void;
  onLoad?: (map: google.maps.Map) => void;
  children?: ReactNode;
}

export const MapCanvas = ({center, onClick, onLoad, children}: Props) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    onLoad?.(map);
  };

  const handleClick = (event: google.maps.MapMouseEvent) => {
    if (mapRef.current && isMarkerDragClick(mapRef.current, event)) {
      // Also stops Google opening a place's info window when a marker is dropped on it
      event.stop();
      return;
    }
    onClick?.(event);
  };

  return (
    <GoogleMap
      mapContainerClassName='map-canvas'
      zoom={13}
      center={center}
      options={options}
      onClick={handleClick}
      onLoad={handleLoad}>
      {children}
    </GoogleMap>
  );
};

export default MapCanvas;

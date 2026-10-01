import type {ReactNode} from 'react';
import {GoogleMap} from '@react-google-maps/api';

import {GoogleMapId} from '../config';
import type {LatLng} from './geo';

// Module constant so GoogleMap does not call setOptions on every render
const options: google.maps.MapOptions = {mapId: GoogleMapId};

interface Props {
  center: LatLng;
  children?: ReactNode;
}

export const MapCanvas = ({center, children}: Props) => (
  <GoogleMap
    mapContainerClassName='map-canvas'
    zoom={13}
    center={center}
    options={options}>
    {children}
  </GoogleMap>
);

export default MapCanvas;

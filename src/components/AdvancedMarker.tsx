import {useEffect, useEffectEvent, useRef} from 'react';
import {useGoogleMap} from '@react-google-maps/api';

import type {LatLng} from './geo';

interface Props {
  position: LatLng;
  draggable?: boolean;
  onDragEnd?: (position: LatLng) => void;
}

type MarkerPosition = NonNullable<google.maps.marker.AdvancedMarkerElement['position']>;

const toLatLng = (p: MarkerPosition): LatLng =>
  p instanceof google.maps.LatLng ? p.toJSON() : {lat: p.lat, lng: p.lng};

// @react-google-maps/api only wraps the deprecated google.maps.Marker, so this
// renders a google.maps.marker.AdvancedMarkerElement on the enclosing <GoogleMap>
export const AdvancedMarker = ({position, draggable = false, onDragEnd}: Props) => {
  const map = useGoogleMap();
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const handleDragEnd = useEffectEvent(() => {
    const p = markerRef.current?.position;
    if (p) {
      onDragEnd?.(toLatLng(p));
    }
  });

  useEffect(() => {
    if (!map) {
      return;
    }
    const marker = new google.maps.marker.AdvancedMarkerElement({map});
    const listener = () => handleDragEnd();
    marker.addEventListener('gmp-dragend', listener);
    markerRef.current = marker;

    return () => {
      marker.removeEventListener('gmp-dragend', listener);
      marker.map = null;
      markerRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = position;
      markerRef.current.gmpDraggable = draggable;
    }
  }, [map, position, draggable]);

  return null;
};

export default AdvancedMarker;

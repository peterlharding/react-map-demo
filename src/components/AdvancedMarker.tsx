import {useEffect, useEffectEvent, useRef} from 'react';
import {useGoogleMap} from '@react-google-maps/api';

import type {LatLng} from './geo';
import {recordMarkerDragEnd} from './markerDrag';

interface Props {
  position: LatLng;
  draggable?: boolean;
  // Text shown inside the pin, such as a number
  label?: string;
  // Tooltip and accessible name
  title?: string;
  onDragEnd?: (position: LatLng) => void;
  onClick?: () => void;
}

type MarkerPosition = NonNullable<google.maps.marker.AdvancedMarkerElement['position']>;

const toLatLng = (p: MarkerPosition): LatLng =>
  p instanceof google.maps.LatLng ? p.toJSON() : {lat: p.lat, lng: p.lng};

// @react-google-maps/api only wraps the deprecated google.maps.Marker, so this
// renders a google.maps.marker.AdvancedMarkerElement on the enclosing <GoogleMap>
export const AdvancedMarker = ({position, draggable = false, label, title, onDragEnd, onClick}: Props) => {
  const map = useGoogleMap();
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const handleDragEnd = useEffectEvent(() => {
    const p = markerRef.current?.position;
    if (p) {
      onDragEnd?.(toLatLng(p));
    }
  });

  const handleClick = useEffectEvent(() => onClick?.());

  useEffect(() => {
    if (!map) {
      return;
    }
    const marker = new google.maps.marker.AdvancedMarkerElement({map});
    const listener = (event: Event) => {
      recordMarkerDragEnd(map, event.timeStamp);
      handleDragEnd();
    };
    marker.addEventListener('gmp-dragend', listener);
    markerRef.current = marker;

    return () => {
      marker.removeEventListener('gmp-dragend', listener);
      marker.map = null;
      markerRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return;
    }
    marker.position = position;
    marker.gmpDraggable = draggable;
    marker.title = title ?? '';
  }, [map, position, draggable, title]);

  // Without a label the marker keeps Google's default pin. The default glyph
  // colour is a dark red that is hard to read as text, so labels are white.
  useEffect(() => {
    if (markerRef.current && label !== undefined) {
      markerRef.current.content = new google.maps.marker.PinElement({glyphText: label, glyphColor: 'white'});
    }
  }, [map, label]);

  // Only make the marker clickable, with a pointer cursor, when asked to;
  // gmp-click does not fire unless gmpClickable is set
  const clickable = onClick !== undefined;
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || !clickable) {
      return;
    }
    const listener = () => handleClick();
    marker.gmpClickable = true;
    marker.addEventListener('gmp-click', listener);
    return () => {
      marker.removeEventListener('gmp-click', listener);
      marker.gmpClickable = false;
    };
  }, [map, clickable]);

  return null;
};

export default AdvancedMarker;

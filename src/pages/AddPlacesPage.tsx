import {useRef, useState} from 'react';
import {InfoWindowF} from '@react-google-maps/api';
import {Button, Card, CloseButton, Col, ListGroup, Row} from 'react-bootstrap';

import DemoPage       from '../components/DemoPage';
import MapCanvas      from '../components/MapCanvas';
import AdvancedMarker from '../components/AdvancedMarker';
import {melbourneCoords, formatCoord, type LatLng} from '../components/geo';
import {demos} from '../app/demos';

interface Place {
  id: number;
  name: string;
  position: LatLng;
}

const nextId = (places: Place[]) => Math.max(0, ...places.map((place) => place.id)) + 1;

const formatPosition = ({lat, lng}: LatLng) => `${formatCoord(lat)}, ${formatCoord(lng)}`;

// Clicking the map adds a place; markers and list entries open an info window
const AddPlacesPage = () => {

  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const selected = places.find((place) => place.id === selectedId);

  const addPlace = (event: google.maps.MapMouseEvent) => {
    // Clicking one of Google's points of interest would otherwise open its own info window
    event.stop();
    const latLng = event.latLng;
    if (!latLng) {
      return;
    }
    setPlaces((current) => {
      const id = nextId(current);
      return [...current, {id, name: `Place ${id}`, position: latLng.toJSON()}];
    });
    setSelectedId(null);
  };

  const movePlace = (id: number, position: LatLng) =>
    setPlaces((current) => current.map((place) => place.id === id ? {...place, position} : place));

  const removePlace = (id: number) => {
    setPlaces((current) => current.filter((place) => place.id !== id));
    setSelectedId((current) => current === id ? null : current);
  };

  const clearPlaces = () => {
    setPlaces([]);
    setSelectedId(null);
  };

  const showPlace = (place: Place) => {
    setSelectedId(place.id);
    mapRef.current?.panTo(place.position);
  };

  return (
    <DemoPage demo={demos.addPlaces}>
      <Row className='g-3'>
        <Col lg={8}>
          <MapCanvas center={melbourneCoords} onClick={addPlace} onLoad={(map) => { mapRef.current = map; }}>
            {places.map((place) => (
              <AdvancedMarker
                key={place.id}
                position={place.position}
                label={String(place.id)}
                title={place.name}
                draggable
                onDragEnd={(position) => movePlace(place.id, position)}
                onClick={() => setSelectedId(place.id)} />
            ))}
            {selected && (
              <PlaceInfoWindow
                key={selected.id}
                place={selected}
                onClose={() => setSelectedId(null)}
                onRemove={() => removePlace(selected.id)} />
            )}
          </MapCanvas>
        </Col>
        <Col lg={4}>
          <PlacesList
            places={places}
            selectedId={selectedId}
            onShow={showPlace}
            onRemove={removePlace}
            onClear={clearPlaces} />
        </Col>
      </Row>
    </DemoPage>
  );

};

interface PlaceInfoWindowProps {
  place: Place;
  onClose: () => void;
  onRemove: () => void;
}

// Keyed by place, so the options are built once per place shown
const PlaceInfoWindow = ({place, onClose, onRemove}: PlaceInfoWindowProps) => {
  const [options] = useState<google.maps.InfoWindowOptions>(() => ({
    headerContent: place.name,
    // Lift the info window's tail from the pin's tip to its head
    pixelOffset: new google.maps.Size(0, -40)
  }));

  return (
    <InfoWindowF position={place.position} options={options} onCloseClick={onClose}>
      <div className='small'>
        <div className='text-body-secondary mb-2'>{formatPosition(place.position)}</div>
        <Button size='sm' variant='outline-danger' onClick={onRemove}>Remove</Button>
      </div>
    </InfoWindowF>
  );
};

interface PlacesListProps {
  places: Place[];
  selectedId: number | null;
  onShow: (place: Place) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
}

const PlacesList = ({places, selectedId, onShow, onRemove, onClear}: PlacesListProps) => (
  <Card className='places-panel'>
    <Card.Header className='d-flex justify-content-between align-items-center'>
      <h2 className='h6 mb-0'>Places ({places.length})</h2>
      <Button size='sm' variant='outline-secondary' disabled={places.length === 0} onClick={onClear}>
        Clear all
      </Button>
    </Card.Header>
    {places.length === 0 ? (
      <Card.Body className='text-body-secondary'>Click the map to add your first place.</Card.Body>
    ) : (
      <ListGroup as='ul' variant='flush' className='overflow-auto' aria-label='Places'>
        {places.map((place) => {
          const active = place.id === selectedId;
          return (
            <ListGroup.Item as='li' key={place.id} active={active} className='d-flex align-items-center gap-2'>
              <button
                type='button'
                className='btn p-0 border-0 text-start text-reset flex-grow-1'
                aria-current={active || undefined}
                onClick={() => onShow(place)}>
                <span className='d-block fw-semibold'>{place.name}</span>
                <small className={active ? undefined : 'text-body-secondary'}>{formatPosition(place.position)}</small>
              </button>
              <CloseButton
                variant={active ? 'white' : undefined}
                aria-label={`Remove ${place.name}`}
                onClick={() => onRemove(place.id)} />
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    )}
  </Card>
);

export default AddPlacesPage;

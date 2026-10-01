import {useEffect, useMemo, useRef, useState} from 'react';
import {useSearchParams} from 'react-router';
import {Button, Card, Col, Form, InputGroup, Row} from 'react-bootstrap';

import DemoPage  from '../components/DemoPage';
import MapCanvas from '../components/MapCanvas';
import {formatCoord} from '../components/geo';
import {mapTypes, parseView, sameView, viewOfMap, viewToParams, type MapType, type MapView} from '../components/mapView';
import {demos} from '../app/demos';

const presets: {name: string; view: MapView}[] = [
  {name: 'Melbourne CBD', view: {center: {lat: -37.8136, lng: 144.9631}, zoom: 14, mapType: 'roadmap'}},
  {name: 'St Kilda Pier', view: {center: {lat: -37.8634, lng: 144.9714}, zoom: 16, mapType: 'satellite'}},
  {name: 'Dandenong Ranges', view: {center: {lat: -37.8667, lng: 145.3500}, zoom: 12, mapType: 'terrain'}},
  {name: 'Port Phillip Bay', view: {center: {lat: -38.1300, lng: 144.8600}, zoom: 9, mapType: 'hybrid'}}
];

const mapTypeLabels: Record<MapType, string> = {
  roadmap: 'Road map',
  satellite: 'Satellite',
  hybrid: 'Satellite with labels',
  terrain: 'Terrain'
};

// The page address is the only state: the map shows what it says, and moving
// the map writes back to it
const MapStatePage = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const view = parseView(searchParams);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Spell out the whole view in the address, filling in defaults and replacing
  // invalid values, so it can always be copied as it is
  const query = searchParams.toString();
  const canonicalQuery = viewToParams(view).toString();
  useEffect(() => {
    if (query !== canonicalQuery) {
      setSearchParams(canonicalQuery, {replace: true});
    }
  }, [query, canonicalQuery, setSearchParams]);

  // GoogleMap re-centres whenever the center object changes, so keep it the same
  // object until the coordinates themselves change
  const {lat, lng} = view.center;
  const center = useMemo(() => ({lat, lng}), [lat, lng]);

  // Choosing a view adds a history entry, so Back and Forward step between views.
  // Following the map as it is panned or zoomed replaces the current entry instead.
  const showView = (next: MapView, {addToHistory}: {addToHistory: boolean}) => {
    if (!sameView(next, view)) {
      setSearchParams(viewToParams(next), {replace: !addToHistory});
    }
  };

  const followMap = () => {
    const shown = mapRef.current && viewOfMap(mapRef.current);
    if (shown) {
      showView(shown, {addToHistory: false});
    }
  };

  // The map's own Map/Satellite control is a deliberate choice, like the picker
  const followMapType = () => {
    const shown = mapRef.current && viewOfMap(mapRef.current);
    if (shown) {
      showView({...view, mapType: shown.mapType}, {addToHistory: true});
    }
  };

  return (
    <DemoPage demo={demos.mapState}>
      <Row className='g-3'>
        <Col lg={8}>
          <MapCanvas
            center={center}
            zoom={view.zoom}
            mapTypeId={view.mapType}
            onLoad={(map) => { mapRef.current = map; }}
            onIdle={followMap}
            onMapTypeIdChanged={followMapType} />
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h2 className='h6 mb-0'>Go to</h2>
            </Card.Header>
            <Card.Body className='d-grid gap-2'>
              {presets.map(({name, view: preset}) => (
                <Button
                  key={name}
                  variant='outline-primary'
                  className='text-start'
                  aria-pressed={sameView(preset, view)}
                  active={sameView(preset, view)}
                  onClick={() => showView(preset, {addToHistory: true})}>
                  {name}
                </Button>
              ))}
            </Card.Body>
          </Card>
          <Card className='mt-3'>
            <Card.Header>
              <h2 className='h6 mb-0'>Current view</h2>
            </Card.Header>
            <Card.Body>
              <Form.Group className='mb-3' controlId='map-type'>
                <Form.Label>Map type</Form.Label>
                <Form.Select
                  value={view.mapType}
                  onChange={(event) => showView({...view, mapType: event.target.value as MapType}, {addToHistory: true})}>
                  {mapTypes.map((type) => <option key={type} value={type}>{mapTypeLabels[type]}</option>)}
                </Form.Select>
              </Form.Group>
              <dl className='row small mb-3'>
                <dt className='col-4'>Latitude</dt>
                <dd className='col-8'>{formatCoord(view.center.lat)}</dd>
                <dt className='col-4'>Longitude</dt>
                <dd className='col-8'>{formatCoord(view.center.lng)}</dd>
                <dt className='col-4'>Zoom</dt>
                <dd className='col-8 mb-0'>{view.zoom}</dd>
              </dl>
              <ShareLink query={canonicalQuery} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DemoPage>
  );

};

// The full page address, with a button to copy it
const ShareLink = ({query}: {query: string}) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const link = `${window.location.origin}${window.location.pathname}?${query}`;

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      // Clipboard access can be refused; leave the link selected to copy by hand
      inputRef.current?.select();
    }
  };

  return (
    <Form.Group controlId='share-link'>
      <Form.Label>Link to this view</Form.Label>
      <InputGroup>
        <Form.Control ref={inputRef} readOnly value={link} onFocus={(event) => event.target.select()} />
        {/* Wide enough for either label, so the field does not jump */}
        <Button variant='outline-secondary' style={{minWidth: '5.5rem'}} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </InputGroup>
    </Form.Group>
  );
};

export default MapStatePage;

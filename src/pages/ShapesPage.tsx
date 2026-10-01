import {useRef, useState, type ReactNode} from 'react';
import {CircleF, PolygonF, PolylineF} from '@react-google-maps/api';
import {Button, Card, CloseButton, Col, ListGroup, Row, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';

import DemoPage  from '../components/DemoPage';
import MapCanvas from '../components/MapCanvas';
import {melbourneCoords, formatArea, formatDistance, type LatLng} from '../components/geo';
import {demos} from '../app/demos';

type Tool = 'route' | 'area' | 'circle';

interface CircleShape {
  center: LatLng;
  radius: number;
}

const colours: Record<Tool, string> = {
  route: '#0d6efd',
  area: '#198754',
  circle: '#fd7e14'
};

const tools: {id: Tool; label: string; hint: string}[] = [
  {
    id: 'route',
    label: 'Route',
    hint: 'Click the map to add points to the route. Drag a white handle to move a point, or a faint midpoint handle to add one.'
  },
  {
    id: 'area',
    label: 'Area',
    hint: 'Click the map to add corners to the area. Drag the handles to reshape it.'
  },
  {
    id: 'circle',
    label: 'Circle',
    hint: 'Click the map to place the circle. Drag its centre handle to move it, and its edge handle to resize it.'
  }
];

const defaultRadius = 1000;

// Module constants so the shapes do not call setOptions on every render
const routeOptions: google.maps.PolylineOptions = {
  strokeColor: colours.route, strokeWeight: 4, editable: true
};
const areaOptions: google.maps.PolygonOptions = {
  strokeColor: colours.area, strokeWeight: 3, fillColor: colours.area, fillOpacity: 0.2, editable: true
};
const circleOptions: google.maps.CircleOptions = {
  strokeColor: colours.circle, strokeWeight: 3, fillColor: colours.circle, fillOpacity: 0.15, editable: true
};

const samePath = (a: LatLng[], b: LatLng[]) =>
  a.length === b.length && a.every((point, i) => point.lat === b[i].lat && point.lng === b[i].lng);

const pathOf = (shape: google.maps.Polyline | google.maps.Polygon): LatLng[] =>
  shape.getPath().getArray().map((point) => point.toJSON());

// A click on a shape's vertex handle starts an edit rather than adding a point
const isHandleClick = (event: google.maps.MapMouseEvent) =>
  (event as google.maps.PolyMouseEvent).vertex !== undefined;

// Draws an editable route, area and circle, and measures them
const ShapesPage = () => {

  const [tool, setTool] = useState<Tool>('route');
  const [route, setRoute] = useState<LatLng[]>([]);
  const [area, setArea] = useState<LatLng[]>([]);
  const [circle, setCircle] = useState<CircleShape | null>(null);

  const routeRef = useRef<google.maps.Polyline | null>(null);
  const areaRef = useRef<google.maps.Polygon | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const addPoint = (event: google.maps.MapMouseEvent) => {
    // Clicking one of Google's points of interest would otherwise open its own info window
    event.stop();
    const point = event.latLng?.toJSON();
    if (!point || isHandleClick(event)) {
      return;
    }
    if (tool === 'route') {
      setRoute((current) => [...current, point]);
    } else if (tool === 'area') {
      setArea((current) => [...current, point]);
    } else {
      setCircle((current) => ({center: point, radius: current?.radius ?? defaultRadius}));
    }
  };

  // Google edits the shapes' own paths while a handle is dragged; copy the result
  // back into React state once the drag ends. Keeping the old array when nothing
  // changed avoids a re-render that would reset the path.
  const syncRoute = () => {
    if (routeRef.current) {
      const next = pathOf(routeRef.current);
      setRoute((current) => samePath(current, next) ? current : next);
    }
  };

  const syncArea = () => {
    if (areaRef.current) {
      const next = pathOf(areaRef.current);
      setArea((current) => samePath(current, next) ? current : next);
    }
  };

  // Fires while the circle's handles are dragged, and when React sets its props,
  // so unchanged values must not update state or the two would loop
  const syncCircle = () => {
    const shape = circleRef.current;
    const center = shape?.getCenter()?.toJSON();
    if (!shape || !center) {
      return;
    }
    const radius = shape.getRadius();
    setCircle((current) => {
      if (!current) {
        return current;
      }
      const unchanged = current.radius === radius
        && current.center.lat === center.lat && current.center.lng === center.lng;
      return unchanged ? current : {center, radius};
    });
  };

  const undo = () => {
    if (tool === 'route') {
      setRoute((current) => current.slice(0, -1));
    } else if (tool === 'area') {
      setArea((current) => current.slice(0, -1));
    }
  };

  const canUndo = (tool === 'route' && route.length > 0) || (tool === 'area' && area.length > 0);

  return (
    <DemoPage demo={demos.shapes}>
      <div className='d-flex flex-wrap align-items-center gap-2 mb-2'>
        <ToggleButtonGroup type='radio' name='tool' value={tool} onChange={(value: Tool) => setTool(value)}>
          {tools.map(({id, label}) => (
            <ToggleButton key={id} id={`tool-${id}`} value={id} variant='outline-primary'>
              <span className='shape-swatch' style={{backgroundColor: colours[id]}} aria-hidden='true' />
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Button variant='outline-secondary' disabled={!canUndo} onClick={undo}>Undo last point</Button>
      </div>
      <p className='small text-body-secondary'>{tools.find(({id}) => id === tool)?.hint}</p>
      <Row className='g-3'>
        <Col lg={8}>
          <MapCanvas center={melbourneCoords} onClick={addPoint}>
            {route.length > 0 && (
              <PolylineF
                path={route}
                options={routeOptions}
                onLoad={(shape) => { routeRef.current = shape; }}
                onUnmount={() => { routeRef.current = null; }}
                onClick={addPoint}
                onMouseUp={syncRoute} />
            )}
            {area.length > 0 && (
              <PolygonF
                path={area}
                options={areaOptions}
                onLoad={(shape) => { areaRef.current = shape; }}
                onUnmount={() => { areaRef.current = null; }}
                onClick={addPoint}
                onMouseUp={syncArea} />
            )}
            {circle && (
              <CircleF
                center={circle.center}
                radius={circle.radius}
                options={circleOptions}
                onLoad={(shape) => { circleRef.current = shape; }}
                onUnmount={() => { circleRef.current = null; }}
                onClick={addPoint}
                onCenterChanged={syncCircle}
                onRadiusChanged={syncCircle} />
            )}
          </MapCanvas>
        </Col>
        <Col lg={4}>
          <Measurements
            tool={tool}
            route={route}
            area={area}
            circle={circle}
            onClearRoute={() => setRoute([])}
            onClearArea={() => setArea([])}
            onClearCircle={() => setCircle(null)} />
        </Col>
      </Row>
    </DemoPage>
  );

};

interface MeasurementsProps {
  tool: Tool;
  route: LatLng[];
  area: LatLng[];
  circle: CircleShape | null;
  onClearRoute: () => void;
  onClearArea: () => void;
  onClearCircle: () => void;
}

const Measurements = ({tool, route, area, circle, onClearRoute, onClearArea, onClearCircle}: MeasurementsProps) => {
  // Read only when there is something to measure
  const spherical = () => google.maps.geometry.spherical;

  return (
    <Card>
      <Card.Header>
        <h2 className='h6 mb-0'>Measurements</h2>
      </Card.Header>
      <ListGroup as='ul' variant='flush'>
        <Measurement shape='route' active={tool === 'route'} title='Route' empty={route.length === 0} onClear={onClearRoute}>
          {route.length < 2 ? (
            <>Add at least 2 points</>
          ) : (
            <>Length {formatDistance(spherical().computeLength(route))} ({route.length} points)</>
          )}
        </Measurement>
        <Measurement shape='area' active={tool === 'area'} title='Area' empty={area.length === 0} onClear={onClearArea}>
          {area.length < 3 ? (
            <>Add at least 3 corners</>
          ) : (
            <>
              Area {formatArea(spherical().computeArea(area))}
              <br />
              Perimeter {formatDistance(spherical().computeLength([...area, area[0]]))}
            </>
          )}
        </Measurement>
        <Measurement shape='circle' active={tool === 'circle'} title='Circle' empty={!circle} onClear={onClearCircle}>
          {!circle ? (
            <>Not placed yet</>
          ) : (
            <>
              Radius {formatDistance(circle.radius)}
              <br />
              Area {formatArea(spherical().computeArea(circle))}
            </>
          )}
        </Measurement>
      </ListGroup>
    </Card>
  );
};

interface MeasurementProps {
  shape: Tool;
  active: boolean;
  title: string;
  empty: boolean;
  onClear: () => void;
  children: ReactNode;
}

const Measurement = ({shape, active, title, empty, onClear, children}: MeasurementProps) => (
  <ListGroup.Item as='li' className={`d-flex align-items-start gap-2${active ? ' bg-body-tertiary' : ''}`}>
    <span className='shape-swatch mt-1' style={{backgroundColor: colours[shape]}} aria-hidden='true' />
    <div className='flex-grow-1'>
      <div className='fw-semibold'>{title}</div>
      <div className='small text-body-secondary'>{children}</div>
    </div>
    <CloseButton aria-label={`Clear ${title.toLowerCase()}`} disabled={empty} onClick={onClear} />
  </ListGroup.Item>
);

export default ShapesPage;

import {useEffect} from 'react';
import {createMemoryRouter, RouterProvider} from 'react-router';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import MapStatePage from './MapStatePage';

// What the stand-in map is showing, as if the user had moved it
let shown = {lat: -37.8, lng: 144.9, zoom: 13, type: 'roadmap'};
const fakeMap = {
  getCenter: () => ({toJSON: () => ({lat: shown.lat, lng: shown.lng})}),
  getZoom: () => shown.zoom,
  getMapTypeId: () => shown.type
};

interface StandInProps {
  center: {lat: number; lng: number};
  zoom: number;
  mapTypeId?: string;
  onLoad?: (map: unknown) => void;
  onIdle?: () => void;
  onMapTypeIdChanged?: () => void;
}

// The Maps JavaScript API cannot load in jsdom. The stand-in map prints the view
// it was given, and has buttons to fire the events a real map would.
vi.mock('@react-google-maps/api', () => ({
  GoogleMap: ({center, zoom, mapTypeId, onLoad, onIdle, onMapTypeIdChanged}: StandInProps) => {
    useEffect(() => onLoad?.(fakeMap), [onLoad]);
    return (
      <div>
        <output aria-label='map view'>{`${center.lat},${center.lng} z${zoom} ${mapTypeId}`}</output>
        <button type='button' onClick={() => onIdle?.()}>idle</button>
        <button type='button' onClick={() => onMapTypeIdChanged?.()}>type changed</button>
      </div>
    );
  }
}));

const renderAt = (url: string) => {
  const router = createMemoryRouter([{path: '/map-state', element: <MapStatePage />}], {initialEntries: [url]});
  render(<RouterProvider router={router} />);
  return router;
};

const mapView = () => screen.getByRole('status', {name: 'map view'}).textContent;
const query = (router: ReturnType<typeof renderAt>) => router.state.location.search;

describe('MapStatePage', () => {
  beforeEach(() => {
    shown = {lat: -37.8, lng: 144.9, zoom: 13, type: 'roadmap'};
  });

  it('shows the view in the address', () => {
    renderAt('/map-state?lat=-37.86&lng=144.97&zoom=16&type=satellite');

    expect(mapView()).toBe('-37.86,144.97 z16 satellite');
    expect(screen.getByLabelText('Map type')).toHaveValue('satellite');
  });

  it('spells out the full view when the address is missing values or has invalid ones', () => {
    const router = renderAt('/map-state?lat=abc&zoom=15');

    expect(query(router)).toBe('?lat=-37.81386&lng=144.96288&zoom=15&type=roadmap');
    expect(router.state.historyAction).toBe('REPLACE');
    expect(screen.getByLabelText('Link to this view'))
      .toHaveValue(`${window.location.origin}${window.location.pathname}?lat=-37.81386&lng=144.96288&zoom=15&type=roadmap`);
  });

  it('adds a history entry when a place is chosen, so Back returns to the previous view', async () => {
    const router = renderAt('/map-state?lat=-37.8&lng=144.9&zoom=13&type=roadmap');

    await userEvent.click(screen.getByRole('button', {name: 'Dandenong Ranges'}));

    expect(query(router)).toBe('?lat=-37.8667&lng=145.35&zoom=12&type=terrain');
    expect(router.state.historyAction).toBe('PUSH');
    expect(mapView()).toBe('-37.8667,145.35 z12 terrain');
    expect(screen.getByRole('button', {name: 'Dandenong Ranges'})).toHaveAttribute('aria-pressed', 'true');

    await act(() => router.navigate(-1));
    expect(mapView()).toBe('-37.8,144.9 z13 roadmap');
  });

  it('follows the map as it is moved, replacing the current history entry', async () => {
    const router = renderAt('/map-state?lat=-37.8&lng=144.9&zoom=13&type=roadmap');

    shown = {lat: -37.912345678, lng: 145.0123456, zoom: 14.5, type: 'roadmap'};
    await userEvent.click(screen.getByRole('button', {name: 'idle'}));

    expect(query(router)).toBe('?lat=-37.91235&lng=145.01235&zoom=14.5&type=roadmap');
    expect(router.state.historyAction).toBe('REPLACE');
  });

  it('does not touch the address when the map settles on the view it was given', async () => {
    const router = renderAt('/map-state?lat=-37.8&lng=144.9&zoom=13&type=roadmap');
    const before = router.state.location.key;

    shown = {lat: -37.800001, lng: 144.900001, zoom: 13, type: 'roadmap'};
    await userEvent.click(screen.getByRole('button', {name: 'idle'}));

    expect(router.state.location.key).toBe(before);
  });

  it('records a map type chosen with the picker or the map\'s own control', async () => {
    const router = renderAt('/map-state?lat=-37.8&lng=144.9&zoom=13&type=roadmap');

    await userEvent.selectOptions(screen.getByLabelText('Map type'), 'Terrain');
    expect(query(router)).toBe('?lat=-37.8&lng=144.9&zoom=13&type=terrain');
    expect(router.state.historyAction).toBe('PUSH');

    shown = {...shown, type: 'satellite'};
    await userEvent.click(screen.getByRole('button', {name: 'type changed'}));
    expect(query(router)).toBe('?lat=-37.8&lng=144.9&zoom=13&type=satellite');
  });
});

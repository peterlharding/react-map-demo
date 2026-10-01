import type {ReactNode} from 'react';
import {createMemoryRouter, RouterProvider} from 'react-router';
import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {routes} from './routes';

// The Maps JavaScript API cannot load in jsdom, so stand in for the loaded map
vi.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({isLoaded: true, loadError: undefined}),
  useGoogleMap: () => null,
  GoogleMap: ({children}: {children?: ReactNode}) => <div data-testid='google-map'>{children}</div>
}));

vi.mock('../config', () => ({GoogleMapsApiKey: 'test-key', GoogleMapId: 'DEMO_MAP_ID'}));

const renderAt = (path: string) =>
  render(<RouterProvider router={createMemoryRouter(routes, {initialEntries: [path]})} />);

describe('routes', () => {
  it.each([
    ['/map-view', 'Map View Interface', 'Map View'],
    ['/mapper',   'Map Interface',      'Mapper'],
    ['/mapper2',  'Map Interface with Marker', 'Mapper2'],
    ['/map-edit', 'Edit Map Interface', 'Map Edit']
  ])('%s renders its page and marks its nav link active', async (path, heading, link) => {
    renderAt(path);

    expect(await screen.findByRole('heading', {name: heading})).toBeInTheDocument();
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: link})).toHaveAttribute('aria-current', 'page');
  });

  it('redirects / to the map view', async () => {
    renderAt('/');

    expect(await screen.findByRole('heading', {name: 'Map View Interface'})).toBeInTheDocument();
  });

  it('shows the Melbourne fallback coordinates on the edit page', async () => {
    renderAt('/map-edit');

    expect(await screen.findByText(/Lat: -37\.813863/)).toBeInTheDocument();
  });

  it('shows a not found page for unknown paths', async () => {
    renderAt('/nowhere');

    expect(await screen.findByRole('heading', {name: 'Page Not Found'})).toBeInTheDocument();
    expect(screen.getByText('/nowhere')).toBeInTheDocument();
  });
});

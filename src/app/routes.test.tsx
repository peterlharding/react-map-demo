import type {ReactNode} from 'react';
import {createMemoryRouter, RouterProvider} from 'react-router';
import {render, screen, within} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {routes} from './routes';
import {demoList} from './demos';

// The Maps JavaScript API cannot load in jsdom, so stand in for the loaded map
vi.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({isLoaded: true, loadError: undefined}),
  useGoogleMap: () => null,
  GoogleMap: ({children}: {children?: ReactNode}) => <div data-testid='google-map'>{children}</div>,
  InfoWindowF: () => null
}));

vi.mock('../config', () => ({GoogleMapsApiKey: 'test-key', GoogleMapId: 'DEMO_MAP_ID'}));

const renderAt = (path: string) =>
  render(<RouterProvider router={createMemoryRouter(routes, {initialEntries: [path]})} />);

const demoNav = () => screen.getByRole('navigation', {name: 'Demos'});

describe('routes', () => {
  it.each(demoList.map((demo) => [demo.path, demo] as const))(
    '%s renders its demo with a description and marks its nav link active',
    async (path, demo) => {
      renderAt(path);

      expect(await screen.findByRole('heading', {level: 1, name: demo.title})).toBeInTheDocument();
      expect(screen.getByText(demo.summary)).toBeInTheDocument();
      expect(screen.getByText(demo.tryIt)).toBeInTheDocument();
      expect(screen.getByTestId('google-map')).toBeInTheDocument();
      expect(within(demoNav()).getByRole('link', {name: demo.title})).toHaveAttribute('aria-current', 'page');
    }
  );

  it('lists every demo on the home page, in order, without loading a map', async () => {
    renderAt('/');

    expect(await screen.findByRole('heading', {level: 1, name: 'React Map Demo'})).toBeInTheDocument();
    const cards = screen.getAllByRole('heading', {level: 2});
    expect(cards.map((card) => card.textContent)).toEqual(demoList.map((demo) => demo.title));
    for (const demo of demoList) {
      expect(screen.getByText(demo.summary)).toBeInTheDocument();
    }
    expect(screen.queryByTestId('google-map')).not.toBeInTheDocument();
  });

  it.each([
    ['/mapper',   'Basic Map'],
    ['/mapper2',  'Marker'],
    ['/map-edit', 'Pick a Location'],
    ['/map-view', 'My Location']
  ])('redirects the old path %s to %s', async (path, title) => {
    renderAt(path);

    expect(await screen.findByRole('heading', {level: 1, name: title})).toBeInTheDocument();
  });

  it('shows the Melbourne fallback coordinates on Pick a Location', async () => {
    renderAt('/pick-location');

    expect(await screen.findByText(/Lat: -37\.813863/)).toBeInTheDocument();
  });

  it('shows a not found page for unknown paths', async () => {
    renderAt('/nowhere');

    expect(await screen.findByRole('heading', {name: 'Page Not Found'})).toBeInTheDocument();
    expect(screen.getByText('/nowhere')).toBeInTheDocument();
  });
});

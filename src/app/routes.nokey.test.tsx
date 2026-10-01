import {createMemoryRouter, RouterProvider} from 'react-router';
import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {routes} from './routes';

vi.mock('../config', () => ({GoogleMapsApiKey: '', GoogleMapId: 'DEMO_MAP_ID'}));

const renderAt = (path: string) =>
  render(<RouterProvider router={createMemoryRouter(routes, {initialEntries: [path]})} />);

describe('routes without an API key', () => {
  it('still shows the home page', async () => {
    renderAt('/');

    expect(await screen.findByRole('heading', {level: 1, name: 'React Map Demo'})).toBeInTheDocument();
    expect(screen.queryByText('Google Maps API key missing')).not.toBeInTheDocument();
  });

  it('explains the missing key on a demo page', async () => {
    renderAt('/basic-map');

    expect(await screen.findByText('Google Maps API key missing')).toBeInTheDocument();
  });
});

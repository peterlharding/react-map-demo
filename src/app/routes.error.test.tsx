import {createMemoryRouter, RouterProvider} from 'react-router';
import {render, screen, within} from '@testing-library/react';
import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';

import {routes} from './routes';
import {isStaleModule, redactKeys} from './errors';

vi.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({isLoaded: true, loadError: undefined})
}));

vi.mock('../config', () => ({GoogleMapsApiKey: 'test-key', GoogleMapId: 'DEMO_MAP_ID'}));

// A demo page that fails while rendering, with a key in its message like the Maps loader's
vi.mock('../pages/BasicMapPage', () => ({
  default: () => {
    throw new Error('Loader failed {"apiKey":"AIzaSecret","libraries":["marker"]}');
  }
}));

describe('route errors', () => {
  // React logs caught render errors; keep the test output clean
  const consoleError = vi.spyOn(console, 'error');
  beforeAll(() => consoleError.mockImplementation(() => {}));
  afterAll(() => consoleError.mockRestore());

  it('shows the error page inside the layout, with recovery actions and redacted details', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, {initialEntries: ['/basic-map']})} />);

    expect(await screen.findByRole('heading', {level: 1, name: 'Something went wrong'})).toBeInTheDocument();
    expect(screen.getByRole('navigation', {name: 'Demos'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Reload page'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Back to the demo list'})).toHaveAttribute('href', '/');

    const details = within(screen.getByRole('group')).getByText(/Loader failed/);
    expect(details).toHaveTextContent('"apiKey":"[hidden]"');
    expect(details).not.toHaveTextContent('AIzaSecret');
  });
});

describe('isStaleModule', () => {
  it('recognises a lazy page whose file no longer exists', () => {
    expect(isStaleModule(new TypeError('Failed to fetch dynamically imported module: /assets/ShapesPage-x.js'))).toBe(true);
    expect(isStaleModule(new Error('Boom'))).toBe(false);
  });
});

describe('redactKeys', () => {
  it('hides API keys in JSON and in URLs', () => {
    expect(redactKeys('{"apiKey":"abc123","id":"x"}')).toBe('{"apiKey":"[hidden]","id":"x"}');
    expect(redactKeys('https://maps.googleapis.com/maps/api/js?key=abc123&libraries=marker'))
      .toBe('https://maps.googleapis.com/maps/api/js?key=[hidden]&libraries=marker');
  });
});

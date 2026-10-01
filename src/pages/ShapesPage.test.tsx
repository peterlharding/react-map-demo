import type {ReactNode} from 'react';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import ShapesPage from './ShapesPage';

// The Maps JavaScript API cannot load in jsdom. The stand-in map turns a click
// into a map click at the next queued position, and each shape renders its size.
let nextClick = {lat: -37.8, lng: 144.9};
vi.mock('@react-google-maps/api', () => ({
  GoogleMap: ({children, onClick}: {children?: ReactNode; onClick?: (event: unknown) => void}) => (
    <div>
      <button type='button' onClick={() => onClick?.({
        latLng: {toJSON: () => nextClick},
        domEvent: {timeStamp: 0},
        stop: () => {}
      })}>
        map
      </button>
      {children}
    </div>
  ),
  PolylineF: ({path}: {path: unknown[]}) => <div data-testid='route'>{path.length}</div>,
  PolygonF: ({path}: {path: unknown[]}) => <div data-testid='area'>{path.length}</div>,
  CircleF: ({radius}: {radius: number}) => <div data-testid='circle'>{radius}</div>
}));

// Fixed results, so the tests check the wiring and formatting rather than geometry
vi.stubGlobal('google', {
  maps: {
    geometry: {
      spherical: {
        computeLength: (path: unknown[]) => path.length * 1000,
        computeArea: () => 2_500_000
      }
    }
  }
});

const clickMap = async (lat = -37.8, lng = 144.9) => {
  nextClick = {lat, lng};
  await userEvent.click(screen.getByRole('button', {name: 'map'}));
};

const measurement = (title: string) =>
  screen.getAllByRole('listitem').find((item) => item.textContent?.startsWith(title))!;

const chooseTool = (label: string) => userEvent.click(screen.getByRole('radio', {name: label}));

describe('ShapesPage', () => {
  beforeEach(() => {
    render(<ShapesPage />);
  });

  it('starts with nothing drawn and the route tool selected', () => {
    expect(screen.getByRole('radio', {name: 'Route'})).toBeChecked();
    expect(measurement('Route')).toHaveTextContent('Add at least 2 points');
    expect(measurement('Area')).toHaveTextContent('Add at least 3 corners');
    expect(measurement('Circle')).toHaveTextContent('Not placed yet');
    expect(screen.getByRole('button', {name: 'Undo last point'})).toBeDisabled();
  });

  it('measures a route once it has two points', async () => {
    await clickMap();
    expect(measurement('Route')).toHaveTextContent('Add at least 2 points');

    await clickMap(-37.81, 144.95);

    expect(screen.getByTestId('route')).toHaveTextContent('2');
    expect(measurement('Route')).toHaveTextContent('Length 2.00 km (2 points)');
  });

  it('measures an area once it has three corners, including the closing side', async () => {
    await chooseTool('Area');
    await clickMap(-37.80, 144.90);
    await clickMap(-37.80, 144.95);
    await clickMap(-37.85, 144.95);

    expect(screen.getByTestId('area')).toHaveTextContent('3');
    expect(measurement('Area')).toHaveTextContent('Area 2.50 km²');
    // Three sides: the path plus the side back to the first corner
    expect(measurement('Area')).toHaveTextContent('Perimeter 4.00 km');
    expect(measurement('Route')).toHaveTextContent('Add at least 2 points');
  });

  it('places a 1 km circle, and moves it on later clicks', async () => {
    await chooseTool('Circle');
    expect(screen.getByText(/Click the map to place the circle/)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Undo last point'})).toBeDisabled();

    await clickMap();
    await clickMap(-37.9, 145.0);

    expect(screen.getAllByTestId('circle')).toHaveLength(1);
    expect(measurement('Circle')).toHaveTextContent('Radius 1.00 km');
  });

  it('undoes the last point of the selected tool', async () => {
    await clickMap();
    await clickMap();
    await clickMap();

    await userEvent.click(screen.getByRole('button', {name: 'Undo last point'}));

    expect(screen.getByTestId('route')).toHaveTextContent('2');
  });

  it('clears one shape without touching the others', async () => {
    await clickMap();
    await clickMap();
    await chooseTool('Circle');
    await clickMap();

    await userEvent.click(within(measurement('Route')).getByRole('button', {name: 'Clear route'}));

    expect(screen.queryByTestId('route')).not.toBeInTheDocument();
    expect(screen.getByTestId('circle')).toBeInTheDocument();
    expect(within(measurement('Route')).getByRole('button', {name: 'Clear route'})).toBeDisabled();
  });
});

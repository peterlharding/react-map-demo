import type {ReactNode} from 'react';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import AddPlacesPage from './AddPlacesPage';

// The Maps JavaScript API cannot load in jsdom. The stand-in map turns a click
// into a map click at a fixed position, and the info window renders inline.
let nextClick = {lat: -37.8, lng: 144.9};
vi.mock('@react-google-maps/api', () => ({
  useGoogleMap: () => null,
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
  InfoWindowF: ({children, options}: {children?: ReactNode; options?: {headerContent?: string}}) => (
    <div role='dialog' aria-label={options?.headerContent}>{children}</div>
  )
}));

vi.stubGlobal('google', {maps: {Size: class {}}});

const clickMapAt = async (lat: number, lng: number) => {
  nextClick = {lat, lng};
  await userEvent.click(screen.getByRole('button', {name: 'map'}));
};

const placeNames = () =>
  screen.queryAllByRole('listitem').map((item) => item.querySelector('.fw-semibold')?.textContent);

describe('AddPlacesPage', () => {
  beforeEach(() => {
    render(<AddPlacesPage />);
  });

  it('starts empty and adds a numbered place for each map click', async () => {
    expect(screen.getByText('Click the map to add your first place.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Clear all'})).toBeDisabled();

    await clickMapAt(-37.81, 144.96);
    await clickMapAt(-37.82, 144.97);

    expect(screen.getByRole('heading', {name: 'Places (2)'})).toBeInTheDocument();
    expect(placeNames()).toEqual(['Place 1', 'Place 2']);
    expect(screen.getByText('-37.810000, 144.960000')).toBeInTheDocument();
  });

  it('opens an info window for a place chosen from the list', async () => {
    await clickMapAt(-37.81, 144.96);
    await clickMapAt(-37.82, 144.97);

    await userEvent.click(screen.getByText('Place 2'));

    const info = screen.getByRole('dialog', {name: 'Place 2'});
    expect(within(info).getByText('-37.820000, 144.970000')).toBeInTheDocument();
    expect(screen.getByText('Place 2').closest('button')).toHaveAttribute('aria-current', 'true');
  });

  it('closes the info window when another map click adds a place', async () => {
    await clickMapAt(-37.81, 144.96);
    await userEvent.click(screen.getByText('Place 1'));

    await clickMapAt(-37.82, 144.97);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('removes a place from the list or from its info window', async () => {
    await clickMapAt(-37.81, 144.96);
    await clickMapAt(-37.82, 144.97);

    await userEvent.click(screen.getByRole('button', {name: 'Remove Place 1'}));
    expect(placeNames()).toEqual(['Place 2']);

    await userEvent.click(screen.getByText('Place 2'));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', {name: 'Remove'}));
    expect(placeNames()).toEqual([]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clears every place', async () => {
    await clickMapAt(-37.81, 144.96);
    await clickMapAt(-37.82, 144.97);

    await userEvent.click(screen.getByRole('button', {name: 'Clear all'}));

    expect(screen.getByText('Click the map to add your first place.')).toBeInTheDocument();
  });
});

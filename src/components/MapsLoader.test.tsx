import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import MapsLoader from './MapsLoader';

vi.mock('../config', () => ({GoogleMapsApiKey: '', GoogleMapId: 'DEMO_MAP_ID'}));

describe('MapsLoader', () => {
  it('explains how to configure a missing API key instead of loading the map', () => {
    render(<MapsLoader><p>map</p></MapsLoader>);

    expect(screen.getByText('Google Maps API key missing')).toBeInTheDocument();
    expect(screen.queryByText('map')).not.toBeInTheDocument();
  });
});

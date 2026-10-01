import {describe, expect, it} from 'vitest';

import {defaultView, parseView, sameView, viewToParams} from './mapView';

const params = (query: string) => new URLSearchParams(query);

describe('parseView', () => {
  it('reads a full view, rounding coordinates to 5 places and zoom to 2', () => {
    expect(parseView(params('lat=-37.8136123&lng=144.9631789&zoom=14.256&type=satellite'))).toEqual({
      center: {lat: -37.81361, lng: 144.96318},
      zoom: 14.26,
      mapType: 'satellite'
    });
  });

  it('uses the default view when the address has no view', () => {
    expect(parseView(params(''))).toEqual(defaultView);
  });

  it('falls back field by field for invalid values', () => {
    expect(parseView(params('lat=91&lng=144.9&zoom=abc&type=moon'))).toEqual(defaultView);
    expect(parseView(params('lat=-37.9&lng=145&zoom=&type=terrain'))).toEqual({
      center: {lat: -37.9, lng: 145},
      zoom: defaultView.zoom,
      mapType: 'terrain'
    });
  });

  it('needs both coordinates to move the centre', () => {
    expect(parseView(params('lat=-37.9')).center).toEqual(defaultView.center);
  });
});

describe('viewToParams', () => {
  it('writes every field, rounded, and reads back the same view', () => {
    const view = {center: {lat: -37.8136123, lng: 144.9631789}, zoom: 14.256, mapType: 'hybrid' as const};
    const query = viewToParams(view).toString();

    expect(query).toBe('lat=-37.81361&lng=144.96318&zoom=14.26&type=hybrid');
    expect(parseView(params(query))).toEqual({
      center: {lat: -37.81361, lng: 144.96318},
      zoom: 14.26,
      mapType: 'hybrid'
    });
    expect(sameView(parseView(params(query)), view)).toBe(true);
  });
});

describe('sameView', () => {
  it('ignores differences below the rounding', () => {
    const a = {center: {lat: -37.800001, lng: 144.9}, zoom: 13, mapType: 'roadmap' as const};
    const b = {center: {lat: -37.800004, lng: 144.9}, zoom: 13.001, mapType: 'roadmap' as const};
    expect(sameView(a, b)).toBe(true);
    expect(sameView(a, {...b, mapType: 'terrain'})).toBe(false);
  });
});

import {describe, expect, it} from 'vitest';

import {formatArea, formatDistance} from './geo';

describe('formatDistance', () => {
  it.each([
    [0, '0 m'],
    [849.6, '850 m'],
    [999.4, '999 m'],
    [999.6, '1.00 km'],
    [1000, '1.00 km'],
    [12345.678, '12.35 km'],
    [1_234_567, '1,234.57 km']
  ])('formats %d metres as %s', (metres, expected) => {
    expect(formatDistance(metres)).toBe(expected);
  });
});

describe('formatArea', () => {
  it.each([
    [0, '0 m²'],
    [8500.4, '8,500 m²'],
    [9999.6, '1.00 ha'],
    [10_000, '1.00 ha'],
    [456_789, '45.68 ha'],
    [1_000_000, '1.00 km²'],
    [3_141_592.65, '3.14 km²']
  ])('formats %d square metres as %s', (squareMetres, expected) => {
    expect(formatArea(squareMetres)).toBe(expected);
  });
});

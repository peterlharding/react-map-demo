import {describe, expect, it} from 'vitest';

import {isMarkerDragClick, recordMarkerDragEnd} from './markerDrag';

const clickAt = (timeStamp: number) => ({domEvent: {timeStamp}}) as google.maps.MapMouseEvent;

describe('markerDrag', () => {
  it('ignores nothing on a map with no marker drags', () => {
    expect(isMarkerDragClick({} as google.maps.Map, clickAt(1000))).toBe(false);
  });

  it('recognises the click created when a drag ends, but not later clicks', () => {
    const map = {} as google.maps.Map;
    recordMarkerDragEnd(map, 1000);

    expect(isMarkerDragClick(map, clickAt(1000.5))).toBe(true);
    expect(isMarkerDragClick(map, clickAt(1500))).toBe(false);
  });

  it('keeps each map separate', () => {
    const dragged = {} as google.maps.Map;
    recordMarkerDragEnd(dragged, 1000);

    expect(isMarkerDragClick({} as google.maps.Map, clickAt(1000))).toBe(false);
  });
});

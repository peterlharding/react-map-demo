// Releasing a dragged marker also sends a click to the map, which Google turns
// into a map click event about 300 ms later (after ruling out a double click).
// AdvancedMarker records when each drag ended, so MapCanvas can drop that click.

const lastDragEnd = new WeakMap<google.maps.Map, number>();

// The click's DOM event is created at the same moment as the drag end
const sameGestureMs = 100;

export const recordMarkerDragEnd = (map: google.maps.Map, timeStamp: number) => {
  lastDragEnd.set(map, timeStamp);
};

export const isMarkerDragClick = (map: google.maps.Map, event: google.maps.MapMouseEvent) => {
  const dragEnd = lastDragEnd.get(map);
  return dragEnd !== undefined && Math.abs(event.domEvent.timeStamp - dragEnd) < sameGestureMs;
};

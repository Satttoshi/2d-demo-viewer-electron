type Coordinates = {
  x: number;
  y: number;
};

/**
 * Transforms game coordinates to map coordinates
 */
export const transformCoordinates = (
  coords: Coordinates,
  mapWidth: number,
  mapHeight: number,
): Coordinates => {
  const SCALE_FACTOR = 0.39;
  const X_OFFSET = 150;
  const Y_OFFSET = -150;

  // Center offset (adjust based on map center point)
  const CENTER_X = mapWidth / 2;
  const CENTER_Y = mapHeight / 2;

  return {
    x: coords.x * SCALE_FACTOR + CENTER_X + X_OFFSET,
    y: -coords.y * SCALE_FACTOR + CENTER_Y + Y_OFFSET,
  };
};

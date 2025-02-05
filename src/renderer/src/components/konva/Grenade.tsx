import { Circle } from 'react-konva';
import { NadeState } from '../../../../types/demo-types';
import { transformCoordinates } from '../../utils/transform-coordinates';

type GrenadeProps = {
  nade: NadeState;
  mapWidth?: number;
  mapHeight?: number;
};

const GRENADE_COLORS = {
  smoke: '#ffffff',
  flashbang: '#ffff00',
  he: '#ff0000',
  incendiary_grenade: '#ff6600',
  molotov: '#ff6600',
  decoy: '#808080',
} as const;

export const Grenade = ({ nade, mapWidth = 2000, mapHeight = 2000 }: GrenadeProps) => {
  const { x, y } = transformCoordinates({ x: nade.x, y: nade.y }, mapWidth, mapHeight);

  return (
    <Circle
      x={x}
      y={y}
      radius={10}
      fill={GRENADE_COLORS[nade.grenade_type as keyof typeof GRENADE_COLORS] || '#ff00ff'}
      stroke="#000"
      strokeWidth={1}
    />
  );
};

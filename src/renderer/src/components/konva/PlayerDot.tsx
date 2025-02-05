import { Circle } from 'react-konva';
import { PlayerState } from '../../../../types/demo-types';
import { transformCoordinates } from '../../utils/transform-coordinates';

type PlayerDotProps = {
  player: PlayerState;
  isTeamA: boolean;
  mapWidth?: number;
  mapHeight?: number;
};

export const PlayerDot = ({
  player,
  isTeamA,
  mapWidth = 2000,
  mapHeight = 2000,
}: PlayerDotProps) => {
  const { x, y } = transformCoordinates({ x: player.x, y: player.y }, mapWidth, mapHeight);

  const getPlayerColor = () => {
    if (!player.is_alive) {
      return '#808080'; // Gray for dead players
    }
    return isTeamA ? '#66a0ff' : '#ff6666'; // Blue for Team A, Red for Team B
  };

  return (
    <Circle
      key={player.name}
      x={x}
      y={y}
      radius={15}
      fill={getPlayerColor()}
      stroke="#000"
      strokeWidth={2}
    />
  );
};

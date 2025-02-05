import { Circle, Text, Line } from 'react-konva';
import { PlayerState } from '../../../../types/demo-types';
import { transformCoordinates } from '../../utils/transform-coordinates';
import { useFlashOpacity } from '../../hooks/useFlashOpacity';
import { useFireAnimation } from '../../hooks/useFireAnimation';

type PlayerProps = {
  player: PlayerState;
  isTeamA: boolean;
  mapWidth?: number;
  mapHeight?: number;
};

export const Player = ({ player, isTeamA, mapWidth = 2000, mapHeight = 2000 }: PlayerProps) => {
  const { x, y } = transformCoordinates({ x: player.x, y: player.y }, mapWidth, mapHeight);

  const directionLength = 15;
  const yawRadians = (player.yaw * Math.PI) / 180;
  const directionX = x + Math.cos(yawRadians) * directionLength;
  const directionY = y - Math.sin(yawRadians) * directionLength;

  const flashOpacity = useFlashOpacity({ flash_duration: player.flash_duration });
  const { fireStartX, fireStartY, fireEndX, fireEndY, opacity } = useFireAnimation(
    player.FIRE,
    directionX,
    directionY,
    yawRadians,
  );

  const getPlayerColor = () => {
    if (!player.is_alive) {
      return '#808080';
    }
    return isTeamA ? '#66a0ff' : '#ff8a5e';
  };

  return (
    <>
      <Circle
        key={player.name}
        x={x}
        y={y}
        radius={15}
        fill={getPlayerColor()}
        stroke="#000"
        strokeWidth={2}
        opacity={player.is_alive ? 1 : 0.3}
      />
      {player.is_alive && (
        <Line points={[x, y, directionX, directionY]} stroke={'#000'} strokeWidth={3} />
      )}
      {player.is_alive && player.FIRE && (
        <Line
          points={[fireStartX, fireStartY, fireEndX, fireEndY]}
          stroke="#ff0"
          strokeWidth={2}
          opacity={opacity}
        />
      )}
      {flashOpacity > 0 && player.is_alive && (
        <Circle x={x} y={y} radius={16} fill="#ffffff" opacity={flashOpacity} />
      )}
      <Text
        x={x - 60}
        y={y - 35}
        text={player.name}
        fontSize={14}
        fill="#fff"
        opacity={player.is_alive ? 0.8 : 0.2}
        align="center"
        width={120}
      />
    </>
  );
};

import { Circle, Text, Line, Group, Shape } from 'react-konva';
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
  const { fireStartX, fireStartY, fireEndX, fireEndY, opacity, shouldShow } = useFireAnimation(
    player.active_weapon_name,
    player.FIRE,
    directionX,
    directionY,
    yawRadians,
  );

  const getPlayerColors = () => {
    if (!player.is_alive) {
      return {
        fill: '#808080',
        background: '#404040',
      };
    }
    return {
      fill: isTeamA ? '#66a0ff' : '#ff8a5e',
      background: isTeamA ? '#32467c' : '#8a4538',
    };
  };

  const radius = 15;

  // Calculate the fill height based on health percentage
  const healthPercentage = Math.max(0, Math.min(100, player.health)) / 100;
  const fillHeight = radius * 2 * healthPercentage;
  const fillStartY = y + radius - fillHeight;

  return (
    <>
      {/* Background circle with team tint */}
      <Circle
        x={x}
        y={y}
        radius={radius}
        fill={getPlayerColors().background}
        opacity={player.is_alive ? 1 : 0.3}
      />

      {/* HP Fill using custom shape */}
      <Group
        clipFunc={ctx => {
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2, false);
          ctx.closePath();
        }}
      >
        <Shape
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.rect(x - radius, fillStartY, radius * 2, fillHeight);
            context.closePath();
            context.fillStrokeShape(shape);
          }}
          fill={getPlayerColors().fill}
          opacity={player.is_alive ? 1 : 0.3}
        />
      </Group>

      {/* Foreground circle stroke */}
      <Circle
        x={x}
        y={y}
        stroke="#000"
        strokeWidth={2}
        radius={radius}
        opacity={player.is_alive ? 1 : 0.3}
      />

      {/* Aim Direction Indicator */}
      {player.is_alive && (
        <Line points={[x, y, directionX, directionY]} stroke={'#000'} strokeWidth={3} />
      )}

      {/* Fire Animation */}
      {player.is_alive && shouldShow && (
        <Line
          points={[fireStartX, fireStartY, fireEndX, fireEndY]}
          stroke="#ff0"
          strokeWidth={2}
          opacity={opacity}
        />
      )}

      {/* Flash Effect */}
      {flashOpacity > 0 && player.is_alive && (
        <Circle x={x} y={y} radius={16} fill="#ffffff" opacity={flashOpacity} />
      )}

      {/* Player Name */}
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

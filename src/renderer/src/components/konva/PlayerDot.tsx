import { Circle, Text, Line } from 'react-konva';
import { PlayerState } from '../../../../types/demo-types';
import { transformCoordinates } from '../../utils/transform-coordinates';
import { useEffect, useState } from 'react';

type PlayerProps = {
  player: PlayerState;
  isTeamA: boolean;
  mapWidth?: number;
  mapHeight?: number;
};

export const Player = ({ player, isTeamA, mapWidth = 2000, mapHeight = 2000 }: PlayerProps) => {
  const [fireAnimationProgress, setFireAnimationProgress] = useState(0);
  const { x, y } = transformCoordinates({ x: player.x, y: player.y }, mapWidth, mapHeight);

  const getPlayerColor = () => {
    if (!player.is_alive) {
      return '#808080'; // Gray for dead players
    }
    return isTeamA ? '#66a0ff' : '#ff6666'; // Blue for Team A, Red for Team B
  };

  const directionLength = 15;
  const yawRadians = (player.yaw * Math.PI) / 180;
  const directionX = x + Math.cos(yawRadians) * directionLength;
  const directionY = y - Math.sin(yawRadians) * directionLength;

  // Fire animation
  useEffect(() => {
    if (!player.FIRE) {
      setFireAnimationProgress(0);
      return;
    }

    const animate = () => {
      setFireAnimationProgress(prev => (prev + 0.1) % 1);
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [player.FIRE]);

  const fireLength = 30;
  const totalDistance = 200;

  const startOffset = totalDistance * fireAnimationProgress;
  const fireStartX = directionX + Math.cos(yawRadians) * startOffset;
  const fireStartY = directionY - Math.sin(yawRadians) * startOffset;
  const fireEndX = fireStartX + Math.cos(yawRadians) * fireLength;
  const fireEndY = fireStartY - Math.sin(yawRadians) * fireLength;

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
      />
      {player.is_alive && (
        <Line points={[x, y, directionX, directionY]} stroke={'#000'} strokeWidth={3} />
      )}
      {player.is_alive && player.FIRE && (
        <Line
          points={[fireStartX, fireStartY, fireEndX, fireEndY]}
          stroke="#ff0"
          strokeWidth={2}
          opacity={1 - fireAnimationProgress}
        />
      )}
      <Text
        x={x - 60}
        y={y - 35}
        text={player.name}
        fontSize={14}
        fill="#fff"
        opacity={0.8}
        align="center"
        width={120}
      />
    </>
  );
};

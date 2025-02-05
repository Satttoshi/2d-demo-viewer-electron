import { useState, useEffect } from 'react';

type FireAnimationResult = {
  fireStartX: number;
  fireStartY: number;
  fireEndX: number;
  fireEndY: number;
  opacity: number;
};

export const useFireAnimation = (
  isFiring: boolean,
  directionX: number,
  directionY: number,
  yawRadians: number,
): FireAnimationResult => {
  const [fireAnimationProgress, setFireAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isFiring) {
      setFireAnimationProgress(0);
      return;
    }

    const animate = () => {
      setFireAnimationProgress(prev => (prev + 0.1) % 1);
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [isFiring]);

  const fireLength = 30;
  const totalDistance = 200;

  const startOffset = totalDistance * fireAnimationProgress;
  const fireStartX = directionX + Math.cos(yawRadians) * startOffset;
  const fireStartY = directionY - Math.sin(yawRadians) * startOffset;
  const fireEndX = fireStartX + Math.cos(yawRadians) * fireLength;
  const fireEndY = fireStartY - Math.sin(yawRadians) * fireLength;

  return {
    fireStartX,
    fireStartY,
    fireEndX,
    fireEndY,
    opacity: 1 - fireAnimationProgress,
  };
};

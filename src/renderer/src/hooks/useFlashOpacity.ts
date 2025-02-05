import { useState, useEffect, useRef } from 'react';

type UseFlashOpacityProps = {
  flash_duration?: number;
  maxFlashDuration?: number;
};

export const useFlashOpacity = ({
  flash_duration,
  maxFlashDuration = 5.0,
}: UseFlashOpacityProps) => {
  const [opacity, setOpacity] = useState(0);
  const flashStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (flash_duration) {
      const initialOpacity = Math.min(flash_duration / maxFlashDuration, 1);
      setOpacity(initialOpacity);
      flashStartTimeRef.current = Date.now();

      const fadeInterval = setInterval(() => {
        const elapsedTime = (Date.now() - flashStartTimeRef.current!) / 1000;
        const remainingDuration = flash_duration - elapsedTime;

        if (remainingDuration <= 0) {
          setOpacity(0);
          clearInterval(fadeInterval);
        } else {
          setOpacity(remainingDuration / maxFlashDuration);
        }
      }, 16);

      return () => clearInterval(fadeInterval);
    }

    setOpacity(0);
    flashStartTimeRef.current = null;
    return () => {};
  }, [flash_duration, maxFlashDuration]);

  return opacity;
};

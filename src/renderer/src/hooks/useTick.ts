import { useState, useEffect } from 'react';

type TickConfig = {
  /** Starting tick index */
  initialTick?: number;
  /** Maximum tick index */
  maxTick: number;
  /** Playback speed multiplier */
  speed?: number;
  /** Function called on each tick update */
  onTick?: (tick: number) => void;
};

type TickControls = {
  /** Current tick index */
  currentTick: number;
  /** Whether playback is active */
  isPlaying: boolean;
  /** Set current tick directly */
  setTick: (tick: number) => void;
  /** Start playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Toggle between play/pause */
  toggle: () => void;
  /** Go to next tick */
  next: () => void;
  /** Go to previous tick */
  prev: () => void;
  /** Reset to initial tick */
  reset: () => void;
  /** Set playback speed */
  setSpeed: (speed: number) => void;
};

/**
 * Hook for managing tick-based playback state and controls
 *
 * @example
 * const {
 *   currentTick,
 *   isPlaying,
 *   play,
 *   pause,
 *   setTick
 * } = useTick({
 *   maxTick: 1000,
 *   initialTick: 0,
 *   speed: 1,
 *   onTick: (tick) => console.log(`Tick: ${tick}`)
 * });
 */
export const useTick = ({
  initialTick = 0,
  maxTick,
  speed = 1,
  onTick,
}: TickConfig): TickControls => {
  const [currentTick, setCurrentTick] = useState(initialTick);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(speed);

  // Handle tick advancement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(
      () => {
        setCurrentTick(prev => {
          const next = prev + 1;
          if (next > maxTick) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      },
      1000 / (60 * playbackSpeed),
    ); // 60fps base rate * speed multiplier

    return () => clearInterval(interval);
  }, [isPlaying, maxTick, playbackSpeed]);

  // Call onTick callback when tick changes
  useEffect(() => {
    onTick?.(currentTick);
  }, [currentTick, onTick]);

  const setTick = (tick: number) => {
    const newTick = Math.max(0, Math.min(tick, maxTick));
    setCurrentTick(newTick);
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const toggle = () => setIsPlaying(prev => !prev);

  const next = () => setTick(currentTick + 1);
  const prev = () => setTick(currentTick - 1);
  const reset = () => setTick(initialTick);
  const setSpeed = (newSpeed: number) => setPlaybackSpeed(newSpeed);

  return {
    currentTick,
    isPlaying,
    setTick,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    setSpeed,
  };
};

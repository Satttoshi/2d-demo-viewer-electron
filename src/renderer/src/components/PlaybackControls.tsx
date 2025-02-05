import { TickState } from '../../../types/demo-types';

type PlaybackControlsProps = {
  currentTickData: TickState | null;
  currentTickIndex: number;
  maxTicks: number;
  isPlaying: boolean;
  onTickChange: (tick: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  className?: string;
};

export const PlaybackControls = ({
  currentTickData,
  currentTickIndex,
  maxTicks,
  isPlaying,
  onTickChange,
  onTogglePlay,
  onSpeedChange,
  className = '',
}: PlaybackControlsProps) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button onClick={onTogglePlay} className="px-4 py-2 bg-blue-500 text-white rounded">
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <input
        type="range"
        min={0}
        max={maxTicks}
        value={currentTickIndex}
        onChange={e => onTickChange(Number(e.target.value))}
        className="w-64"
      />

      <select
        defaultValue={1}
        onChange={e => onSpeedChange(Number(e.target.value))}
        className="p-2 border rounded"
      >
        <option value={0.5}>0.5x</option>
        <option value={1}>1x</option>
        <option value={2}>2x</option>
        <option value={4}>4x</option>
      </select>

      <span className="text-sm text-gray-700">Tick: {currentTickData?.tick ?? 0}</span>
    </div>
  );
};

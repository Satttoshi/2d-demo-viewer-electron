import { Stage, Layer } from 'react-konva';
import { KonvaImage } from './konva/KonvaImage';
import { useStageZoom } from '../hooks/useStageZoom';
import demoData from '../mocks/parsed_demo.json';
import { useTick } from '../hooks/useTick';
import { PlaybackControls } from './PlaybackControls';
import { PlayerDot } from './konva/PlayerDot';

export const DemoStage = () => {
  const { stageProps } = useStageZoom({
    minScale: 0.2,
    maxScale: 4,
    zoomSpeed: 1.1,
  });

  const {
    currentTick: currentTickIndex,
    isPlaying,
    setTick,
    toggle,
    setSpeed,
  } = useTick({
    maxTick: demoData.length - 1,
    speed: 2,
  });

  const currentTickData = demoData[currentTickIndex];

  return (
    <>
      <Stage width={2000} height={2000} {...stageProps}>
        <Layer>
          <KonvaImage src="./src/assets/maps/ancient.jpg" width={2000} height={2000} />

          {currentTickData?.teamA.map(player => (
            <PlayerDot key={player.name} player={player} isTeamA={true} />
          ))}
          {currentTickData?.teamB.map(player => (
            <PlayerDot key={player.name} player={player} isTeamA={false} />
          ))}
        </Layer>
      </Stage>
      <PlaybackControls
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        currentTickData={currentTickData}
        currentTickIndex={currentTickIndex}
        maxTicks={demoData.length - 1}
        isPlaying={isPlaying}
        onTickChange={setTick}
        onTogglePlay={toggle}
        onSpeedChange={setSpeed}
      />
    </>
  );
};

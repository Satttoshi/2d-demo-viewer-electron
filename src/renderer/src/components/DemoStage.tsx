import { Stage, Layer, Rect, Circle } from 'react-konva';
import { KonvaImage } from './konva/KonvaImage';
import { useStageZoom } from '../hooks/useStageZoom';

export const DemoStage = () => {
  const { stageProps } = useStageZoom({
    minScale: 0.2,
    maxScale: 4,
    zoomSpeed: 1.1,
  });

  return (
    <Stage width={2000} height={2000} {...stageProps}>
      <Layer>
        <KonvaImage src="./src/assets/maps/ancient.jpg" scale={{ x: 0.5, y: 0.5 }} />
        <Rect width={50} height={50} fill="red" />
        <Circle x={200} y={200} stroke="black" radius={50} />
      </Layer>
    </Stage>
  );
};

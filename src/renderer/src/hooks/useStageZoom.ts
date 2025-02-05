import { useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';

type ZoomConfig = {
  minScale?: number;
  maxScale?: number;
  zoomSpeed?: number;
};

type StagePosition = {
  x: number;
  y: number;
};

type ZoomState = {
  scale: number;
  position: StagePosition;
  stageProps: {
    scale: { x: number; y: number };
    x: number;
    y: number;
    onWheel: (e: KonvaEventObject<WheelEvent>) => void;
    draggable: boolean;
    onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  };
};

/**
 * A hook that provides zoom and pan functionality for a Konva Stage.
 *
 * @param config - Configuration options for the zoom behavior
 * @param config.minScale - Minimum zoom scale (default: 0.1)
 * @param config.maxScale - Maximum zoom scale (default: 5)
 * @param config.zoomSpeed - Factor by which to zoom in/out (default: 1.1)
 *
 * @returns An object containing the current scale, position, and props for the Stage component
 *
 * @example
 * // Basic usage
 * const MyStage = () => {
 *   const { stageProps } = useStageZoom();
 *   return (
 *     <Stage {...stageProps} width={800} height={600}>
 *       <Layer>
 *         <Rect width={50} height={50} fill="red" />
 *       </Layer>
 *     </Stage>
 *   );
 * };
 */
export const useStageZoom = ({
  minScale = 0.1,
  maxScale = 5,
  zoomSpeed = 1.1,
}: ZoomConfig = {}): ZoomState => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * zoomSpeed : oldScale / zoomSpeed;

    if (newScale < minScale || newScale > maxScale) return;

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return {
    scale,
    position,
    stageProps: {
      scale: { x: scale, y: scale },
      x: position.x,
      y: position.y,
      onWheel: handleWheel,
      draggable: true,
      onDragEnd: handleDragEnd,
    },
  };
};

import { useEffect, useState } from 'react';
import { Image } from 'react-konva';

type KonvaImageProps = {
  src: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  scale?: {
    x: number;
    y: number;
  };
};

export const KonvaImage = ({
  src,
  width = 2000,
  height = 2000,
  x = 0,
  y = 0,
  scale = { x: 1, y: 1 },
}: KonvaImageProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  useEffect(() => {
    const imageElement = new window.Image();

    imageElement.onload = () => {
      setImage(imageElement);

      // Calculate dimensions to maintain aspect ratio if not explicitly provided
      if (!width || !height) {
        const aspectRatio = imageElement.width / imageElement.height;
        const calculatedWidth = width || height * aspectRatio;
        const calculatedHeight = height || width / aspectRatio;

        setDimensions({
          width: calculatedWidth,
          height: calculatedHeight,
        });
      }
    };

    imageElement.onerror = e => {
      console.error('Error loading image:', e);
    };

    imageElement.src = src;

    // Cleanup
    return () => {
      imageElement.onload = null;
      imageElement.onerror = null;
    };
  }, [src, width, height]);

  if (!image) {
    return null;
  }

  return (
    <Image
      image={image}
      width={dimensions.width}
      height={dimensions.height}
      x={x}
      y={y}
      scale={scale}
    />
  );
};

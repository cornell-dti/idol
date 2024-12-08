import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import useScreenSize from '../../src/hooks/useScreenSize';
import {
  TABLET_BREAKPOINT,
  MOBILE_BREAKPOINT,
  LAPTOP_BREAKPOINT,
  LARGE_LAPTOP_BREAKPOINT,
  MONITOR_BREAKPOINT
} from '../../src/consts';

interface Dimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface BreakpointDimensions {
  MOBILE_BREAKPOINT?: Dimensions;
  TABLET_BREAKPOINT?: Dimensions;
  LAPTOP_BREAKPOINT?: Dimensions;
  LARGE_LAPTOP_BREAKPOINT?: Dimensions;
  MONITOR_BREAKPOINT?: Dimensions;
  FINAL_BREAKPOINT?: Dimensions;
}

interface ImageConfig {
  id: string;
  src: string;
  breakpointDimensions: BreakpointDimensions;
  delay?: number;
}

interface NodeProps {
  mainIcon: string;
  title?: string;
  description?: string[];
  images: ImageConfig[];
  dragLimit: number;
  activeIcon: boolean;
  position: boolean;
}

export default function Node({
  mainIcon,
  title,
  description,
  images,
  dragLimit,
  activeIcon,
  position
}: NodeProps) {
  const { width } = useScreenSize();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initialImagePositions = useRef<{ [id: string]: { x: number; y: number } }>({});
  const [imagePositions, setImagePositions] = useState<{ [id: string]: { x: number; y: number } }>(
    {}
  );
  const [imageDimensions, setImageDimensions] = useState<{
    [id: string]: { width: number; height: number };
  }>({});
  const [floatingOffsets, setFloatingOffsets] = useState<{ [id: string]: number }>(
    images.reduce((acc, image) => ({ ...acc, [image.id]: 0 }), {})
  );
  const [floatingDirections, setFloatingDirections] = useState<{ [id: string]: number }>(
    images.reduce((acc, image) => ({ ...acc, [image.id]: 1 }), {})
  );

  const [isDragging, setIsDragging] = useState<{ target: string | null }>({ target: null });

  const calculateCenter = (
    position: { x: number; y: number },
    dimensions: { width: number; height: number }
  ) => ({
    x: position.x + dimensions.width / 2,
    y: position.y + dimensions.height / 2
  });

  const interpolate = (start: number, end: number, progress: number) => {
    return start + (end - start) * progress;
  };

  const animateReturn = (
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number },
    duration: number,
    updatePosition: (position: { x: number; y: number }) => void
  ) => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newPosition = {
        x: interpolate(startPosition.x, endPosition.x, progress),
        y: interpolate(startPosition.y, endPosition.y, progress)
      };

      updatePosition(newPosition);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const updateCanvasSize = () => {
    if (containerRef.current && canvasRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const canvas = canvasRef.current;

      canvas.width = containerRect.width;
      canvas.height = containerRect.height;

      updateCanvas();
    }
  };

  const updateCanvas = () => {
    if (containerRef.current && canvasRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const iconRect = iconRef.current?.getBoundingClientRect();
        const iconCenter = iconRect
          ? {
              x: iconRect.left + iconRect.width / 2 - containerRect.left,
              y: iconRect.top + iconRect.height / 2 - containerRect.top
            }
          : { x: 0, y: 0 };

        images.forEach((image) => {
          const position = imagePositions[image.id];
          const dimensions = imageDimensions[image.id];

          if (!position || !dimensions) {
            return;
          }

          if (position && dimensions) {
            const imageCenter = calculateCenter(
              { x: position.x, y: position.y + (floatingOffsets[image.id] || 0) },
              dimensions
            );

            ctx.beginPath();
            ctx.moveTo(iconCenter.x, iconCenter.y);
            ctx.lineTo(imageCenter.x, imageCenter.y);
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 5;
            ctx.stroke();
          }
        });
      }
    }
  };

  const handleMouseDown = (target: string) => {
    setIsDragging({ target });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.target) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const currentDimensions = imageDimensions[isDragging.target];
    if (!currentDimensions) return;

    let newX = e.clientX - containerRect.left - currentDimensions.width / 2;
    let newY = e.clientY - containerRect.top - currentDimensions.height / 2;

    newX = Math.max(0, Math.min(newX, dragLimit - currentDimensions.width));
    newY = Math.max(0, Math.min(newY, dragLimit - currentDimensions.height));

    setImagePositions((prev) => ({
      ...prev,
      [isDragging.target!]: { x: newX, y: newY }
    }));
  };

  const handleMouseUp = () => {
    if (isDragging.target) {
      const targetId = isDragging.target;
      const startPosition = imagePositions[targetId];
      const endPosition = initialImagePositions.current[targetId];

      if (startPosition && endPosition) {
        animateReturn(startPosition, { x: endPosition.x, y: endPosition.y }, 300, (newPosition) => {
          setImagePositions((prev) => ({
            ...prev,
            [targetId]: newPosition
          }));
        });
      }
    }
    setIsDragging({ target: null });
  };

  const handleResize = () => {
    const newPositions: { [id: string]: { x: number; y: number } } = {};
    const newDimensions: { [id: string]: { width: number; height: number } } = {};

    images.forEach((image) => {
      const breakpointDimensions = image.breakpointDimensions;
      const newWidth = width - 5;

      let dimensions: Dimensions | undefined;
      if (newWidth > MONITOR_BREAKPOINT && breakpointDimensions.FINAL_BREAKPOINT) {
        dimensions = breakpointDimensions.FINAL_BREAKPOINT;
      } else if (newWidth > LARGE_LAPTOP_BREAKPOINT && breakpointDimensions.MONITOR_BREAKPOINT) {
        dimensions = breakpointDimensions.MONITOR_BREAKPOINT;
      } else if (newWidth > LAPTOP_BREAKPOINT && breakpointDimensions.LARGE_LAPTOP_BREAKPOINT) {
        dimensions = breakpointDimensions.LARGE_LAPTOP_BREAKPOINT;
      } else if (newWidth > TABLET_BREAKPOINT && breakpointDimensions.LAPTOP_BREAKPOINT) {
        dimensions = breakpointDimensions.LAPTOP_BREAKPOINT;
      } else if (newWidth > MOBILE_BREAKPOINT && breakpointDimensions.TABLET_BREAKPOINT) {
        dimensions = breakpointDimensions.TABLET_BREAKPOINT;
      } else if (breakpointDimensions.MOBILE_BREAKPOINT) {
        dimensions = breakpointDimensions.MOBILE_BREAKPOINT;
      }

      if (dimensions) {
        newDimensions[image.id] = { width: dimensions.width, height: dimensions.height };
        newPositions[image.id] = { x: dimensions.x, y: dimensions.y };
      }
    });

    setImageDimensions(newDimensions);
    setImagePositions(newPositions);
    initialImagePositions.current = newPositions;
  };

  useEffect(() => {
    handleResize();
    updateCanvasSize();
  }, [width]);

  useEffect(() => {
    updateCanvas();
  }, [imagePositions, floatingOffsets]);

  useEffect(() => {
    const intervals: { [id: string]: NodeJS.Timeout } = {};

    images.forEach((image) => {
      const speed = image.delay || 50;

      intervals[image.id] = setInterval(() => {
        setFloatingOffsets((prevOffsets) => {
          const newOffset = prevOffsets[image.id] + floatingDirections[image.id];
          return {
            ...prevOffsets,
            [image.id]:
              newOffset >= 10
                ? (setFloatingDirections((prev) => ({ ...prev, [image.id]: -1 })), 10)
                : newOffset <= -10
                ? (setFloatingDirections((prev) => ({ ...prev, [image.id]: 1 })), -10)
                : newOffset
          };
        });
      }, speed);
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [images, floatingDirections]);

  return (
    <div
      ref={containerRef}
      className={` ${
        position ? '' : 'flex items-center'
      } relative w-[80vw] sm:w-[55vw] md:w-[50vw] lg:w-[52vw] xl:w-[50vw] h-[300px] md:h-[325px] lg:h-[400px] xl:h-[525px] 2xl:h-[675px]`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Canvas for Drawing Lines */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-10 pointer-events-none w-full h-full"
      />
      {/* Main Anchor Component */}
      <div className="ml-[7%] inline-flex space-x-10 tracking-normal lg:tracking-widest relative h-auto w-full text-white">
        <div className="relative z-20">
          <div
            ref={iconRef}
            className={`${
              activeIcon ? 'opacity-100' : 'opacity-50'
            } h-auto w-16 md:w-20 lg:w-24 xl:w-28 2xl:w-32`}
          >
            <Image src={mainIcon} alt="Main Icon" width={150} height={150} />
          </div>
        </div>
        <div className={` ${position ? 'lg:flex-row lg:space-x-5' : 'space-y-3'} flex flex-col`}>
          <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold tracking-widest">
            {title}
          </div>
          <div className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl mt-0.5 lg:mt-0 w-auto">
            {description?.map((line, index) => <div key={index}>{line}</div>)}
          </div>
        </div>
      </div>
      {/* Dynamically Render Images */}
      {images.map((image) => {
        const position = imagePositions[image.id];
        const dimensions = imageDimensions[image.id];
        if (!position || !dimensions) {
          return null;
        }
        return position && dimensions ? (
          <div
            key={image.id}
            className="absolute cursor-grab w-full h-auto z-20"
            style={{
              top: position.y + (floatingOffsets[image.id] || 0),
              left: position.x,
              width: dimensions.width,
              height: dimensions.height
            }}
            onMouseDown={() => handleMouseDown(image.id)}
            onDragStart={(e) => e.preventDefault()}
          >
            <Image
              src={image.src}
              alt={image.id}
              width={dimensions.width}
              height={dimensions.height}
            />
          </div>
        ) : null;
      })}
    </div>
  );
}

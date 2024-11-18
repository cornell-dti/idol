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

// * Images
import image1 from '/public/images/home/image1.png';
import image2 from '/public/images/home/image2.png';

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
}

interface ImageConfig {
  id: string;
  src: string;
  width: number;
  height: number;
  breakpointDimensions: BreakpointDimensions;
  float: boolean;
}

interface NodeProps {
  mainIcon: string;
  title?: string;
  description?: string[];
  images?: ImageConfig[];
}

/**
 * The node component is simply a network with a main/anchor icon,
 * title, description, and draggable images connected by animated lines.
 *
 * @remarks
 * This component is designed for a responsive layout that dynamically adjusts
 * to different screen sizes and breakpoints. It provides features like the floating
 * animations, dragging functionaolity for images, and a canvas for drawing these
 * connecting lines. The component is ideal for network like components with an anchor.
 * It is also just relatively positioned more for absolute purposes.
 *
 * @param props - Contains:
 *   - `mainIcon`: The path to the main/anchor icon image displayed at the center of the node.
 *   - `title`: The title displayed next to the main icon.
 *   - `description`: An array of strings representing a detailed description for the node.
 *   - `images`: An array of image configurations that include:
 *     - `id`: A unique identifier for the image.
 *     - `src`: The source path of the image.
 *     - `width`: The width of the image.
 *     - `height`: The height of the image.
 *     - `breakpointDimensions`: An object specifying dimensions and positions
 *       for each breakpoint.
 *     - `float`: A boolean indicating if the image should have a floating animation.
 */
export default function Node({ mainIcon, title, description, images }: NodeProps) {
  const { width } = useScreenSize();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // TODO: Adjust for more than two images (IMAGE array maybe)
  const [image1Position, setImage1Position] = useState({ x: 0, y: 200 });
  const [image2Position, setImage2Position] = useState({ x: 200, y: 300 });
  const [image1Dimensions, setImage1Dimensions] = useState({ width: 150, height: 150 });
  const [image2Dimensions, setImage2Dimensions] = useState({ width: 200, height: 200 });

  const [floatingOffset, setFloatingOffset] = useState(0);

  // ? 1 for up, -1 for down
  // TODO: Add to global
  const [floatingDirection, setFloatingDirection] = useState(1);

  const [isDragging, setIsDragging] = useState<{ target: 'image1' | 'image2' | null }>({
    target: null
  });

  const [isReturning, setIsReturning] = useState(false);

  // * Controls the overall dragging boundary (maximum for X and Y positions)
  const dragLimit = 600;

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
      } else {
        setIsReturning(false);
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

        // ? Find the mainIcon's center
        const iconRect = iconRef.current?.getBoundingClientRect();
        const iconCenter = iconRect
          ? {
              x: iconRect.left + iconRect.width / 2 - containerRect.left,
              y: iconRect.top + iconRect.height / 2 - containerRect.top
            }
          : { x: 0, y: 0 };

        // ? Image2 center
        const image2Center = calculateCenter(
          { x: image2Position.x, y: image2Position.y + floatingOffset },
          image2Dimensions
        );

        // ? Drawe line 2
        ctx.beginPath();
        ctx.moveTo(iconCenter.x, iconCenter.y);
        ctx.lineTo(image2Center.x, image2Center.y);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (width > MOBILE_BREAKPOINT) {
          const image1Center = calculateCenter(
            { x: image1Position.x, y: image1Position.y + floatingOffset },
            image1Dimensions
          );

          // ? Draw the first line only if it's within my breakpoint
          ctx.beginPath();
          ctx.moveTo(iconCenter.x, iconCenter.y);
          ctx.lineTo(image1Center.x, image1Center.y);
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
  };

  // ? Controls for the Floating Animation
  // TODO: Add this to the Global Floating
  // TODO: Add the delay as well for random movement
  useEffect(() => {
    // Smooth floating animation
    const floatingAnimation = () => {
      setFloatingOffset((prevOffset) => {
        if (prevOffset >= 10) setFloatingDirection(-1);
        else if (prevOffset <= -10) setFloatingDirection(1);
        return prevOffset + floatingDirection;
      });
    };

    // ? this controls the speed of the= animation
    const interval = setInterval(floatingAnimation, 50);
    return () => clearInterval(interval);
  }, [floatingDirection]);

  useEffect(() => {
    updateCanvas();
  }, [floatingOffset, image1Position, image2Position, image1Dimensions, image2Dimensions]);

  // TODO: Apply using layout instead of useEffect
  useEffect(() => {
    // * Dynamically update for each of the Breakpoints
    if (width <= MOBILE_BREAKPOINT) {
      // * Mobile
      setImage2Dimensions({ width: 100, height: 100 });
      setImage2Position({ x: 30, y: 175 });
    } else if (width <= TABLET_BREAKPOINT) {
      // * Tablet
      setImage1Dimensions({ width: 80, height: 80 });
      setImage2Dimensions({ width: 100, height: 100 });
      setImage1Position({ x: 0, y: 120 });
      setImage2Position({ x: 90, y: 175 });
    } else if (width <= LAPTOP_BREAKPOINT) {
      // * Laptop
      setImage1Dimensions({ width: 100, height: 100 });
      setImage2Dimensions({ width: 120, height: 120 });
      setImage1Position({ x: 0, y: 150 });
      setImage2Position({ x: 110, y: 190 });
    } else if (width <= LARGE_LAPTOP_BREAKPOINT) {
      // * Large Laptops
      setImage1Dimensions({ width: 100, height: 100 });
      setImage2Dimensions({ width: 150, height: 150 });
      setImage1Position({ x: 0, y: 150 });
      setImage2Position({ x: 125, y: 225 });
    } else if (width <= MONITOR_BREAKPOINT) {
      // * Monitor sized tech stuff
      setImage1Dimensions({ width: 170, height: 170 });
      setImage2Dimensions({ width: 200, height: 200 });
      setImage1Position({ x: 0, y: 200 });
      setImage2Position({ x: 200, y: 280 });
    } else {
      // * Anything else above a monitor
      setImage1Dimensions({ width: 170, height: 170 });
      setImage2Dimensions({ width: 225, height: 225 });
      setImage1Position({ x: 0, y: 200 });
      setImage2Position({ x: 250, y: 350 });
    }

    updateCanvasSize();
  }, [width]);

  const handleMouseDown = (target: 'image1' | 'image2') => {
    setIsDragging({ target });
    setIsReturning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.target) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const currentImageDimensions =
      isDragging.target === 'image1' ? image1Dimensions : image2Dimensions;

    // * New X and Y positions
    let newX = e.clientX - containerRect.left - currentImageDimensions.width / 2;
    let newY = e.clientY - containerRect.top - currentImageDimensions.height / 2;

    // * This is to apply drag limits
    newX = Math.max(0, Math.min(newX, dragLimit - currentImageDimensions.width));
    newY = Math.max(0, Math.min(newY, dragLimit - currentImageDimensions.height));

    if (isDragging.target === 'image1') {
      setImage1Position({ x: newX, y: newY });
    } else if (isDragging.target === 'image2') {
      setImage2Position({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging.target) {
      setIsReturning(true);

      if (isDragging.target === 'image1') {
        animateReturn(image1Position, { x: 0, y: 200 }, 300, setImage1Position);
      } else if (isDragging.target === 'image2') {
        animateReturn(image2Position, { x: 200, y: 300 }, 300, setImage2Position);
      }
    }

    setIsDragging({ target: null });
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className="relative max-w-4xl h-[300px] md:h-[325px] lg:h-[400px] xl:h-[525px] 2xl:h-[600px]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Canvas for Drawing Lines */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-10 pointer-events-none w-full h-full"
      />
      {/* This is Achor/Main Component */}
      <div className="ml-[7%] inline-flex items-center space-x-10 lg:space-x-5 tracking-normal lg:tracking-widest relative h-auto w-full text-white">
        <div ref={iconRef}>
          <div className="h-auto w-16 md:w-20 lg:w-24 xl:w-28 2xl:w-32">
            <Image src={mainIcon} alt="Design Icon" width={150} height={150} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-5">
          <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold tracking-widest">
            {title}
          </div>
          <p className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl mt-0.5 lg:mt-0">
            Harnessing human-centered <br /> design to solve problems with <br /> empathy and
            creativity.{' '}
          </p>
        </div>
      </div>
      {/* Image 1 */}
      {width > MOBILE_BREAKPOINT && (
        <div
          className="absolute w-full h-auto"
          style={{
            top: image1Position.y + floatingOffset,
            left: image1Position.x,
            width: image1Dimensions.width,
            height: image1Dimensions.height,
            cursor: 'grab'
          }}
          onMouseDown={() => handleMouseDown('image1')}
          onDragStart={handleDragStart}
        >
          <Image
            src={image1}
            alt="image1"
            width={image1Dimensions.width}
            height={image1Dimensions.height}
          />
        </div>
      )}
      {/* Image 2 */}
      <div
        className="absolute w-full h-auto"
        style={{
          top: image2Position.y + floatingOffset,
          left: image2Position.x,
          width: image2Dimensions.width,
          height: image2Dimensions.height,
          cursor: 'grab'
        }}
        onMouseDown={() => handleMouseDown('image2')}
        onDragStart={handleDragStart}
      >
        <Image
          src={image2}
          alt="image2"
          width={image2Dimensions.width}
          height={image2Dimensions.height}
        />
      </div>
    </div>
  );
}

'use client';

import React, { useRef } from 'react';
import useScrollPosition from '../../src/hooks/useScrollPosition';
import { cn } from '../../lib/utils';
import useMediaReduce from '../../src/hooks/useMediaReduce';

type ConnectorProps = {
  orientation: 'left' | 'right';
  width: number;
  height: number;
  strokeWidth: number;
  className?: string;
  text?: string;
};

const Connector: React.FC<ConnectorProps> = (props: ConnectorProps) => {
  const [reduceMotion, isReady] = useMediaReduce();
  const connectorRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScrollPosition();

  const getOffset = () => {
    if (connectorRef.current != null) {
      return Math.min(
        props.height,
        Math.max(0, scrollY - connectorRef.current.offsetTop + props.height)
      );
    }
    return 0;
  };

  return (
    <div
      ref={connectorRef}
      className={cn(
        'lg:flex flex-row text-white relative flex-shrink w-full justify-center hidden',
        props.className
      )}
    >
      <div className="relative">
        <svg
          width={props.width}
          height={props.height}
          viewBox={`0 0 ${props.width} ${props.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={
              props.orientation === 'left'
                ? `M${props.strokeWidth / 2} 0 V${props.height / 2 - props.strokeWidth} H${
                    props.width - props.strokeWidth / 2
                  } V${props.height}`
                : `M${props.width - props.strokeWidth / 2} 0 V${
                    props.height / 2 - props.strokeWidth / 2
                  } H${props.strokeWidth / 2} V${props.height}`
            }
            stroke="#FEFEFE"
            strokeOpacity="0.2"
            strokeWidth="6"
            strokeLinecap="square"
          />
        </svg>
        {props.orientation === 'left' ? (
          <div className="flex absolute top-[35%] left-[3%] text-3xl tracking-wider w-full h-auto">
            {props.text}
          </div>
        ) : (
          <div className="flex absolute top-[35%] -right-2/3 text-3xl tracking-wider w-full h-auto">
            {props.text}
          </div>
        )}
      </div>

      <svg
        className={`absolute top-0 left-50%`}
        width={props.width}
        height={props.height}
        viewBox={`0 0 ${props.width} ${props.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={
            props.orientation === 'left'
              ? `M${props.strokeWidth / 2} 0 V${props.height / 2 - props.strokeWidth} H${
                  props.width - props.strokeWidth / 2
                } V${props.height}`
              : `M${props.width - props.strokeWidth / 2} 0 V${
                  props.height / 2 - props.strokeWidth / 2
                } H${props.strokeWidth / 2} V${props.height}`
          }
          stroke="#FEFEFE"
          strokeWidth={props.strokeWidth}
          strokeLinecap="square"
          strokeDasharray={`${props.width + props.height} ${props.width + props.height}`}
          strokeDashoffset={
            reduceMotion
              ? 0
              : props.width +
                props.height -
                (getOffset() / props.height) * (props.width + props.height)
          }
        />
      </svg>
    </div>
  );
};

export default Connector;

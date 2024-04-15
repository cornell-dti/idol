'use client';

import React, { useRef } from 'react';
import useScrollPosition from '../../src/hooks/useScrollPosition';

type ConnectorProps = {
  orientation: 'left' | 'right';
  width: number;
  height: number;
  strokeWidth: number;
};

type NodeProps = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const Connector: React.FC<ConnectorProps> = (props: ConnectorProps) => {
  const connectorRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScrollPosition();

  const getOffset = () => {
    if (connectorRef.current != null) {
      return Math.min(
        props.height,
        Math.max(0, scrollY - connectorRef.current.offsetTop + props.height / 2)
      );
    }
    return 0;
  };

  return (
    <div
      ref={connectorRef}
      className="lg:flex flex-row relative flex-shrink w-full justify-center px-10 sm:hidden"
    >
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
      <svg
        className={`absolute top-0 left-50% object-cover h-[${scrollY}px]`}
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
            props.width + props.height - (getOffset() / props.height) * (props.width + props.height)
          }
        />
      </svg>
    </div>
  );
};

const NodeLine = (props: NodeProps) => {};

export { Connector, NodeLine };

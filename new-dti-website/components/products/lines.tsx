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

  const handleClick = () => {
    if (connectorRef.current != null) {
      console.log(connectorRef.current.offsetTop);
    }
  };

  const getOffset = () => {
    if (connectorRef.current != null) {
      return connectorRef.current.offsetTop;
    }
    return 0;
  };

  return (
    <div
      ref={connectorRef}
      onClick={handleClick}
      className="flex flex-row flex-shrink w-full justify-center px-10"
    >
      {props.orientation === 'left' ? (
        <svg
          width={props.width}
          height={props.height}
          viewBox={`0 0 ${props.width} ${props.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M${props.strokeWidth / 2} 0 V${props.height / 2 - props.strokeWidth} H${
              props.width - props.strokeWidth / 2
            } V${props.height}`}
            stroke="#FEFEFE"
            strokeOpacity="0.2"
            strokeWidth="6"
            strokeLinecap="square"
          />
          <path
            d={`M${props.strokeWidth / 2} 0 V${props.height / 2 - props.strokeWidth} H${
              props.width - props.strokeWidth / 2
            } V${props.height}`}
            stroke="#FEFEFE"
            strokeWidth={props.strokeWidth}
            strokeLinecap="square"
            strokeDasharray={`${props.width + props.height} ${props.width + props.height}`}
            strokeDashoffset={
              props.width +
              props.height -
              (scrollY + window.innerHeight / 2 + 400 - getOffset() > 0
                ? scrollY + window.innerHeight / 2 + 400 - getOffset()
                : 0)
            }
          />
        </svg>
      ) : (
        <svg
          width={props.width}
          height={props.height}
          viewBox={`0 0 ${props.width} ${props.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M${props.width - props.strokeWidth / 2} 0 V${
              props.height / 2 - props.strokeWidth / 2
            } H${props.strokeWidth / 2} V${props.height}`}
            stroke="#FEFEFE"
            strokeOpacity="0.2"
            strokeWidth={props.strokeWidth}
            strokeLinecap="square"
          />
          <path
            d={`M${props.width - props.strokeWidth / 2} 0 V${
              props.height / 2 - props.strokeWidth / 2
            } H${props.strokeWidth / 2} V${props.height}`}
            stroke="#FEFEFE"
            strokeWidth={props.strokeWidth}
            strokeLinecap="square"
            strokeDasharray={`${props.width + props.height} ${props.width + props.height}`}
            strokeDashoffset={props.width + props.height - scrollY}
          />
        </svg>
      )}
      ;
    </div>
  );
};

const NodeLine = (props: NodeProps) => {};

export { Connector, NodeLine };

import React, { ReactNode, useState } from 'react';

import styles from './Graph.module.css';

// size, offset, classname, and content of node
type GraphElement = {
  diameter: number;
  left: number;
  top: number;
  name: string;
  children?: ReactNode;
};

// describes node, whether it scales, and its neighbors
type GraphNode = {
  self: GraphElement;
  neighbors?: string[];
  scaling?: boolean;
};

const graph: GraphNode[] = [
  {
    self: {
      diameter: 350,
      left: 575,
      top: 1112,
      name: 'centerNode',
      children: (
        <div>
          Cornell Design & <br />
          Tech Initiative makes community impact through technology.
        </div>
      )
    },
    neighbors: ['communityNode', 'appNode', 'growthNode']
  },
  {
    self: {
      diameter: 208,
      left: 1005,
      top: 1178,
      name: 'communityNode',
      children: (
        <div>
          We host <br /> community-based initatives for the surrounding Ithaca neighborhoods.
        </div>
      )
    }
  },
  {
    self: {
      diameter: 208,
      left: 407,
      top: 1416,
      name: 'growthNode',
      children: (
        <div>
          We foster our personal growth and teach others while being professional, open-minded, and
          inclusive.
        </div>
      )
    }
  },
  {
    self: {
      diameter: 208,
      left: 385,
      top: 992,
      name: 'appNode',
      children: (
        <div>
          We create web <br /> apps, mobile apps, <br /> to establish positive experiences for
          people at Cornell.
        </div>
      )
    },
    neighbors: ['CUReviewsNode', 'CoursePlanNode', 'QueueMeNode']
  },

  {
    self: {
      diameter: 76,
      left: 624,
      top: 986,
      name: 'CUReviewsNode',
      children: <img src={'/branding/products/CUReviews.svg'} alt={'cu reviews logo'} />
    },
    scaling: true
  },
  {
    self: {
      diameter: 76,
      left: 312,
      top: 1186,
      name: 'CoursePlanNode',
      children: <img src={'/branding/products/CoursePlan.svg'} alt={'course plan logo'} />
    },
    scaling: true
  },
  {
    self: {
      diameter: 76,
      left: 343,
      top: 927,
      name: 'QueueMeNode',
      children: <img src={'/branding/products/QueueMe.svg'} alt={'queuemein logo'} />
    },
    scaling: true
  }
];

type NodeProps = {
  left: number;
  top: number;
  name: string;
  readonly children?: ReactNode;
};

const Node = ({ left, top, name, children }: NodeProps): JSX.Element => (
  <div
    className={`${styles[name]} ${styles.circle}`}
    style={{
      left: `${left}px`,
      top: `${top}px`
    }}
  >
    {children}
  </div>
);

const ScalingNode = ({ left, top, name, children }: NodeProps): JSX.Element => {
  const [scale, setScale] = useState(false);

  return (
    <div
      className={`${styles[name]} ${scale ? styles.grow : ''}`}
      style={{
        left: `${left}px`,
        top: `${top}px`
      }}
      onMouseEnter={() => setScale(true)}
      onMouseLeave={() => setScale(false)}
    >
      {children}
    </div>
  );
};

const centerCoords = (elem: GraphElement): number[] => {
  const x = elem.left + elem.diameter / 2;
  const y = elem.top + elem.diameter / 2;

  return [x, y];
};

type EdgeProps = {
  node1: string;
  node2: string;
};

const Edge = ({ node1, node2 }: EdgeProps): JSX.Element => {
  // get node info
  const graphNode1 = graph.find((n) => n.self.name === node1);
  const graphNode2 = graph.find((n) => n.self.name === node2);

  // throw error?
  if (!graphNode1 || !graphNode2) {
    return <></>;
  }

  const center1 = centerCoords(graphNode1.self);
  const center2 = centerCoords(graphNode2.self);

  const [x1, y1, x2, y2] = center1 > center2 ? [...center1, ...center2] : [...center2, ...center1];

  const height = Math.abs(y2 - y1) || 10;
  const width = Math.abs(x2 - x1);

  return (
    <svg
      width={width}
      height={height}
      className={styles.edge}
      style={{ left: x1 < x2 ? x1 : x2, top: y1 < y2 ? y1 : y2 }}
    >
      <line
        x1={0}
        y1={y1 < y2 ? `${height}px` : 0}
        x2={`${width}px`}
        y2={y1 > y2 ? `${height}px` : 0}
        stroke="#BCBCBC"
        strokeWidth="7px"
      ></line>
    </svg>
  );
};

const Graph = (): JSX.Element => {
  const graphComponents: ReactNode[] = [];

  graph.forEach((node) => {
    // create node components
    const NodeType = node.scaling ? ScalingNode : Node;
    graphComponents.push(
      <NodeType
        key={node.self.name}
        name={node.self.name}
        left={node.self.left}
        top={node.self.top}
      >
        {node.self.children}
      </NodeType>
    );

    // calculate and create edges
    node.neighbors?.forEach((name) => {
      graphComponents.push(
        <Edge key={`${node.self.name}_${name}`} node1={node.self.name} node2={name} />
      );
    });
  });

  return <div className={styles.graphContainer}>{graphComponents}</div>;
};

export default Graph;

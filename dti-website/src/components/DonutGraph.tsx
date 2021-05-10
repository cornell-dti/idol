import * as d3 from 'd3';

type Props = {
  readonly id?: string;
  readonly width: number;
  readonly height: number;
  readonly outerRadius: number;
  readonly innerRadius: number;
  readonly data: Readonly<Record<string, number>>;
};

export default function DonutGraph({
  width,
  height,
  id,
  outerRadius,
  innerRadius,
  data
}: Props): JSX.Element {
  const transform = `translate(${width / 2},${height / 2})`;

  const fillColor = d3
    .scaleOrdinal()
    .domain(Object.keys(data))
    .range(['#ff324a', 'rgb(236, 236, 236)']);
  const strokeColor = 'grey';

  const pie = d3
    .pie<void, { key: string; value: number }>()
    .value((d) => d.value)
    .sort(null);
  const entries = d3.entries(data);
  const preppedData = pie(entries);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const paths = preppedData.map((d, id) => (
    <path
      stroke={strokeColor}
      key={id}
      fill={fillColor(d.data.key) as string}
      d={arc(d as unknown as d3.DefaultArcObject) as string}
      strokeLinecap="round"
    />
  ));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="fill circle-svg"
      id={id}
      width={width}
      height={height}
    >
      <g transform={transform}>{paths}</g>
    </svg>
  );
}

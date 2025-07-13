export type ChipColor =
  | 'default'
  | 'gray'
  | 'red'
  | 'pink'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple';

type Props = {
  label: string;
  color?: ChipColor;
  allCaps?: boolean;
};

export default function Chip({ label, color = 'default', allCaps }: Props) {
  const colorMap: Record<ChipColor, string> = {
    default: 'bg-background-2 text-foreground-2',
    gray: 'bg-[#0000001a] text-background-1',
    red: 'bg-accent-red-transparent text-accent-red',
    pink: 'bg-accent-pink-transparent text-accent-pink',
    green: 'bg-accent-green-transparent text-accent-green',
    blue: 'bg-accent-blue-transparent text-accent-blue',
    yellow: 'bg-accent-yellow-transparent text-accent-yellow',
    purple: 'bg-accent-purple-transparent text-accent-purple'
  };

  const chipColor = colorMap[color];

  return (
    <p
      className={`rounded-full whitespace-nowrap px-3 py-1 small w-fit ${chipColor} ${
        allCaps ? 'caps' : ''
      }`}
    >
      {label}
    </p>
  );
}

type Props = {
  label: string;
  color?: 'default' | 'red' | 'green' | 'blue' | 'yellow' | 'purple';
};

export default function Chip({ label, color = 'default' }: Props) {
  const colorMap: Record<string, string> = {
    default: 'bg-background-2 text-foreground-2',
    red: 'bg-accent-red-transparent text-accent-red',
    green: 'bg-accent-green-transparent text-accent-green',
    blue: 'bg-accent-blue-transparent text-accent-blue',
    yellow: 'bg-accent-yellow-transparent text-accent-yellow',
    purple: 'bg-accent-purple-transparent text-accent-purple'
  };

  const chipColor = colorMap[color] ?? colorMap.default;

  return (
    <p className={`rounded-full whitespace-nowrap px-3 py-1 caps small w-fit ${chipColor}`}>
      {label}
    </p>
  );
}

import InfoIcon from '../../../components/icons/InfoIcon';

export default function Note({ text }: { text: string }) {
  return (
    <aside className="p-4 rounded-r-lg bg-accent-yellow-transparent border-1 border-accent-yellow/30 border-l-3 border-l-accent-yellow flex items-start gap-2">
      <InfoIcon color="var(--accent-yellow)" decoration={true} />
      <p>{text}</p>
    </aside>
  );
}

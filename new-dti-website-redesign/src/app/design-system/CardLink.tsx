import Link from 'next/link';

export function CardLink({
  href,
  title,
  description
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-border-1 p-6 transition hover:shadow-md hover:bg-background-2"
    >
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {description && <p className="text-sm text-foreground-3">{description}</p>}
    </Link>
  );
}

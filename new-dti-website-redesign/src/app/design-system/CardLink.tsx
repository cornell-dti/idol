import Image from 'next/image';
import Link from 'next/link';

export default function CardLink({
  href,
  title,
  description,
  thumbnail = '/design-system/thumb.jpg'
}: {
  href: string;
  title: string;
  description?: string;
  thumbnail?: string;
}) {
  return (
    <Link
      href={href}
      className="focusState rounded-lg border border-border-1 overflow-hidden transition hover:shadow-md hover:bg-background-2"
    >
      <div className="h-40 w-full relative">
        <Image src={thumbnail} alt={`${title} thumbnail`} fill className="object-cover" />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="h5">{title}</h3>
        {description && <p className="text-sm text-foreground-3">{description}</p>}
      </div>
    </Link>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export default function CardLink({
  href,
  title,
  description,
  thumbnail
}: {
  href: string;
  title: string;
  description?: string;
  thumbnail?: string;
}) {
  console.log('CardLink rendered', { href, title, description, thumbnail });
  return (
    <article className="rounded-lg border border-border-1  hover:shadow-md hover:bg-background-2 interactive activeState relative designSystemCard">
      <div className="w-full relative bg-black rounded-t-lg flex justify-center border-b border-border-1">
        <Image
          width={260.33}
          height={200}
          src={thumbnail || '/thumbnails/thumb.jpg'}
          alt=""
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <Link href={href} className="linkCard">
          <h3 className="h5">{title}</h3>
        </Link>

        {description && <p className="text-sm text-foreground-3">{description}</p>}
      </div>
    </article>
  );
}

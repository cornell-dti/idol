import Image from 'next/image';

type testimonialCardProps = {
  quote: string;
  picture: string;
  name: string;
  date: string;
  className?: string;
};

export default function TestimonialCard({
  quote,
  picture,
  name,
  date,
  className = ''
}: testimonialCardProps) {
  const sharedClasses = `${className}`;
  return (
    <article className={`p-8 min-w-[480px] border border-border-1 ${sharedClasses}`}>
      <figure className="flex flex-col gap-8">
        <span className="text-[64px] h-16">"</span>
        <blockquote>
          <p>{quote}</p>
        </blockquote>
        <figcaption className="flex gap-2">
          <Image
            src={picture}
            alt={`Picture of ${name}`}
            width={57}
            height={57}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <h6>
              <cite className="not-italic">{name}</cite>
            </h6>
            <p className="text-foreground-3">{date}</p>
          </div>
        </figcaption>
      </figure>
    </article>
  );
}

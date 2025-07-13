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
    <article
      className={`sm:p-8 p-4 max-w-[480px] h-[371px] border-r-1 border-y-1 border-border-1 ${sharedClasses}`}
    >
      <figure className="flex flex-col gap-8 justify-between h-full">
        <div className="flex flex-col gap-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="17"
            viewBox="0 0 26 17"
            fill="none"
            aria-hidden={true}
          >
            <path
              d="M8.50586 0.301758V1.62305C6.61523 2.61133 5.26172 3.64258 4.44531 4.7168C3.62891 5.79102 3.2207 6.96191 3.2207 8.22949C3.2207 8.98145 3.32812 9.49707 3.54297 9.77637C3.73633 10.0771 3.97266 10.2275 4.25195 10.2275C4.53125 10.2275 4.90723 10.1523 5.37988 10.002C5.85254 9.83008 6.28223 9.74414 6.66895 9.74414C7.5498 9.74414 8.3125 10.0771 8.95703 10.7432C9.62305 11.3877 9.95605 12.1826 9.95605 13.1279C9.95605 14.1592 9.55859 15.0508 8.76367 15.8027C7.96875 16.5332 6.98047 16.8984 5.79883 16.8984C4.35938 16.8984 3.05957 16.2754 1.89941 15.0293C0.739258 13.7832 0.15918 12.2471 0.15918 10.4209C0.15918 8.27246 0.868164 6.27441 2.28613 4.42676C3.72559 2.55762 5.79883 1.18262 8.50586 0.301758ZM23.8779 0.398438V1.62305C21.708 2.86914 20.2793 3.98633 19.5918 4.97461C18.9043 5.96289 18.5605 7.12305 18.5605 8.45508C18.5605 9.05664 18.6787 9.50781 18.915 9.80859C19.1514 10.1094 19.3984 10.2598 19.6562 10.2598C19.8926 10.2598 20.2471 10.1738 20.7197 10.002C21.1924 9.83008 21.665 9.74414 22.1377 9.74414C23.0186 9.74414 23.7812 10.0664 24.4258 10.7109C25.0918 11.334 25.4248 12.1074 25.4248 13.0312C25.4248 14.084 25.0059 14.9971 24.168 15.7705C23.3516 16.5439 22.3418 16.9307 21.1387 16.9307C19.7207 16.9307 18.4424 16.3184 17.3037 15.0938C16.165 13.8691 15.5957 12.3438 15.5957 10.5176C15.5957 8.26172 16.3154 6.20996 17.7549 4.3623C19.1943 2.49316 21.2354 1.17188 23.8779 0.398438Z"
              fill="white"
            />
          </svg>
          <blockquote>
            <p>{quote}</p>
          </blockquote>
        </div>
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

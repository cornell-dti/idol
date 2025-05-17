import Link from 'next/link';
import IconWrapper from './IconWrapper';

export type DateTime = {
  date: string;
  isTentative: boolean;
  time?: string;
};

export type RecruitmentEvent = {
  title: string;
  description: string;
  location?: string;
  type: string;
  link?: string;
  freshmen: DateTime;
  upperclassmen: DateTime;
  spring: DateTime;
};

const TimelineCard = ({
  event,
  cycle
}: {
  event: RecruitmentEvent;
  cycle: 'freshmen' | 'upperclassmen' | 'spring';
}) => {
  const datetime: DateTime = event[cycle];
  return (
    <div className="max-w-[504px]">
      <div className="flex flex-col gap-2 p-4 rounded-t-lg border border-border-1 border-b-transparent">
        <IconWrapper>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 16V12"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 8H12.01"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </IconWrapper>
        <div className="flex flex-col gap-1">
          <h5>{event.title}</h5>
          <p className="text-foreground-3">{event.description}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        {event.location &&
          (event.link ? (
            <Link
              href={event.link}
              target="_blank"
              className="flex justify-between md:w-1/2 p-4 md:rounded-bl-lg border border-border-1 md:border-r-0 border-b-0 md:border-b-1 hover:bg-background-2 underline underline-offset-3 focusState"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clip-path="url(#clip0_2243_872)">
                    <path
                      d="M6.66602 8.66697C6.95232 9.04972 7.31759 9.36642 7.73705 9.5956C8.15651 9.82477 8.62035 9.96105 9.09712 9.99519C9.57388 10.0293 10.0524 9.96055 10.5002 9.79349C10.9481 9.62643 11.3548 9.36502 11.6927 9.02697L13.6927 7.02697C14.2999 6.3983 14.6359 5.55629 14.6283 4.6823C14.6207 3.80831 14.2701 2.97227 13.6521 2.35424C13.0341 1.73621 12.198 1.38565 11.324 1.37806C10.45 1.37046 9.60802 1.70644 8.97935 2.31364L7.83268 3.45364"
                      stroke="white"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.33347 7.33381C9.04716 6.95106 8.68189 6.63435 8.26243 6.40518C7.84297 6.17601 7.37913 6.03973 6.90237 6.00559C6.4256 5.97144 5.94707 6.04023 5.49924 6.20729C5.0514 6.37435 4.64472 6.63576 4.3068 6.97381L2.3068 8.97381C1.69961 9.60248 1.36363 10.4445 1.37122 11.3185C1.37881 12.1925 1.72938 13.0285 2.3474 13.6465C2.96543 14.2646 3.80147 14.6151 4.67546 14.6227C5.54945 14.6303 6.39146 14.2943 7.02013 13.6871L8.16013 12.5471"
                      stroke="white"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2243_872">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p>{datetime.isTentative ? 'TBD' : event.location}</p>
              </div>
              <IconWrapper size="small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3.33398 8H12.6673"
                    stroke="white"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 3.33301L12.6667 7.99967L8 12.6663"
                    stroke="white"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </IconWrapper>
            </Link>
          ) : (
            <div className="flex items-center gap-2 md:w-1/2 p-4 md:rounded-bl-lg border border-border-1 md:border-r-0 border-b-0 md:border-b-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M13.3327 6.66634C13.3327 9.99501 9.64002 13.4617 8.40002 14.5323C8.2845 14.6192 8.14388 14.6662 7.99935 14.6662C7.85482 14.6662 7.7142 14.6192 7.59868 14.5323C6.35868 13.4617 2.66602 9.99501 2.66602 6.66634C2.66602 5.25185 3.22792 3.8953 4.22811 2.89511C5.22831 1.89491 6.58486 1.33301 7.99935 1.33301C9.41384 1.33301 10.7704 1.89491 11.7706 2.89511C12.7708 3.8953 13.3327 5.25185 13.3327 6.66634Z"
                  stroke="white"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z"
                  stroke="white"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p>{event.location}</p>
            </div>
          ))}
        <div
          className={`flex gap-2 items-center p-4 border border-border-1 rounded-b-lg ${event.location ? 'md:w-1/2  md:rounded-bl-none' : 'w-full'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M14 5.00033V4.00033C14 3.6467 13.8595 3.30756 13.6095 3.05752C13.3594 2.80747 13.0203 2.66699 12.6667 2.66699H3.33333C2.97971 2.66699 2.64057 2.80747 2.39052 3.05752C2.14048 3.30756 2 3.6467 2 4.00033V13.3337C2 13.6873 2.14048 14.0264 2.39052 14.2765C2.64057 14.5265 2.97971 14.667 3.33333 14.667H5.66667"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.666 1.33301V3.99967"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.33398 1.33301V3.99967"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 6.66699H5.33333"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.666 11.6663L10.666 10.8663V9.33301"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.666 14.667C12.8752 14.667 14.666 12.8761 14.666 10.667C14.666 8.45785 12.8752 6.66699 10.666 6.66699C8.45688 6.66699 6.66602 8.45785 6.66602 10.667C6.66602 12.8761 8.45688 14.667 10.666 14.667Z"
              stroke="white"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p>
            {datetime.date}
            {datetime.time ? `, ${datetime.time}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;

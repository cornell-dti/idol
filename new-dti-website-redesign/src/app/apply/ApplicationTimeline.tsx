'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Tabs from '../../components/Tabs';
import events from './events.json';
import TimelineCard, { Cycle, RecruitmentEvent } from '../../components/TimelineCard';
import { parseDateTime } from '../../utils/dateUtils';
import config from '../../../config.json';
import useScreenSize from '../../hooks/useScreenSize';
import { TABLET_BREAKPOINT } from '../../consts';

const applicationEvents = events.events;

const IS_FALL_SEMESTER = config.semester.split(' ')[0] === 'Fall';
const NODE_HEADER_HEIGHT = 84.7;
const NODE_GAP = 32;
const CIRCLE_DIAMETER = 17;
const FADE_IN_THRESHOLD = 15;

const eventProgress = (
  firstEvent: RecruitmentEvent,
  secondEvent: RecruitmentEvent,
  cycle: Cycle
): number => {
  const [, end] = parseDateTime(firstEvent[cycle]!);
  const [start] = parseDateTime(secondEvent[cycle]!);
  if (Date.now() < end) return 0;
  if (Date.now() > start) return 1;
  return (Date.now() - end) / (start - end);
};

const ApplicationTimeline = () => {
  const [cycle, setCycle] = useState<Cycle>(IS_FALL_SEMESTER ? Cycle.UPPERCLASSMEN : Cycle.SPRING);
  const [, setLoading] = useState<boolean>(false);
  const [scroll, setScroll] = useState<Record<string, number | undefined>>({});
  const [isClient, setIsClient] = useState<boolean>(false);
  const nodesRef = useRef<(HTMLDivElement | null)[]>(applicationEvents.map(() => null));
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const { width } = useScreenSize();

  const cycleEvents = applicationEvents
    .filter((event) => event[cycle])
    .sort((e1, e2) => parseDateTime(e1[cycle]!)[0] - parseDateTime(e2[cycle]!)[0]);

  useEffect(() => {
    const div = timelineRef.current;
    const handleScroll = () => {
      if (timelineRef.current) {
        const { scrollTop, clientHeight, scrollHeight } = timelineRef.current;
        setScroll({ scrollTop, maxScroll: scrollHeight - clientHeight });
      }
    };

    setIsClient(true);
    if (div) {
      div.addEventListener('scroll', handleScroll);
      return () => div.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const nextEventIndex = cycleEvents.findIndex(
      (event) => Date.now() <= parseDateTime(event[cycle]!)[0]
    );
    const nextNode =
      nodesRef.current[nextEventIndex === -1 ? cycleEvents.length - 1 : nextEventIndex];
    if (timelineRef.current && nextNode) {
      const { scrollX, scrollY } = window;
      nextNode.scrollIntoView();
      window.scroll(scrollX, scrollY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  let gradientStyle: string;
  if (!scroll.scrollTop || scroll.scrollTop <= FADE_IN_THRESHOLD) {
    gradientStyle = 'after:bg-linear-[transparent_95%,var(--background-1)]';
  } else if (scroll.maxScroll && scroll.scrollTop + FADE_IN_THRESHOLD >= scroll.maxScroll) {
    gradientStyle = 'after:bg-linear-[var(--background-1),transparent_5%]';
  } else {
    gradientStyle =
      'after:bg-linear-[var(--background-1),transparent_5%,transparent_95%,var(--background-1)]';
  }

  const isMobile = width <= TABLET_BREAKPOINT;

  return (
    <section id="application-timeline" style={{ overflow: 'visible' }}>
      <div
        className={`relative flex flex-col md:flex-row justify-between border-b-1 border-border-1 md:border-0
      after:content-[''] after:w-full after:h-200 after:absolute ${isMobile ? 'after:top-[calc(1px+100%)]' : 'after:top-full'} after:pointer-events-none after:z-10
      ${gradientStyle}`}
      >
        <h2 className="p-4 sm:p-8 pb-0! md:pb-8!">Application timeline</h2>
        <Tabs
          className={"w-full md:w-90"}
          onChange={(c) => setCycle(c.toLowerCase() as Cycle)}
          tabs={[
            {
              label: 'Upperclassmen',
              content: <></>
            },
            ...(IS_FALL_SEMESTER ? [{ label: 'Freshmen', content: <></> }] : [])
          ]}
        />
      </div>
      <div
        ref={timelineRef}
        className="h-200 px-4 md:px-8 py-4 md:py-0 flex justify-center overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {isClient && (
          <div className="flex flex-col items-center gap-8 p-0 md:py-8 md:px-6 w-fit">
            {cycleEvents.map((event, i) => {
              if (!event[cycle]) return <Fragment key={i}></Fragment>;
              const isLast = i === cycleEvents.length - 1;
              const nodeHeight = nodesRef.current[i]?.offsetHeight ?? 0;
              const lineHeight = nodeHeight + 10;
              const svgHeight = isLast
                ? Math.max(0, nodeHeight - NODE_HEADER_HEIGHT + NODE_GAP)
                : lineHeight + 17.5;
              const progress = isLast ? 0 : eventProgress(event, cycleEvents[i + 1], cycle);
              const circleColor =
                Date.now() < parseDateTime(event[cycle]!)[0]
                  ? 'var(--foreground-3)'
                  : 'var(--accent-red)';
              return (
                <div key={event.title} className="relative w-full">
                  {i === 0 && (
                    <svg
                      overflow="visible"
                      width="13"
                      height={NODE_HEADER_HEIGHT + NODE_GAP - 4 - (isMobile ? 16 : 0)}
                      className={`absolute -left-[14.5px] md:-left-8 -top-4 md:-top-8`}
                    >
                      <defs>
                        <linearGradient id="topGradient" gradientTransform="rotate(90)">
                          <stop offset="5%" stopColor="var(--background-1)" />
                          <stop offset="20%" stopColor="var(--accent-red)" />
                        </linearGradient>
                      </defs>
                      <rect
                        width="3"
                        x="5"
                        rx="1"
                        ry="1"
                        height={NODE_HEADER_HEIGHT + NODE_GAP - 4 - (isMobile ? 16 : 0)}
                        fill="url('#topGradient')"
                      />
                    </svg>
                  )}
                  <svg
                    width="13"
                    height={svgHeight}
                    viewBox={`0 0 13 ${svgHeight}`}
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -left-[14.5px] md:-left-8 top-[84.7px]"
                  >
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="6"
                      fill="none"
                      stroke={circleColor}
                      strokeWidth="1"
                    />
                    <circle cx="6.5" cy="6.5" r="3" fill={circleColor} />
                    {isLast ? (
                      <>
                        <defs>
                          <linearGradient id="bottomGradient" gradientTransform="rotate(90)">
                            <stop offset="80%" stopColor={circleColor} />
                            <stop offset="95%" stopColor="var(--background-1)" />
                          </linearGradient>
                        </defs>
                        <rect
                          x="5"
                          y="17"
                          rx="1"
                          ry="1"
                          width="3"
                          height={Math.max(
                            0,
                            nodeHeight - NODE_HEADER_HEIGHT + NODE_GAP - CIRCLE_DIAMETER
                          )}
                          fill="url('#bottomGradient')"
                        />
                      </>
                    ) : (
                      <>
                        <rect
                          x="5"
                          y="17"
                          rx="1"
                          ry="1"
                          width="3"
                          height={progress * lineHeight}
                          fill="var(--accent-red)"
                        />
                        <rect
                          x="5"
                          y={CIRCLE_DIAMETER + progress * lineHeight}
                          rx="1"
                          ry="1"
                          width="3"
                          height={(1 - progress) * lineHeight}
                          fill="var(--foreground-3)"
                          className="rounded-full"
                        />
                      </>
                    )}
                  </svg>
                  <TimelineCard
                    event={event}
                    cycle={cycle}
                    ref={(el) => {
                      nodesRef.current[i] = el;
                      setLoading((prev) => !prev);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationTimeline;

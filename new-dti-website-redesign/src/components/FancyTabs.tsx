"use client";

import { useState, useRef } from "react";
import React from "react";

type Tab = {
  label: string;
  content: React.ReactNode;
};

export type TabsProps = {
  tabs: Tab[];
  className?: string;
  width?: number;
};

export default function Tabs({ tabs, className = "", width }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);

  // You should be able to use the left/right arrow keys to navigate between tabs
  // This piece of code handles keyboard navigation so that the tabs are accessible
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      // +1 for going to right, -1 for going to left
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (activeIndex + dir + tabs.length) % tabs.length;
      setActiveIndex(nextIndex);
      tabsRef.current[nextIndex]?.focus(); // Moves focus to next tab
    }
  };

  return (
    <div className={`flex flex-col ${className}`} style={{ width: width }}>
      <div
        className="flex flex-wrap z-20 mb-[-2px]"
        role="tablist"
        aria-label="Tabbed content"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => (
          <div className="flex" key={tab.label}>
            {activeIndex === index ? (
              index === 0 ? (
                <div className="h-[42px] w-7 bg-background-1 border-border-1 border-l-1 border-t-1 rounded-tl-2xl" />
              ) : (
                <>
                  <div className="w-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="transform translate-x-[-31px]"
                      width="60"
                      height="42"
                      viewBox="0 0 60 42"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_2816_5179)">
                        <mask
                          id="mask0_2816_5179"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="-1"
                          width="60"
                          height="43"
                        >
                          <path
                            d="M59 0H51.9217C44.228 0 37.2164 4.41324 33.889 11.3501L25.1111 29.6498C21.7836 36.5868 14.772 41 7.0783 41H0H59V0Z"
                            fill="white"
                          />
                          <mask
                            id="mask1_2816_5179"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="-1"
                            width="60"
                            height="43"
                          >
                            <path d="M0 -1H60V42H0V-1Z" fill="white" />
                            <path
                              d="M59 0H51.9217C44.228 0 37.2164 4.41324 33.889 11.3501L25.1111 29.6498C21.7836 36.5868 14.772 41 7.0783 41H0H59V0Z"
                              fill="var(--background-1)"
                            />
                          </mask>
                          <g mask="url(#mask1_2816_5179)">
                            <path
                              d="M59 0V-1H60V0H59ZM59 41H60V42H59V41ZM59 1H51.9217V-1H59V1ZM0 40H59V42H0V40ZM58 41V0H60V41H58ZM34.7906 11.7826L26.0127 30.0823L24.2094 29.2174L32.9873 10.9177L34.7906 11.7826ZM7.0783 42H0V40H7.0783V42ZM26.0127 30.0823C22.5189 37.3661 15.1567 42 7.0783 42V40C14.3873 40 21.0483 35.8074 24.2094 29.2174L26.0127 30.0823ZM51.9217 1C44.6127 1 37.9517 5.19257 34.7906 11.7826L32.9873 10.9177C36.4812 3.6339 43.8433 -1 51.9217 -1V1Z"
                              fill="var(--background-1)"
                            />
                          </g>
                        </mask>
                        <g mask="url(#mask0_2816_5179)">
                          <path
                            d="M60 1.02441H52.9217C45.228 1.02441 38.2164 5.43765 34.889 12.3746L26.1111 30.6743C22.7836 37.6112 15.772 42.0244 8.0783 42.0244H1H60V1.02441Z"
                            fill="var(--background-1)"
                          />
                          <mask
                            id="mask2_2816_5179"
                            maskUnits="userSpaceOnUse"
                            x="1"
                            y="0"
                            width="60"
                            height="44"
                          >
                            <path
                              d="M1 0.0244141H61V43.0244H1V0.0244141Z"
                              fill="white"
                            />
                            <path
                              d="M60 1.02441H52.9217C45.228 1.02441 38.2164 5.43765 34.889 12.3746L26.1111 30.6743C22.7836 37.6112 15.772 42.0244 8.0783 42.0244H1H60V1.02441Z"
                              fill="var(--background-1)"
                            />
                          </mask>
                          <g mask="url(#mask2_2816_5179)">
                            <path
                              d="M60 1.02441V0.0244141H61V1.02441H60ZM60 42.0244H61V43.0244H60V42.0244ZM60 2.02441H52.9217V0.0244141H60V2.02441ZM1 41.0244H60V43.0244H1V41.0244ZM59 42.0244V1.02441H61V42.0244H59ZM35.7906 12.8071L27.0127 31.1068L25.2094 30.2418L33.9873 11.9421L35.7906 12.8071ZM8.0783 43.0244H1V41.0244H8.0783V43.0244ZM27.0127 31.1068C23.5189 38.3905 16.1567 43.0244 8.0783 43.0244V41.0244C15.3873 41.0244 22.0483 36.8318 25.2094 30.2418L27.0127 31.1068ZM52.9217 2.02441C45.6127 2.02441 38.9517 6.21699 35.7906 12.8071L33.9873 11.9421C37.4812 4.65831 44.8433 0.0244141 52.9217 0.0244141V2.02441Z"
                              fill="#2E2E2E"
                            />
                          </g>
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_2816_5179">
                          <rect
                            width="60"
                            height="42"
                            fill="white"
                            transform="matrix(-1 0 0 1 60 0)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </>
              )
            ) : null}

            <button
              className={`${
                activeIndex === index
                  ? "bg-background-1 border-t-1 border-border-1"
                  : "rounded-t-md px-7"
              } relative hover:before:opacity-100 focus:outline-hidden
              
              before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-10 before:bg-background-2 before:rounded-t-lg before:z-[-3] before:opacity-0  before:transition-opacity before:duration-[120ms] before:ease-out
              
              after:content-[''] after:absolute after:-left-2 after:top-1 after:w-[calc(100%+16px)] after:rounded-sm after:h-8 after:z-2
              
              focus-visible:after:outline
              focus-visible:after:outline-[var(--foreground-1)]
              focus-visible:after:outline-[2px]
              focus-visible:after:outline-offset-[3px]`}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              onClick={() => setActiveIndex(index)}
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`panel-${index}`}
              id={`tab-${index}`}
              tabIndex={activeIndex === index ? 0 : -1}
            >
              {tab.label}
            </button>

            {activeIndex === index ? (
              <div className="w-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="transform translate-x-[-1px]"
                  width="60"
                  height="42"
                  viewBox="0 0 60 42"
                  fill="none"
                >
                  <g clip-path="url(#clip0_2816_5162)">
                    <mask
                      id="mask0_2816_5162"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="-1"
                      width="60"
                      height="43"
                    >
                      <path
                        d="M1 0H8.0783C15.772 0 22.7836 4.41324 26.111 11.3501L34.8889 29.6498C38.2164 36.5868 45.228 41 52.9217 41H60H1V0Z"
                        fill="white"
                      />
                      <mask
                        id="mask1_2816_5162"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="-1"
                        width="60"
                        height="43"
                      >
                        <path d="M60 -1H0V42H60V-1Z" fill="white" />
                        <path
                          d="M1 0H8.0783C15.772 0 22.7836 4.41324 26.111 11.3501L34.8889 29.6498C38.2164 36.5868 45.228 41 52.9217 41H60H1V0Z"
                          fill="var(--background-1)"
                        />
                      </mask>
                      <g mask="url(#mask1_2816_5162)">
                        <path
                          d="M1 0V-1H0V0H1ZM1 41H0V42H1V41ZM1 1H8.0783V-1H1V1ZM60 40H1V42H60V40ZM2 41V0H0V41H2ZM25.2094 11.7826L33.9873 30.0823L35.7906 29.2174L27.0127 10.9177L25.2094 11.7826ZM52.9217 42H60V40H52.9217V42ZM33.9873 30.0823C37.4811 37.3661 44.8433 42 52.9217 42V40C45.6127 40 38.9517 35.8074 35.7906 29.2174L33.9873 30.0823ZM8.0783 1C15.3873 1 22.0483 5.19257 25.2094 11.7826L27.0127 10.9177C23.5188 3.6339 16.1567 -1 8.0783 -1V1Z"
                          fill="var(--background-1)"
                        />
                      </g>
                    </mask>
                    <g mask="url(#mask0_2816_5162)">
                      <path
                        d="M0 1.02441H7.0783C14.772 1.02441 21.7836 5.43765 25.111 12.3746L33.8889 30.6743C37.2164 37.6112 44.228 42.0244 51.9217 42.0244H59H0V1.02441Z"
                        fill="var(--background-1)"
                      />
                      <mask
                        id="mask2_2816_5162"
                        maskUnits="userSpaceOnUse"
                        x="-1"
                        y="0"
                        width="60"
                        height="44"
                      >
                        <path
                          d="M59 0.0244141H-1V43.0244H59V0.0244141Z"
                          fill="white"
                        />
                        <path
                          d="M0 1.02441H7.0783C14.772 1.02441 21.7836 5.43765 25.111 12.3746L33.8889 30.6743C37.2164 37.6112 44.228 42.0244 51.9217 42.0244H59H0V1.02441Z"
                          fill="var(--background-1)"
                        />
                      </mask>
                      <g mask="url(#mask2_2816_5162)">
                        <path
                          d="M0 1.02441V0.0244141H-1V1.02441H0ZM0 42.0244H-1V43.0244H0V42.0244ZM0 2.02441H7.0783V0.0244141H0V2.02441ZM59 41.0244H0V43.0244H59V41.0244ZM1 42.0244V1.02441H-1V42.0244H1ZM24.2094 12.8071L32.9873 31.1068L34.7906 30.2418L26.0127 11.9421L24.2094 12.8071ZM51.9217 43.0244H59V41.0244H51.9217V43.0244ZM32.9873 31.1068C36.4811 38.3905 43.8433 43.0244 51.9217 43.0244V41.0244C44.6127 41.0244 37.9517 36.8318 34.7906 30.2418L32.9873 31.1068ZM7.0783 2.02441C14.3873 2.02441 21.0483 6.21699 24.2094 12.8071L26.0127 11.9421C22.5188 4.65831 15.1567 0.0244141 7.0783 0.0244141V2.02441Z"
                          fill="#2E2E2E"
                        />
                      </g>
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_2816_5162">
                      <rect width="60" height="42" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeIndex}`}
        aria-labelledby={`tab-${activeIndex}`}
        //   className={`${activeIndex === 0 ? '[&>div]:rounded-tr-md' : '[&>div]:rounded-t-md'}  border-border-1 border-1 rounded-lg'`}
        className={`${
          activeIndex === 0 ? "rounded-b-2xl rounded-tr-2xl" : "rounded-2xl"
        } border-border-1 border-1 bg-background-1`}
      >
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
}

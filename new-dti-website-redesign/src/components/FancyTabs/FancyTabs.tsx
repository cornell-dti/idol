'use client';

import { useState, useRef, useEffect } from 'react';
import TabEdge from './TabEdges';

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  className?: string;
};

export default function FancyTabs({ tabs, className = '' }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);

  // You should be able to use the left/right arrow keys to navigate between tabs
  // This piece of code handles keyboard navigation so that the tabs are accessible
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      // +1 for going to right, -1 for going to left
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (activeIndex + dir + tabs.length) % tabs.length;
      setActiveIndex(nextIndex);
      tabsRef.current[nextIndex]?.focus(); // Moves focus to next tab
    }
  };

  // gradients on sides to indicate overflow
  const gradientEdgeBase = 'absolute top-0 w-8 h-10 z-35 pointer-events-none';
  const gradientLeft = `${gradientEdgeBase} left-0 bg-[linear-gradient(to_right,var(--background-1),transparent)]`;
  const gradientRight = `${gradientEdgeBase} right-0 bg-[linear-gradient(to_left,var(--background-1),transparent)]`;

  // logic to show the left gradient when the tab list is scrolled
  // by default it hides the left gradient (opacity 0) since we don't want it to show when the tabs are not scrolled
  // this is because the gradient is meant to indicate overflow, yet there isn't overflow on the left (only the right)
  const tabListRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);

  useEffect(() => {
    const el = tabListRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowLeftGradient(el.scrollLeft > 0);
    };

    const onFrame = () => handleScroll();

    requestAnimationFrame(onFrame);
    el.addEventListener('scroll', handleScroll);

    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`flex flex-col relative ${className}`}>
      <div
        className={`transition-opacity transition-120 ${gradientLeft} ${
          showLeftGradient ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className="fancyTabsContainer flex z-20 mb-[-2px] overflow-auto"
        role="tablist"
        aria-label="Tabbed content"
        onKeyDown={handleKeyDown}
        ref={tabListRef}
      >
        {tabs.map((tab, index) => (
          <div className="flex" key={tab.label}>
            {activeIndex === index && (
              <>
                {index === 0 ? (
                  <div className="h-[42px] w-7 bg-background-2 border-border-1 border-l-1 border-t-1 rounded-tl-2xl" />
                ) : (
                  <div className="w-7">
                    <TabEdge variant="left" />
                  </div>
                )}
              </>
            )}
            <button
              className={`${
                activeIndex === index
                  ? 'bg-background-2 border-t-1 border-border-1'
                  : 'rounded-t-md px-7'
              } relative hover:before:opacity-100 focus:outline-hidden cursor-pointer
              
              before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-10 before:bg-background-2 before:rounded-t-3xl before:z-[-3] before:opacity-0  before:transition-opacity before:duration-[120ms] before:ease-out
              
              after:content-[''] after:absolute after:-left-2 after:top-1 after:w-[calc(100%+16px)] after:rounded-sm after:h-8 after:z-2
              
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
                <TabEdge variant="right" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className={gradientRight} />

      <div
        role="tabpanel"
        id={`panel-${activeIndex}`}
        aria-labelledby={`tab-${activeIndex}`}
        className={`${
          activeIndex === 0 ? 'rounded-b-2xl rounded-tr-2xl' : 'rounded-2xl'
        } border-border-1 border-1 bg-background-1 overflow-hidden`}
      >
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
}

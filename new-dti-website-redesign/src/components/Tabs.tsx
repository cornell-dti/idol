'use client';

import { useState, useRef, useEffect } from 'react';
import Button from './Button';

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  className?: string;
  center?: boolean;
  tabsContainerPadding?: boolean;
};

export default function Tabs({ tabs, className = '', center, tabsContainerPadding }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTab = tabsRef.current[activeIndex];
    const highlight = highlightRef.current;
    if (currentTab && highlight) {
      const tabRect = currentTab.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const left = tabRect.left - containerRect.left;
        const width = tabRect.width;
        highlight.style.transform = `translateX(${left}px)`;
        highlight.style.width = `${width}px`;
      }
    }
  }, [activeIndex]);

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

  return (
    <div className={`flex flex-col ${className} ${center ? 'items-center' : ''}`}>
      <div className="flex p-4">
        <div
          ref={containerRef}
          className={`flex flex-1 relative w-fit border-1 border-border-1 rounded-full bg-black p-0.5 ${className} ${
            center ? 'justify-center' : ''
          }`}
          role="tablist"
          aria-label="Tabbed content"
          onKeyDown={handleKeyDown}
        >
          <div
            ref={highlightRef}
            className="absolute top-[2px] left-0 bg-background-2 rounded-full transition-transform duration-300 ease-in-out z-0 h-12"
          />

          {tabs.map((tab, index) => (
            <button
              className="flex-1 h-12 rounded-full px-6 cursor-pointer focusState transition-[background-color] duration-[120ms]  z-1"
              key={tab.label}
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
          ))}
        </div>
      </div>

      {/* IMPORTANT: according to the W3C (official accessibility documentation, https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
       * When a tabpanel doesn't contain any focusable elements, the rendered panel should have tabindex="0" so that it's included in the tab sequence of the page. Make sure to also include focusState for the proper outline styling too!

       Example implementation:
        <Tabs
          tabs={[
            {
              label: 'Tab 1',
              content: (
                <div className="focusState" tabIndex={0}>
                  <p>No interactive content in this tab panel, so need tabIndex</p>
                </div>
              )
            }
          ]}
        />
       */}
      <div role="tabpanel" id={`panel-${activeIndex}`} aria-labelledby={`tab-${activeIndex}`}>
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
}

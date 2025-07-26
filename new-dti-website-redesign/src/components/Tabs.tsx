'use client';

import { useState, useRef, useEffect } from 'react';

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  onChange?: (label: string) => void;
  className?: string;
};

export default function Tabs({ tabs, onChange = () => {}, className = '' }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // This is for the highlight effect (the filled pill) behind the selected tab
  useEffect(() => {
    const currentTab = tabsRef.current[activeIndex];
    const highlight = highlightRef.current;
    if (currentTab && highlight) {
      const tabRect = currentTab.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const { left: tabLeft, width } = tabRect;
        const { left: containerLeft } = containerRect;
        const left = tabLeft - containerLeft;
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
      onChange(tabs[nextIndex].label);
      tabsRef.current[nextIndex]?.focus(); // Moves focus to next tab
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex p-4 !pt-8 sm:p-8">
        <div
          ref={containerRef}
          className={`flex flex-1 relative w-fit border-1 border-border-1 rounded-full bg-black p-0.5 ${className}`}
          role="tablist"
          aria-label="Tabbed content"
          onKeyDown={handleKeyDown}
        >
          <div
            ref={highlightRef}
            className="absolute -left-[1px] top-0.5 bg-background-2 rounded-full transition-transform duration-300 ease-in-out z-0 h-[calc(100%-4px)] w-full"
          />

          {tabs.map((tab, index) => (
            <button
              className="flex items-center justify-center no-wrap flex-1 h-fill rounded-full py-3 px-6 cursor-pointer focusState z-1"
              key={tab.label}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              onClick={() => {
                setActiveIndex(index);
                onChange(tabs[index].label);
              }}
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

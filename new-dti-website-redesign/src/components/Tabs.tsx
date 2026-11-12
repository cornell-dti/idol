'use client';

import { useState, useRef, useEffect } from 'react';
import useScreenSize from '../hooks/useScreenSize';

// Team tabs wrap into a 2-column, 3-row grid below LAPTOP_BREAKPOINT; a single row overflows phone widths
const TEAM_TABLIST_CLASSES =
  'flex-wrap rounded-md [@media(min-width:1024px)]:flex-nowrap [@media(min-width:1024px)]:rounded-full';
const TEAM_HIGHLIGHT_CLASSES = 'rounded-md [@media(min-width:1024px)]:rounded-full';
const TEAM_TAB_CLASSES =
  'basis-1/2 flex-col rounded-md px-2 [@media(min-width:1024px)]:flex-1 [@media(min-width:1024px)]:flex-row [@media(min-width:1024px)]:rounded-full [@media(min-width:1024px)]:px-6';

type Tab = {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  className?: string;
  variant?: 'normal' | 'team';
  onTabChange?: (label?: string) => void;
};

export default function Tabs({ tabs, className = '', variant = 'normal', onTabChange }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useScreenSize();

  const isTeam = variant === 'team';

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onTabChange?.(tabs[index].label);
  };

  // This is for the highlight effect (the filled pill) behind the selected tab
  useEffect(() => {
    function updateHighlight() {
      const currentTab = tabsRef.current[activeIndex];
      const highlight = highlightRef.current;
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (currentTab && highlight && containerRect) {
        const tabRect = currentTab.getBoundingClientRect();
        const left = tabRect.left - containerRect.left;
        const top = tabRect.top - containerRect.top;
        highlight.style.transform = `translate(${left}px, ${top}px)`;
        highlight.style.width = `${tabRect.width}px`;
        highlight.style.height = `${tabRect.height}px`;
      }
    }

    updateHighlight();
  }, [activeIndex, width]);

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
    <div className={`flex flex-col ${className}`}>
      <div className="flex p-4 !pt-8 sm:p-8">
        <div
          ref={containerRef}
          className={`flex flex-1 relative w-fit border-1 border-border-1 bg-black p-0.5 
          ${isTeam ? TEAM_TABLIST_CLASSES : 'rounded-full'}`}
          role="tablist"
          aria-label="Tabbed content"
          onKeyDown={handleKeyDown}
        >
          <div
            ref={highlightRef}
            className={`absolute -top-0.25 -left-0.25 bg-background-2 transition-transform duration-300 ease-in-out z-0
            ${isTeam ? TEAM_HIGHLIGHT_CLASSES : 'rounded-full'}`}
          />

          {tabs.map((tab, index) => (
            <button
              className={`flex gap-2 items-center justify-center whitespace-nowrap h-fill py-3 cursor-pointer focusState z-1
              ${isTeam ? TEAM_TAB_CLASSES : 'flex-1 flex-row rounded-full px-6'}`}
              key={tab.label}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              onClick={() => handleTabClick(index)}
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`panel-${index}`}
              id={`tab-${index}`}
              tabIndex={activeIndex === index ? 0 : -1}
            >
              {tab.icon && (
                // We don't need screen readers to announce the icon, so aria-hidden
                <span className="flex-shrink-0" aria-hidden>
                  {tab.icon}
                </span>
              )}
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

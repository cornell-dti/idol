'use client';

import { useState, useRef } from 'react';
import Button from './Button';

type Tab = {
  label: string;
  content: React.ReactNode;
};

export type TabsProps = {
  tabs: Tab[];
  className?: string;
  center?: boolean;
};

export default function Tabs({ tabs, className = '', center }: TabsProps) {
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

  return (
    <div className={`flex flex-col gap-8 ${className} ${center ? 'items-center' : ''}`}>
      <div
        className={`flex flex-wrap gap-4 w-fit ${className} ${center ? 'justify-center' : ''}`}
        role="tablist"
        aria-label="Tabbed content"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => (
          <Button
            key={tab.label}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            label={tab.label}
            onClick={() => setActiveIndex(index)}
            variant={activeIndex === index ? 'primary' : 'tertiary'}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`panel-${index}`}
            id={`tab-${index}`}
            tabIndex={activeIndex === index ? 0 : -1}
          />
        ))}
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

'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { useId } from 'react';

type FAQAccordionProps = {
  header: string;
  children: ReactNode;
  icon?: string;
};

export default function Accordion({ header, children, icon }: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  // generate a unique ID for the accordion
  const id = useId();
  const contentId = `accordion-content-${id}`;

  return (
    <div className="border-t-1 border-border-1">
      <h3 className="h6">
        <button
          id={`${contentId}-header`} // unique ID for the header, referenced by aria-labelledby in <div>
          aria-controls={contentId} // points to ID of controlled content region (the sibling <div>)
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 sm:p-8 flex justify-between items-center cursor-pointer bg-background-1 hover:bg-background-2 transition-colors duration-[120ms] focusState text-left"
          style={{
            background: isOpen ? `var(--background-2)` : ''
          }}
        >
          <div className="flex items-center gap-4">
            {icon && <img src={icon} alt="" className="w-5 h-5 sm:w-6 sm:h-6" />}
            {header}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            className={`w-6 h-6 flex-shrink-0 transform transition-transform duration-200 ease-out ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
          >
            <path
              d="M6 9.5L12 15.5L18 9.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h3>

      <div
        aria-labelledby={`${contentId}-header`} // uses <button>'s ID to label this region
        id={contentId} // unique ID for content panel, referenced by aria-controls in <button>
        ref={contentRef}
        role="region"
        aria-hidden={!isOpen}
        style={{
          height: isOpen ? `${height}px` : '0px'
        }}
        className="overflow-hidden transition-all duration-200 ease-in-out bg-background-2"
      >
        <div className="p-4 pt-0 sm:p-8 sm:pt-0 text-base text-foreground-3">{children}</div>
      </div>
    </div>
  );
}

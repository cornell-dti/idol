'use client';

import { ReactNode } from 'react';

// Props type for the FAQAccordion component
type FAQAccordionProps = {
  header: string;
  children: ReactNode;
};

/**
 * Creates a collapsible accordion component using Radix UI
 *
 * @param header - The text displayed in the accordion trigger/header
 * @param children - The content shown when the accordion is opened
 */
export default function FAQAccordion({ header, children }: FAQAccordionProps) {
  return (
    <details className="group border border-border-1 border-b-0 last:border-b">
      <summary
        className="
          list-none p-8
          focusState focus-visible:relative 
          group-open:pb-[16px] bg-background-1 group-open:bg-background-2 hover:bg-background-2 group-open:hover:bg-background-3 transition-[background-color] duration-[120ms]
          flex justify-between items-center cursor-pointer"
      >
        <h6>{header}</h6>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          className="
      w-6 h-6
      flex-shrink-0
      transition-transform duration-200 ease-out
      group-open:-rotate-180
    "
          fill="none"
        >
          <path
            d="M6 9.5L12 15.5L18 9.5"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </summary>

      <div className="p-[32px] pt-0 text-base text-foreground-3 bg-background-2">{children}</div>
    </details>
  );
}

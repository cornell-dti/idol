'use client';

import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <details className="group border border-border-1">
      <summary
        className="
          list-none p-8
          focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--foreground-1)] focus-visible:relative 
          group-open:pb-[16px] bg-background-1 group-open:bg-background-2 hover:bg-background-2 group-open:hover:bg-background-3
          flex justify-between items-center cursor-pointer"
      >
        <h6>{header}</h6>
        <ChevronDown className="group-open:rotate-180 [transition:200ms_ease-out]" />
      </summary>

      <div className="p-[32px] pt-0 text-base text-foreground-3 bg-background-2">{children}</div>
    </details>
  );
}

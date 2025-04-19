'use client';

import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

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
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="item-1" className="group w-[880px] border border-border-1">
        <Accordion.Header>
          <Accordion.Trigger
            className="w-full focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-[3px] focus-visible:outline-[var(--foreground-1)] focus-visible:relative focus-visible:z-10 
          p-[32px] group-data-[state=open]:pb-[16px] bg-background-1 group-data-[state=open]:bg-background-2 hover:bg-background-2 group-data-[state=open]:hover:bg-background-3 
          flex justify-between items-center cursor-pointer"
          >
            <h6>{header}</h6>
            <ChevronDown className="group-data-[state=open]:rotate-180 [transition:200ms_ease-out] flex-shrink-0" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="p-[32px] pt-0 text-base text-foreground-3 bg-background-2">
          {children}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

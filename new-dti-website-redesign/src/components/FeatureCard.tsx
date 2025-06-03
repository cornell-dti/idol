'use client';

import type { ReactNode } from 'react';
import IconWrapper from './IconWrapper';

type FeatureCardProps = {
  title: string;
  body: string;
  icon?: ReactNode;
};

export default function FeatureCard({ title, body, icon }: FeatureCardProps) {
  return (
    <article className="p-4 sm:p-8 max-1/3 flex flex-col gap-4">
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <div className="flex flex-col gap-1">
        <h5>{title}</h5>
        <p className="text-foreground-3">{body}</p>
      </div>
    </article>
  );
}

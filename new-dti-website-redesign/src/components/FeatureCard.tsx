'use client';

import IconWrapper from './IconWrapper';

type FeatureCardProps = {
  title: string;
  body: string;
  children: React.ReactNode;
};

export default function FeatureCard({ title, body, children }: FeatureCardProps) {
  return (
    <div className="p-[32px] min-w-[395px] border border-border-1 flex flex-col">
      <IconWrapper className="icon-wrapper">{children}</IconWrapper>
      <h5 className="text-foreground-1 pt-[16px]">{title}</h5>
      <p className="text-foreground-3">{body}</p>
    </div>
  );
}

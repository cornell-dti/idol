import clsx from 'clsx';
import { CSSProperties, ReactNode } from 'react';

type Props = {
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly children: ReactNode;
};

export default function PageSection({
  className,
  style,
  children
}: Props): JSX.Element {
  return (
    <section className={clsx('page-section', className)} style={style}>
      {children}
    </section>
  );
}

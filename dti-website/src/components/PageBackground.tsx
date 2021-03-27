import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export default function PageBackground({
  children
}: {
  readonly children: ReactNode;
}): JSX.Element {
  const router = useRouter();

  return (
    <div className="page-background">
      <div className="nav-listener" id={router.pathname} />
      {children}
    </div>
  );
}

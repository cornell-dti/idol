import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

export type BreadcrumbTitle = { path: string; label: string };
export const BreadcrumbTitleContext = createContext<(title?: BreadcrumbTitle) => void>(() => {});

/** Reuse the page's loaded title; breadcrumbs never fetch a second copy of its data. */
export function useBreadcrumbTitle(label: string | undefined): void {
  const setTitle = useContext(BreadcrumbTitleContext);
  const { asPath } = useRouter();
  useEffect(() => {
    if (label) setTitle({ path: asPath, label });
    return () => setTitle(undefined);
  }, [asPath, label, setTitle]);
}

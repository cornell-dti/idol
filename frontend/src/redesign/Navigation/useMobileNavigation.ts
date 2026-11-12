import { useEffect, useState } from 'react';

/** Use the redesign's existing compact breakpoint for mobile navigation. */
export default function useMobileNavigation(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return mobile;
}

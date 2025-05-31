import { useEffect } from 'react';

type UseClickOutsideProps = {
  refs: React.RefObject<HTMLElement | null>[];
  ignoredClassNames?: string[];
  onClickOutside: () => void;
};

const useClickOutside = ({
  refs,
  ignoredClassNames = [],
  onClickOutside
}: UseClickOutsideProps) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const clickedInsideIgnoredClass = ignoredClassNames.some(
        (className) =>
          target.classList.contains(className) ||
          target.parentElement?.classList.contains(className)
      );

      const clickedInsideAnyRef = refs.some((ref) => ref.current?.contains(target));

      if (!clickedInsideIgnoredClass && !clickedInsideAnyRef) {
        onClickOutside();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [refs, ignoredClassNames, onClickOutside]);
};

export default useClickOutside;

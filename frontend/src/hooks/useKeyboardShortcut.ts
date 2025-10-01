import { useEffect } from 'react';

interface Modifiers {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

function useKeyboardShortcut(key: string, callback: () => void, modifiers: Modifiers = {}) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const ctrlMatch = modifiers.ctrl ? event.ctrlKey || event.metaKey : true;
      const shiftMatch = modifiers.shift ? event.shiftKey : true;
      const altMatch = modifiers.alt ? event.altKey : true;
      const metaMatch = modifiers.meta ? event.metaKey : true;

      if (ctrlMatch && shiftMatch && altMatch && metaMatch && event.key === key) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
}

export default useKeyboardShortcut;

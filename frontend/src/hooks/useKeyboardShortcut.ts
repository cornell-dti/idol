import { useEffect } from 'react';

interface Modifiers {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

interface Options {
  captureInInputs?: boolean;
}

export function isEditableTarget(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  if (t.closest('[data-hotkeys="ignore"]')) return true;
  if (t.closest('[contenteditable=""], [contenteditable="true"]')) return true;

  const el = t.closest('input, textarea, select') as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  if (!el) return false;

  if (el instanceof HTMLInputElement) {
    const nonText = new Set([
      'checkbox',
      'radio',
      'button',
      'submit',
      'reset',
      'range',
      'color',
      'file',
      'image',
      'hidden'
    ]);
    if (nonText.has(el.type)) return false;
  }

  if ((el as unknown as HTMLInputElement).disabled) return false;
  if ((el as unknown as HTMLInputElement).readOnly) return true;
  return true;
}

function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: Modifiers = {},
  options: Options = {}
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!options.captureInInputs && isEditableTarget(event)) return;

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
  }, [key, callback, modifiers, options]);
}

export default useKeyboardShortcut;

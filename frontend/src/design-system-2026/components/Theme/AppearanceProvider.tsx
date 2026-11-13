import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export const BASE_THEME_OPTIONS = ['light', 'dark', 'auto'] as const;
export const SPECIAL_THEME_OPTIONS = ['pumpkin', 'hacker'] as const;
export const THEME_OPTIONS = [...BASE_THEME_OPTIONS, ...SPECIAL_THEME_OPTIONS] as const;
export const ACCENT_OPTIONS = [
  'black',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green'
] as const;
export type ThemePreference = (typeof THEME_OPTIONS)[number];
export type ResolvedTheme = Exclude<ThemePreference, 'auto'>;
export type Accent = (typeof ACCENT_OPTIONS)[number];
export const isSpecialTheme = (theme: ThemePreference): boolean =>
  SPECIAL_THEME_OPTIONS.some((option) => option === theme);
export const APPEARANCE_STORAGE_KEY = 'idol:appearance';
/** 0–100; 50 is each theme as designed. */
export const DEFAULT_CONTRAST = 50;
const clampContrast = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : DEFAULT_CONTRAST;
export const isDarkTheme = (theme: ResolvedTheme): boolean => theme !== 'light';

type Appearance = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  accent: Accent;
  contrast: number;
  setTheme: (theme: ThemePreference) => void;
  setAccent: (accent: Accent) => void;
  setContrast: (contrast: number) => void;
};
const AppearanceContext = createContext<Appearance>({
  theme: 'auto',
  resolvedTheme: 'light',
  accent: 'blue',
  contrast: DEFAULT_CONTRAST,
  setTheme: () => {},
  setAccent: () => {},
  setContrast: () => {}
});
export const useAppearance = (): Appearance => useContext(AppearanceContext);

export function AppearanceProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [theme, setThemeState] = useState<ThemePreference>('auto');
  const [accent, setAccentState] = useState<Accent>('blue');
  const [contrast, setContrastState] = useState(DEFAULT_CONTRAST);
  const [deviceDark, setDeviceDark] = useState(false);
  const themeRequest = useRef(0);
  useEffect(() => {
    const restore = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? '{}');
        setThemeState(THEME_OPTIONS.includes(saved?.theme) ? saved.theme : 'auto');
        setAccentState(ACCENT_OPTIONS.includes(saved?.accent) ? saved.accent : 'blue');
        setContrastState(clampContrast(saved?.contrast));
      } catch {
        /* Keep working if browser storage is blocked or malformed. */
      }
    };
    restore();
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setDeviceDark(query.matches);
    update();
    query.addEventListener('change', update);
    const sync = (event: StorageEvent) => {
      if (event.key === APPEARANCE_STORAGE_KEY || event.key === null) restore();
    };
    window.addEventListener('storage', sync);
    return () => {
      query.removeEventListener('change', update);
      window.removeEventListener('storage', sync);
    };
  }, []);
  // Contrast is applied on <html> so portals and every nested theme scope pick it up.
  useEffect(() => {
    const { style } = document.documentElement;
    const offset = (contrast - DEFAULT_CONTRAST) * 1.2;
    style.setProperty('--idol-contrast-up', `${Math.max(0, offset)}%`);
    style.setProperty('--idol-contrast-down', `${Math.max(0, -offset)}%`);
  }, [contrast]);
  const persist = (nextTheme: ThemePreference, nextAccent: Accent, nextContrast = contrast) => {
    try {
      localStorage.setItem(
        APPEARANCE_STORAGE_KEY,
        JSON.stringify({ theme: nextTheme, accent: nextAccent, contrast: nextContrast })
      );
    } catch {
      /* The current session can still use the selected appearance. */
    }
  };
  const deviceTheme = deviceDark ? 'dark' : 'light';
  const preferredTheme = theme === 'auto' ? deviceTheme : theme;
  const setTheme = (next: ThemePreference) => {
    const request = themeRequest.current + 1;
    themeRequest.current = request;
    persist(next, accent);
    const nextTheme = next === 'auto' ? deviceTheme : next;

    if (nextTheme === preferredTheme) {
      setThemeState(next);
      return;
    }

    const applyTheme = () => {
      if (request !== themeRequest.current) return;
      const root = document.documentElement;
      root.setAttribute('data-idol-theme-update', '');
      try {
        flushSync(() => setThemeState(next));
        // Resolve the new theme before restoring each component's interaction transitions.
        root.getBoundingClientRect();
      } finally {
        root.removeAttribute('data-idol-theme-update');
      }
    };
    if (
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  };
  return (
    <AppearanceContext.Provider
      value={{
        theme,
        accent,
        contrast,
        resolvedTheme: preferredTheme,
        setTheme,
        setContrast: (next) => {
          const value = clampContrast(next);
          setContrastState(value);
          persist(theme, accent, value);
        },
        setAccent: (next) => {
          if (isSpecialTheme(theme)) return;
          setAccentState(next);
          persist(theme, next);
        }
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

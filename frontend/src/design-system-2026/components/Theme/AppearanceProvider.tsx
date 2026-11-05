import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export const THEME_OPTIONS = ['light', 'dark', 'auto'] as const;
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
export type Accent = (typeof ACCENT_OPTIONS)[number];
export const APPEARANCE_STORAGE_KEY = 'idol:appearance';

type Appearance = {
  theme: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  accent: Accent;
  setTheme: (theme: ThemePreference) => void;
  setAccent: (accent: Accent) => void;
};
const AppearanceContext = createContext<Appearance>({
  theme: 'auto',
  resolvedTheme: 'light',
  accent: 'blue',
  setTheme: () => {},
  setAccent: () => {}
});
export const useAppearance = (): Appearance => useContext(AppearanceContext);

export function AppearanceProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [theme, setThemeState] = useState<ThemePreference>('auto');
  const [accent, setAccentState] = useState<Accent>('blue');
  const [deviceDark, setDeviceDark] = useState(false);
  useEffect(() => {
    const restore = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? '{}');
        setThemeState(THEME_OPTIONS.includes(saved?.theme) ? saved.theme : 'auto');
        setAccentState(ACCENT_OPTIONS.includes(saved?.accent) ? saved.accent : 'blue');
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
  const persist = (nextTheme: ThemePreference, nextAccent: Accent) => {
    try {
      localStorage.setItem(
        APPEARANCE_STORAGE_KEY,
        JSON.stringify({ theme: nextTheme, accent: nextAccent })
      );
    } catch {
      /* The current session can still use the selected appearance. */
    }
  };
  const deviceTheme = deviceDark ? 'dark' : 'light';
  return (
    <AppearanceContext.Provider
      value={{
        theme,
        accent,
        resolvedTheme: theme === 'auto' ? deviceTheme : theme,
        setTheme: (next) => {
          setThemeState(next);
          persist(next, accent);
        },
        setAccent: (next) => {
          setAccentState(next);
          persist(theme, next);
        }
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

import { createContext, HTMLAttributes, useContext } from 'react';
import { Accent, useAppearance } from './AppearanceProvider';

export type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; accent: Accent } | null>(null);
export const useDesignSystemAppearance = (): { theme: Theme; accent: Accent } => {
  const scope = useContext(ThemeContext);
  const appearance = useAppearance();
  return scope ?? { theme: appearance.resolvedTheme, accent: appearance.accent };
};
export const useDesignSystemTheme = (): Theme => useDesignSystemAppearance().theme;
/** Context carries theme and accent into Base UI portals as well as nested scopes. */
export function DesignSystemScope({
  theme,
  children,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & { theme?: Theme }): JSX.Element {
  const inherited = useDesignSystemAppearance();
  const resolved = theme ?? inherited.theme;
  return (
    <ThemeContext.Provider value={{ theme: resolved, accent: inherited.accent }}>
      <div
        {...props}
        style={{ colorScheme: resolved, ...style }}
        data-idol-redesign
        data-idol-theme={resolved}
        data-idol-accent={inherited.accent}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

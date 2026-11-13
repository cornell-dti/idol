import { createContext, HTMLAttributes, useContext } from 'react';
import { Accent, ResolvedTheme, useAppearance } from './AppearanceProvider';

export type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: ResolvedTheme; accent: Accent } | null>(null);
export const useDesignSystemAppearance = (): { theme: ResolvedTheme; accent: Accent } => {
  const scope = useContext(ThemeContext);
  const appearance = useAppearance();
  return scope ?? { theme: appearance.resolvedTheme, accent: appearance.accent };
};
export const useDesignSystemTheme = (): ResolvedTheme => useDesignSystemAppearance().theme;
/** Context carries theme and accent into Base UI portals as well as nested scopes. */
export function DesignSystemScope({
  theme,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { theme?: Theme }): JSX.Element {
  const inherited = useDesignSystemAppearance();
  const resolved = theme ?? inherited.theme;
  return (
    <ThemeContext.Provider value={{ theme: resolved, accent: inherited.accent }}>
      <div
        {...props}
        data-idol-redesign
        data-idol-theme={resolved}
        data-idol-accent={inherited.accent}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

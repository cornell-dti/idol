import { createContext, HTMLAttributes, useContext } from 'react';

export type Theme = 'light' | 'dark';
const ThemeContext = createContext<Theme>('light');
export const useDesignSystemTheme = (): Theme => useContext(ThemeContext);
/** React context keeps token scope available to Base UI portals. */
export function DesignSystemScope({
  theme = 'light',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { theme?: Theme }): JSX.Element {
  return (
    <ThemeContext.Provider value={theme}>
      <div {...props} data-idol-redesign data-idol-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

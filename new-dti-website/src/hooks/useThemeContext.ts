import { createContext, useContext } from 'react';

const ThemeContext = createContext<
  { setFooterTheme: (theme: 'dark' | 'light') => void } | undefined
>(undefined);

const useThemeContext = () => ({ ThemeContext, theme: useContext(ThemeContext) });

export default useThemeContext;

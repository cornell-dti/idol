import { DEFAULT_THEME, MantineThemeOverride, Tuple } from '@mantine/core';

const SITE_THEME: MantineThemeOverride = {
  fontFamily: 'Noto Sans',
  colors: {
    bright: [...DEFAULT_THEME.colors.gray].reverse() as Tuple<string, 10>
  },
  components: {
    ScrollArea: {
      defaultProps: {
        type: 'auto'
      }
    },
    Divider: {
      defaultProps: {
        my: 'md'
      }
    },
    Tooltip: {
      defaultProps: {
        events: { hover: true, focus: true, touch: true },
        withArrow: true
      }
    }
  },
  focusRingStyles: {
    resetStyles: () => ({ outline: 'none' }),
    styles: (theme) => ({
      outlineOffset: 2,
      outline: `2px solid ${theme.colors.blue[theme.colorScheme === 'dark' ? 7 : 5]}`
    }),
    inputStyles: (theme) => ({
      outline: 'none',
      borderColor:
        theme.colors.blue[
          typeof theme.primaryShade === 'object'
            ? theme.primaryShade[theme.colorScheme]
            : theme.primaryShade
        ]
    })
  },
  primaryColor: 'red'
};

export default SITE_THEME;

import {
  Flex,
  NavLink,
  createStyles,
  NavLinkProps,
  DrawerProps,
  Drawer,
  MantineProvider
} from '@mantine/core';

import { useRouter } from 'next/router';
import { Icon } from 'semantic-ui-react';
import { ReactNode } from 'react';
import NextLink from 'next/link';
import { useHasAdminPermission } from '../FirestoreDataProvider';
import SITE_THEME from '../../../theme';

export type NavItem =
  | { kind: 'single'; label: string; link: string; icon: ReactNode }
  | {
      kind: 'many';
      label: string;
      links: { label: string; link: string; icon: ReactNode }[];
      icon: ReactNode;
    };

const Link: React.FC<NavLinkProps & { href: string }> = ({ href, ...props }) => (
  <NextLink href={href} passHref /* legacyBehavior */>
    <NavLink component="a" {...props} />
  </NextLink>
);

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:hover': {
      color: 'currentColor'
    },
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  icon: {
    margin: `${theme.spacing.xs} 0px`
  }
}));
const LayoutNavbar: React.FC<DrawerProps> = (props) => {
  const router = useRouter();
  const hasAdminPermission = useHasAdminPermission();
  const { classes, theme } = useStyles();

  const navItems: NavItem[] = [
    {
      kind: 'single',
      label: 'Home',
      link: '/',
      icon: <Icon name="home" size="large" />
    },
    ...(hasAdminPermission
      ? [
          {
            kind: 'single',
            label: 'Admin',
            link: '/admin',
            icon: <Icon name="shield" size="large" />
          } as NavItem
        ]
      : []),
    {
      kind: 'single',
      label: 'Forms',
      link: '/forms',
      icon: <Icon name="file alternate" size="large" />
    },
    {
      kind: 'single',
      label: 'Candidate Decider',
      link: '/candidate-decider',
      icon: <Icon name="chart bar outline" size="large" />
    }
  ];

  // TODO next link not working

  const links = navItems.map((navItem) => {
    if (navItem.kind === 'many') {
      const manyActive = navItem.links.findIndex(({ link }) => link === router.pathname) !== -1;
      const items = navItem.links.map(({ label, link, icon }) => (
        <Link
          classNames={classes}
          key={label}
          label={label}
          icon={icon}
          active={link === router.pathname}
          href={link}
          variant="light"
        />
      ));

      return (
        <NavLink
          classNames={classes}
          key={navItem.label}
          label={navItem.label}
          icon={navItem.icon}
          active={manyActive}
          variant="light"
          childrenOffset={theme.spacing.lg}
          defaultOpened
        >
          {items}
        </NavLink>
      );
    }

    return (
      <Link
        classNames={classes}
        key={navItem.label}
        label={navItem.label}
        icon={navItem.icon}
        active={navItem.link === router.pathname}
        href={navItem.link}
        variant="light"
      />
    );
  });

  return (
    <MantineProvider theme={{ ...SITE_THEME, colorScheme: 'dark' }}>
      <Drawer {...props}>
        <Flex direction={'column'} gap={0}>
          {links}
        </Flex>
      </Drawer>
    </MantineProvider>
  );
};

export default LayoutNavbar;

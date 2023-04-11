import { Flex, FlexProps, NavLink, Popover, createStyles, NavLinkProps } from '@mantine/core';

import { IconChevronDown } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { Icon } from 'semantic-ui-react';
import { ReactNode } from 'react';
import NextLink from 'next/link';
import { useHasAdminPermission } from '../FirestoreDataProvider';

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

const useStyles = createStyles((theme, { vertical }: { vertical: boolean }) => {
  const backgroundColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0];
  const color = theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9];

  if (vertical) {
    return {
      link: {
        width: '100%',
        '&:hover': {
          color,
          background: backgroundColor
        }
      },
      dropDown: {},
      dropDownItem: {},
      rightSection: {}
    };
  }
  return {
    link: {
      borderRadius: theme.radius.sm,
      width: 'fit-content',
      '&:hover': {
        color,
        background: backgroundColor
      }
    },
    dropDown: { padding: 4 },
    dropDownItem: {
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      width: '100%'
    },
    rightSection: { marginLeft: 5 }
  };
});

export interface LayoutNavbarProps extends FlexProps {
  vertical: boolean;
}

const LayoutNavbar: React.FC<LayoutNavbarProps> = ({ vertical, ...flexProps }) => {
  const router = useRouter();
  const hasAdminPermission = useHasAdminPermission();
  const { classes, theme, cx } = useStyles({ vertical });

  const navItems: NavItem[] = [
    {
      kind: 'single',
      label: 'Home',
      link: '/',
      icon: <Icon name="home" />
    },
    ...(hasAdminPermission
      ? [
          {
            kind: 'single',
            label: 'Admin',
            link: '/admin',
            icon: <Icon name="shield" />
          } as NavItem
        ]
      : []),
    {
      kind: 'single',
      label: 'Forms',
      link: '/forms',
      icon: <Icon name="file alternate" />
    },
    {
      kind: 'single',
      label: 'Candidate Decider',
      link: '/candidate-decider',
      icon: <Icon name="chart bar outline" />
    },
    {
      kind: 'many',
      label: 'Old',
      icon: <Icon name="home" />,
      links: [
        {
          label: 'Sub link 1',
          link: '/404',
          icon: <Icon name="home" />
        },
        {
          label: 'Sub link 2',
          link: '/500',
          icon: <Icon name="home" />
        }
      ]
    }
  ];

  // TODO next link not working

  const links = navItems.map((navItem) => {
    if (navItem.kind === 'many') {
      const manyActive = navItem.links.findIndex(({ link }) => link === router.pathname) !== -1;
      const items = navItem.links.map(({ label, link, icon }) => (
        <Link
          key={label}
          label={label}
          icon={icon}
          active={link === router.pathname}
          className={cx(classes.link, classes.dropDownItem)}
          href={link}
          variant="outline"
        />
      ));

      if (vertical) {
        return (
          <NavLink
            key={navItem.label}
            label={navItem.label}
            icon={navItem.icon}
            active={manyActive}
            variant="subtle"
            childrenOffset={theme.spacing.lg}
            defaultOpened
            className={classes.link}
          >
            {items}
          </NavLink>
        );
      }

      return (
        <Popover key={navItem.label}>
          <Popover.Target>
            <NavLink
              key={navItem.label}
              label={navItem.label}
              icon={navItem.icon}
              active={manyActive}
              rightSection={<IconChevronDown />}
              variant="subtle"
              className={classes.link}
              classNames={{ rightSection: classes.rightSection }}
            />
          </Popover.Target>
          <Popover.Dropdown className={classes.dropDown}>{items}</Popover.Dropdown>
        </Popover>
      );
    }

    return (
      <Link
        key={navItem.label}
        label={navItem.label}
        icon={navItem.icon}
        className={classes.link}
        active={navItem.link === router.pathname}
        href={navItem.link}
        variant="outline"
      />
    );
  });

  return (
    <Flex direction={vertical ? 'column' : 'row'} gap={vertical ? 0 : 5} {...flexProps}>
      {links}
    </Flex>
  );
};

export default LayoutNavbar;

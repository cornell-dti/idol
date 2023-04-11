import {
  Avatar,
  Burger,
  Container,
  Group,
  Header,
  HeaderProps,
  MediaQuery,
  Text,
  createStyles,
  MantineNumberSize
} from '@mantine/core';

import LayoutNavbar from './Navbar';
import Auth from './Auth';

export const LOGO_URL = '/dti-logo.png';
export const TITLE = 'IDOL';
export const MOBILE_BREAKPOINT: MantineNumberSize = 'sm';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%'
  },

  hiddenMobile: {
    [theme.fn.smallerThan(MOBILE_BREAKPOINT)]: {
      display: 'none'
    }
  },

  hiddenDesktop: {
    [theme.fn.largerThan(MOBILE_BREAKPOINT)]: {
      display: 'none'
    }
  },

  title: { color: theme.primaryColor }
}));

export interface LayoutHeaderProps extends Omit<HeaderProps, 'children'> {
  opened: boolean;
  toggleOpened: () => void;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({ opened, toggleOpened, ...props }) => {
  const { classes } = useStyles();

  return (
    <Header {...props}>
      <Container className={classes.inner} size="xl">
        <Group spacing="xs">
          <Burger
            opened={opened}
            size="md"
            onClick={toggleOpened}
            className={classes.hiddenDesktop}
          />
          <Avatar src={LOGO_URL} size="md" alt={TITLE} />
          <Text fz="xl" fw="bold">
            {TITLE}
          </Text>

          <LayoutNavbar className={classes.hiddenMobile} vertical={false} />
        </Group>

        <MediaQuery smallerThan={MOBILE_BREAKPOINT} styles={{ display: 'none' }}>
          <Auth spacing="sm" />
        </MediaQuery>

        <MediaQuery largerThan={MOBILE_BREAKPOINT} styles={{ display: 'none' }}>
          {opened ? <></> : <Auth spacing="sm" hideButtons={true} />}
        </MediaQuery>
      </Container>
    </Header>
  );
};

export default LayoutHeader;

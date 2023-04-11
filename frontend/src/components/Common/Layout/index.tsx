import { AppShell, Container, MediaQuery, createStyles, rem, Box } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Header, { MOBILE_BREAKPOINT } from './Header';
import Sidebar from './Sidebar';

export const HEADER_HEIGHT = rem(60);
export const MIN_SIZE = 300;

export enum Show {
  Contained,
  Free,
  None
}

const useStyles = createStyles((theme, { show }: { show: Show }) => ({
  bound: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]
  }
}));
export interface LayoutProps {
  children: React.ReactNode;
  show?: Show;
}

export const Layout: React.FC<LayoutProps> = ({ children, show = Show.Contained }) => {
  const router = useRouter();
  const { classes } = useStyles({ show });
  const [opened, setOpened] = useState(false);

  const toggleOpened = () => {
    setOpened(!opened);
  };

  useEffect(() => {
    setOpened(false);
  }, [router.pathname]);

  return (
    <Box className={classes.bound}>
      <AppShell
        hidden={show === Show.None}
        navbar={
          <MediaQuery largerThan={MOBILE_BREAKPOINT} styles={{ display: 'none' }}>
            <Sidebar hidden={!opened} fixed={true} />
          </MediaQuery>
        }
        header={
          <Header height={HEADER_HEIGHT} fixed={true} opened={opened} toggleOpened={toggleOpened} />
        }
        padding={0}
      >
        {show === Show.Contained ? (
          <Container size="lg" p="md">
            {children}
          </Container>
        ) : (
          <>{children}</>
        )}
      </AppShell>
    </Box>
  );
};

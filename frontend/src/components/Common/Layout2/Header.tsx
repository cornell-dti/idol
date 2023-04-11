import {
  Avatar,
  Burger,
  Container,
  Group,
  Header,
  HeaderProps,
  Text,
  createStyles
} from '@mantine/core';

import Auth from './Auth';

const LOGO_URL = '/dti-logo.png';
const TITLE = 'IDOL';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    background: theme.colors.gray[1],
    boxShadow: theme.shadows.md
  }
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
          <Burger opened={opened} size="md" onClick={toggleOpened} />
          <Avatar src={LOGO_URL} size="md" alt={TITLE} />
          <Text fz="xl" fw="bold">
            {TITLE}
          </Text>
        </Group>

        <Auth spacing="sm" />
      </Container>
    </Header>
  );
};

export default LayoutHeader;

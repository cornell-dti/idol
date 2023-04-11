import { Container, createStyles, rem, Box } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Emitters } from '../../../utils';
import ErrorModal from '../../Modals/ErrorModal';
import SuccessModal from '../../Modals/SuccessModal';

import Header from './Header';
import LayoutNavbar from './Navbar';

export const HEADER_HEIGHT = rem(70);
export const MIN_SIZE = 300;

const useStyles = createStyles((theme) => ({
  bound: {
    background: 'white'
  },
  headerOffset: {
    marginTop: HEADER_HEIGHT
  }
}));

export const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const cb = (isOpen: boolean) => {
      setOpened(isOpen);
    };
    Emitters.navOpenEmitter.subscribe(cb);
    return () => {
      Emitters.navOpenEmitter.unsubscribe(cb);
    };
  });

  const toggleOpened = () => {
    setOpened(!opened);
  };

  const handleClose = () => {
    setOpened(false);
  };

  useEffect(() => {
    setOpened(false);
  }, [router.pathname]);

  return (
    <Box className={classes.bound}>
      <ErrorModal onEmitter={Emitters.generalError}></ErrorModal>
      <ErrorModal onEmitter={Emitters.userEditError}></ErrorModal>
      <SuccessModal onEmitter={Emitters.generalSuccess}></SuccessModal>
      <Header height={HEADER_HEIGHT} fixed={true} opened={opened} toggleOpened={toggleOpened} />
      <LayoutNavbar
        opened={opened}
        onClose={handleClose}
        size={170}
        padding={0}
        lockScroll={false}
        withCloseButton={false}
        classNames={{ content: classes.headerOffset }}
      />
      <Container size="lg" p="md" className={classes.headerOffset}>
        {children}
      </Container>
    </Box>
  );
};

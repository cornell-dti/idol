import { Divider, Navbar, NavbarProps, ScrollArea } from '@mantine/core';

import LayoutNavbar from './Navbar';
import Auth from './Auth';

const Sidebar: React.FC<Omit<NavbarProps, 'children'>> = (props) => (
  <Navbar p="md" {...props}>
    <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
      <LayoutNavbar vertical={true} />
    </Navbar.Section>

    <Navbar.Section>
      <Divider my="sm" />
      <Auth grow position="apart" px="md" />
    </Navbar.Section>
  </Navbar>
);
export default Sidebar;

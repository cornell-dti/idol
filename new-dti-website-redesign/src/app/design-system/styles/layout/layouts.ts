// Based off of Figma design system
// https://www.figma.com/design/ttAGEX3pHmzuhMzp8uAyhz/SP25-Cornelldti.org-Website-Revamp?node-id=1336-16568&m=dev

const layouts = [
  {
    title: 'Wide desktop (> 1440px)',
    width: 1800,
    height: 1200,
    lines: 5, // 5 lines so 4 actual columns
    description:
      'Used for very wide screens. Has minimum of 128px horizontal padding, and main content has a maximum width of 1184px.',
    image: '/design-system/layouts/wide.png',
    alt: ''
  },
  {
    title: 'Regular desktop + tablet (480px to 1440px)',
    width: 700,
    height: 498,
    lines: 5,
    description: 'Default layout for most laptop and tablet devices. Has 32px horizontal padding.',
    image: '/design-system/layouts/regular.png',
    alt: ''
  },

  {
    title: 'Mobile (< 480px)',
    width: 200,
    height: 352,
    lines: 3,
    description: 'Typical breakpoint for mobile layouts. Has 16px side padding.',
    image: '/design-system/layouts/mobile.png',
    alt: ''
  }
];
export default layouts;

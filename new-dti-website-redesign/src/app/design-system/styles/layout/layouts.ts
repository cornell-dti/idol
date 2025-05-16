// Based off of Figma design system
// https://www.figma.com/design/ttAGEX3pHmzuhMzp8uAyhz/SP25-Cornelldti.org-Website-Revamp?node-id=1336-16568&m=dev

const layouts = [
  {
    title: 'Wide desktop (1800px)',
    width: 1800,
    height: 1024,
    lines: 5 // 5 lines so 4 actual columns
  },
  {
    title: 'Regular desktop (1440px)',
    width: 1440,
    height: 1024,
    lines: 5
  },
  {
    title: 'Tablet (768px)',
    width: 768,
    height: 1024,
    lines: 3 // 3 lines so 2 actual columns
  },
  {
    title: 'Mobile (390px)',
    width: 390,
    height: 844,
    lines: 3
  }
];
export default layouts;

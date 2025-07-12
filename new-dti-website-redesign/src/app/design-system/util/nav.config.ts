export type NavItem = {
  thumbnail: string;
  href: string;
  label: string;
  description: string;
};

export type NavGroup = {
  category: string | null;
  items: NavItem[];
};

const navItems: NavGroup[] = [
  {
    category: null,
    items: [
      {
        thumbnail: '/design-system/thumbnails/introduction.png',
        href: '/design-system',
        label: 'Introduction',
        description: "Design system for the Digital Tech & Innovation's website"
      }
    ]
  },
  {
    category: 'Styles',
    items: [
      {
        thumbnail: '/design-system/thumbnails/color.png',
        href: '/design-system/styles/color',
        label: 'Color',
        description: 'Guidelines for using color across the website.'
      },
      {
        thumbnail: '/design-system/thumbnails/layout.png',
        href: '/design-system/styles/layout',
        label: 'Layout',
        description: 'Structure, spacing, and responsive design rules.'
      },
      {
        thumbnail: '/design-system/thumbnails/typography.png',
        href: '/design-system/styles/typography',
        label: 'Typography',
        description: 'Fonts, sizing, and best practices for readable UI text.'
      }
    ]
  },
  {
    category: 'Components',
    items: [
      {
        thumbnail: '/design-system/thumbnails/accordion.png',
        href: '/design-system/components/accordion',
        label: 'Accordion',
        description: 'Expandable panels to show and hide content efficiently.'
      },
      {
        thumbnail: '/design-system/thumbnails/button.png',
        href: '/design-system/components/button',
        label: 'Button',
        description: 'Clickable elements to perform actions or navigate.'
      },
      {
        thumbnail: '/design-system/thumbnails/card.png',
        href: '/design-system/components/card',
        label: 'Card',
        description: 'Container for grouping related information and media.'
      },
      {
        thumbnail: '/design-system/thumbnails/chip.png',
        href: '/design-system/components/chip',
        label: 'Chip',
        description: 'Compact element to display a particular note or status.'
      },
      {
        thumbnail: '/design-system/thumbnails/icon.png',
        href: '/design-system/components/icon',
        label: 'Icon',
        description: 'Scalable vector graphics to enhance visual meaning.'
      },
      {
        thumbnail: '/design-system/thumbnails/icon-wrapper.png',
        href: '/design-system/components/icon-wrapper',
        label: 'Icon Wrapper',
        description: 'Stylized wrapped for displaying icons consistently.'
      },
      {
        thumbnail: '/design-system/thumbnails/input.png',
        href: '/design-system/components/input',
        label: 'Input',
        description: 'Field for retrieving text input from a user.'
      },
      {
        thumbnail: '/design-system/thumbnails/logo-box.png',
        href: '/design-system/components/logo-box',
        label: 'Logo Box',
        description: 'Stylized wrapped for displaying logos consistently.'
      },
      {
        thumbnail: '/design-system/thumbnails/tabs.png',
        href: '/design-system/components/tabs',
        label: 'Tabs',
        description: 'Switch between views while keeping context visible.'
      }
    ]
  },
  {
    category: 'Page sections',
    items: [
      {
        thumbnail: '/design-system/thumbnails/cta.png',
        href: '/design-system/page-sections/cta',
        label: 'CTA',
        description: 'Call-to-action blocks that drive user engagement.'
      },
      {
        thumbnail: '/design-system/thumbnails/feature.png',
        href: '/design-system/page-sections/feature',
        label: 'Feature',
        description: 'Highlight a particular topic in a structured layout.'
      },
      {
        thumbnail: '/design-system/thumbnails/footer.png',
        href: '/design-system/page-sections/footer',
        label: 'Footer',
        description: 'Bottom section on page containing links and info.'
      },
      {
        thumbnail: '/design-system/thumbnails/hero.png',
        href: '/design-system/page-sections/hero',
        label: 'Hero',
        description: 'Top section on page with key message.'
      },
      {
        thumbnail: '/design-system/thumbnails/navbar.png',
        href: '/design-system/page-sections/navbar',
        label: 'Navbar',
        description: 'Navigation bar for browsing through website.'
      },
      {
        thumbnail: '/design-system/thumbnails/section-sep.png',
        href: '/design-system/page-sections/section-sep',
        label: 'Section separator',
        description: 'Visual divider to separate content sections.'
      },
      {
        thumbnail: '/design-system/thumbnails/section-title.png',
        href: '/design-system/page-sections/section-title',
        label: 'Section title',
        description: 'Consistent headings to label major content areas.'
      }
    ]
  }
];

export default navItems;

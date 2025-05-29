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
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system',
        label: 'Introduction',
        description: 'Overview of the design system.'
      }
    ]
  },
  {
    category: 'Styles',
    items: [
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/styles/color',
        label: 'Color',
        description: 'Color description blah.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/styles/typography',
        label: 'Typography',
        description: 'Typography description blah.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/styles/layout',
        label: 'Layout',
        description: 'Layout description blah.'
      }
    ]
  },
  {
    category: 'Components',
    items: [
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/components/button',
        label: 'Button',
        description: 'Buttons description bruh.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/components/input',
        label: 'Input',
        description: 'Input description bruh.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/components/card',
        label: 'Card',
        description: 'Card description bruh.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/components/chip',
        label: 'Chip',
        description: 'Chip description bruh.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/components/icon',
        label: 'Icon',
        description: 'Icon description bruh.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/components/icon-wrapper',
        label: 'Icon wrapper',
        description: 'Icon wrapper description bruh.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/components/tabs',
        label: 'Tabs',
        description: 'Tabs description bruh.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/components/logo-box',
        label: 'Logo box',
        description: 'Logo box description bruh.'
      }
    ]
  },
  {
    category: 'Page sections',
    items: [
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/page-sections/hero',
        label: 'Hero',
        description: 'Hero description blah.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/page-sections/feature-section',
        label: 'Feature section',
        description: 'Feature Section description blah.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/page-sections/cta-section',
        label: 'CTA section',
        description: 'CTA section description blah.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/page-sections/footer',
        label: 'Footer',
        description: 'Footer description blah.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/page-sections/section-title',
        label: 'Section title',
        description: 'Section title description blah.'
      },
      {
        thumbnail: '/design-system/thumb.jpg',
        href: '/design-system/page-sections/section-sep',
        label: 'Section separator',
        description: 'Section separator description blah.'
      }
    ]
  }
];

export default navItems;

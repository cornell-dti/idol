const colors = [
  {
    type: 'Background',
    description: 'Used for surfaces like pages, cards, and containers.',
    items: [
      {
        name: 'Background-1',
        variable: '--background-1',
        description: 'Default surface background, typically the main page color.'
      },
      {
        name: 'Background-2',
        variable: '--background-2',
        description: 'Secondary background for elevated surfaces or hover states.'
      },
      {
        name: 'Background-3',
        variable: '--background-3',
        description:
          'Tertiary background for the highest elevated surfaces and for nested hover states.'
      }
    ]
  },
  {
    type: 'Foreground',
    description: 'Used for text, icons, and visual emphasis.',
    items: [
      {
        name: 'Foreground-1',
        variable: '--foreground-1',
        description: 'Used for default text color and for CTA actions.'
      },
      {
        name: 'Foreground-2',
        variable: '--foreground-2',
        description: 'Intermediate color used for edge cases or for just a bit of emphasis.'
      },
      {
        name: 'Foreground-3',
        variable: '--foreground-3',
        description: 'Used for secondary text color.'
      }
    ]
  },
  {
    type: 'Border',
    description: 'Used for dividing, outlining, and framing UI elements.',
    items: [
      {
        name: 'Border-1',
        variable: '--border-1',
        description: 'Used for default border or outline color.'
      },
      {
        name: 'Border-2',
        variable: '--border-2',
        description: 'Used for secondary border colors.'
      }
    ]
  },
  {
    type: 'Accent',
    description: 'Used for team brand colors and highlights.',
    items: [
      {
        name: 'Accent-Red',
        variable: '--accent-red',
        description: 'General DTI/full team accent color.'
      },
      {
        name: 'Accent-Pink',
        variable: '--accent-pink',
        description: 'Leads team accent color.'
      },
      {
        name: 'Accent-Green',
        variable: '--accent-green',
        description: 'Development team accent color.'
      },
      {
        name: 'Accent-Blue',
        variable: '--accent-blue',
        description: 'Design team accent color.'
      },
      {
        name: 'Accent-Yellow',
        variable: '--accent-yellow',
        description: 'Business team accent color.'
      },
      {
        name: 'Accent-Purple',
        variable: '--accent-purple',
        description: 'Product team accent color.'
      }
    ]
  }
];

export default colors;

const typographyStyles = [
  // Headings
  {
    type: 'Heading',
    html: 'h1',
    context: 'desktop',
    label: 'H1 Desktop'
  },
  {
    type: 'Heading',
    html: 'h1',
    context: 'mobile',
    label: 'H1 Mobile'
  },
  {
    type: 'Heading',
    html: 'h2',
    context: 'desktop',
    label: 'H2 Desktop'
  },
  {
    type: 'Heading',
    html: 'h2',
    context: 'mobile',
    label: 'H2 Mobile'
  },
  {
    type: 'Heading',
    html: 'h3',
    context: 'desktop',
    label: 'H3 Desktop'
  },
  {
    type: 'Heading',
    html: 'h3',
    context: 'mobile',
    label: 'H3 Mobile'
  },
  {
    type: 'Heading',
    html: 'h4',
    context: 'default',
    label: 'H4'
  },
  {
    type: 'Heading',
    html: 'h5',
    context: 'default',
    label: 'H5'
  },
  {
    type: 'Heading',
    html: 'h6',
    context: 'default',
    label: 'H6'
  },

  // Body
  {
    type: 'Body',
    variant: 'body',
    html: 'p',
    context: 'default',
    label: 'Body Default'
  },
  {
    type: 'Body',
    variant: 'body',
    html: 'p',
    context: 'small',
    label: 'Body Small'
  },

  // Caps
  {
    type: 'Body',
    variant: 'caps',
    html: 'p',
    context: 'default',
    label: 'Caps Default',
    transform: 'uppercase'
  },
  {
    type: 'Body',
    variant: 'caps',
    html: 'p',
    context: 'small',
    label: 'Caps Small',
    transform: 'uppercase'
  }
];

export default typographyStyles;

export const getGeneralRole = (role: Role): GeneralRole => {
  switch (role) {
    case 'ops-lead':
      return 'lead';
    case 'product-lead':
      return 'lead';
    case 'dev-lead':
      return 'lead';
    case 'design-lead':
      return 'lead';
    case 'business-lead':
      return 'lead';
    case 'tpm':
      return 'developer';
    case 'apm':
      return 'pm';
    case 'pm-advisor':
      return 'pm';
    case 'dev-advisor':
      return 'developer';
    case 'design-advisor':
      return 'designer';
    case 'business-advisor':
      return 'business';
    default:
      return role;
  }
};

export const getColorClass = (
  role: Role,
  transparent: boolean = false,
  prependVar: boolean = false,
  prefix: string = 'accent'
): string => {
  const generalRole = getGeneralRole(role);
  const colors: { [key in GeneralRole]: string } = {
    lead: 'red',
    pm: 'purple',
    developer: 'green',
    designer: 'blue',
    business: 'yellow'
  };
  const color = colors[generalRole];
  const transparentAppend = transparent ? '-transparent' : '';
  if (prependVar) {
    return `var(--accent-${color}${transparentAppend})`;
  }
  return `${prefix}-${color}${transparentAppend}`;
};

export const productLinks: { [key: string]: { name: string; link: string } } = {
  courseplan: {
    name: 'CoursePlan',
    link: 'https://courseplan.io/'
  },
  reviews: {
    name: 'CUReviews',
    link: 'https://www.cureviews.org/'
  },
  queuemein: {
    name: 'Queue Me In',
    link: 'https://queueme.in/'
  },
  cuapts: {
    name: 'CU Apts',
    link: 'https://www.cuapts.org/'
  },
  idol: {
    name: 'IDOL',
    link: 'https://www.cornelldti.org'
  },
  cornellgo: {
    name: 'Cornell GO',
    link: ''
  },
  carriage: {
    name: 'Carriage',
    link: ''
  },
  leads: {
    name: 'Lead',
    link: ''
  },
  business: {
    name: 'Business',
    link: ''
  },
  curaise: {
    name: 'CU Raise',
    link: ''
  },
  zing: {
    name: 'Zing',
    link: 'https://zing-lsc-prod.web.app/'
  },
  dac: {
    name: 'Design @ Cornell',
    link: 'https://www.cudesign.io/'
  }
};

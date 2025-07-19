import * as Icons from '../../../../components/icons';

const icons = Object.entries(Icons).map(([key, Component]) => ({
  label: key.replace('Icon', ''),
  svg: <Component />
}));

export default icons;

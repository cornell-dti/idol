import loop from '../../../new-dti-website-redesign/public/products/logos/loop.svg';
import curaise from '../../../new-dti-website-redesign/public/products/logos/curaise.svg';
import cornellgo from '../../../new-dti-website-redesign/public/products/logos/cornellgo.svg';
import cuapts from '../../../new-dti-website-redesign/public/products/logos/cuapts.svg';
import cureviews from '../../../new-dti-website-redesign/public/products/logos/cureviews.svg';
import courseplan from '../../../new-dti-website-redesign/public/products/logos/courseplan.svg';
import queuemein from '../../../new-dti-website-redesign/public/products/logos/queuemein.svg';
import zing from '../../../new-dti-website-redesign/public/products/logos/zing.svg';
import redi from '../../../new-dti-website-redesign/public/products/logos/redi.svg';
import carriage from '../../../new-dti-website-redesign/public/products/logos/carriage.svg';
import designatcornell from '../../../new-dti-website-redesign/public/products/logos/design@cornell.svg';

// Shared with the DTI website; Next emits these assets for this app too.
const productLogos: Record<string, string> = {
  loop: loop.src,
  curaise: curaise.src,
  cornellgo: cornellgo.src,
  cuapts: cuapts.src,
  cureviews: cureviews.src,
  courseplan: courseplan.src,
  queuemein: queuemein.src,
  zing: zing.src,
  redi: redi.src,
  carriage: carriage.src,
  designatcornell: designatcornell.src,
  idol: '/design-system/figma/idol-logo.png'
};

export default productLogos;

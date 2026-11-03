import productData from './products.json';
import logos from './logos.json';

export const activeProducts = productData.filter((product) => !product.archived);
export const archivedProducts = productData.filter((product) => product.archived);
export const products = [...activeProducts, ...archivedProducts];

// Follow the same order as the product navigation and detail sections.
export const activeLogos = activeProducts.flatMap((product) =>
  logos.filter((logo) => logo.href.split('#')[1] === product.id)
);

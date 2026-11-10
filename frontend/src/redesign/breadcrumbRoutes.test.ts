/** @jest-environment node */

import { readdirSync } from 'fs';
import { join } from 'path';
import getBreadcrumbs from './breadcrumbRoutes';

const pageExtension = /\.(?:js|jsx|ts|tsx)$/;
const nextSpecialPage = /^\/_(?:app|document|error)$/;

function findPageRoutes(directory: string, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const route = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      return route === '/api' ? [] : findPageRoutes(join(directory, entry.name), route);
    }
    if (!entry.isFile() || !pageExtension.test(entry.name) || entry.name.endsWith('.d.ts')) {
      return [];
    }
    const pathname = route.replace(pageExtension, '').replace(/\/index$/, '') || '/';
    return nextSpecialPage.test(pathname) ? [] : [pathname];
  });
}

test('every Next.js page has a breadcrumb label', () => {
  const pages = findPageRoutes(join(__dirname, '../pages'));
  const routesUsingFallback = pages
    .filter((pathname) => getBreadcrumbs(pathname, pathname).some(({ label }) => label === 'Page'))
    .sort();

  expect(routesUsingFallback).toEqual([]);
});

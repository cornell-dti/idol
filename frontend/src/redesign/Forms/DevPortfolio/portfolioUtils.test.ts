import { isGithubLink, validateDraft, PortfolioDraft } from './portfolioUtils';

const now = Date.UTC(2026, 10, 13);
const portfolio = {
  uuid: 'p',
  name: 'Portfolio 5',
  earliestValidDate: now - 1000,
  deadline: now + 1000
} as DevPortfolioInfo;
const draft = (overrides: Partial<PortfolioDraft> = {}): PortfolioDraft => ({
  opened: ['https://github.com/cornell-dti/idol/pull/1237'],
  reviewed: ['https://github.com/cornell-dti/idol/pull/1238'],
  other: [],
  documentation: 'Added tests',
  explanation: '',
  submitRepo: false,
  ...overrides
});

test.each([
  'https://github.com/cornell-dti/idol/pull/1237',
  'https://github.com/cornell-dti/idol/pull/1237/',
  'https://github.com/cornell-dti/idol/pull/1237/files',
  'https://github.com/cornell-dti/idol/pull/1237#issuecomment-1',
  'https://www.github.com/cornell-dti/idol/pull/1237',
  'http://github.com/cornell-dti/idol/pull/1237',
  'github.com/cornell-dti/idol/pull/1237'
])('accepts PR link %s', (link) => {
  expect(isGithubLink(link)).toBe(true);
});

test.each([
  'https://github.com/cornell-dti/idol',
  'https://github.com/cornell-dti/idol/issues/12',
  'https://gitlab.com/cornell-dti/idol/pull/12',
  'not a link'
])('rejects non-PR link %s', (link) => {
  expect(isGithubLink(link)).toBe(false);
});

test('repository submissions take a repository link', () => {
  expect(isGithubLink('https://github.com/clementroze/portfolio', true)).toBe(true);
  expect(isGithubLink('https://github.com/clementroze/portfolio/pull/1', true)).toBe(false);
});

test('a complete draft validates', () => {
  expect(validateDraft(draft(), 'developer', portfolio, now)).toBeUndefined();
  expect(
    validateDraft(
      draft({ opened: ['https://github.com/cornell-dti/idol/pull/1237/files'] }),
      'developer',
      portfolio,
      now
    )
  ).toBeUndefined();
});

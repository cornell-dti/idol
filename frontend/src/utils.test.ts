import { formatLink } from './utils';

describe('formatLink', () => {
  test('Formats LinkedIn links correctly', () => {
    expect(formatLink('linkedin.com/in/jujulcrane', 'linkedin')).toEqual(
      'https://linkedin.com/in/jujulcrane'
    );
    expect(formatLink('www.linkedin.com/in/jujulcrane', 'linkedin')).toEqual(
      'https://www.linkedin.com/in/jujulcrane'
    );
    expect(formatLink('https://linkedin.com/in/jujulcrane', 'linkedin')).toEqual(
      'https://linkedin.com/in/jujulcrane'
    );
  });

  test('Formats GitHub links correctly', () => {
    expect(formatLink('https://github.com/jujulcrane', 'github')).toEqual(
      'https://github.com/jujulcrane'
    );
    expect(formatLink('github.com/jujulcrane', 'github')).toEqual('https://github.com/jujulcrane');
  });

  test('Handles malformed inputs correctly', () => {
    expect(formatLink('www.github.com/jujulcrane.', 'github')).toEqual(
      'https://www.github.com/jujulcrane'
    );
    expect(formatLink('linkedin jujulcrane', 'linkedin')).toBeUndefined();
  });

  test('Handles multiple matches correctly', () => {
    expect(
      formatLink(
        'Visit my profiles: https://linkedin.com/in/jujulcrane and https://github.com/jujulcrane',
        'linkedin'
      )
    ).toBeUndefined();
  });

  test('Handles raw usernames correctly', () => {
    expect(formatLink('jujulcrane', 'linkedin')).toEqual('https://www.linkedin.com/in/jujulcrane');
    expect(formatLink('jujulcrane', 'github')).toEqual('https://github.com/jujulcrane');
  });

  test('Extracts non-specific links correctly', () => {
    expect(formatLink('Look at my awesome website https://en.wikipedia.org/wiki/Cat!!')).toEqual(
      'https://en.wikipedia.org/wiki/Cat'
    );
  });
});

const babelJestPath = require.resolve('babel-jest');
const identityObjectProxyPath = require.resolve('identity-obj-proxy');

module.exports = {
  projects: ['<rootDir>/frontend/*', '<rootDir>/backend/*'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': babelJestPath
  },
  transformIgnorePatterns: [
    `/node_modules/(?!(lib-react)).+\\.js$`,
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': identityObjectProxyPath,
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp)$': `<rootDir>/__mocks__/fileMock.js`
  }
};

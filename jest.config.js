module.exports = {
  projects: [
    {
      displayName: 'IDOL Frontend Tests',
      testMatch: ['<rootDir>/frontend/**/*.test.(ts|tsx)'],
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],
      testEnvironment: 'jsdom',
      setupFiles: ['frontend/src/setup.ts'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
      },
      transformIgnorePatterns: [
        `/node_modules/(?!(lib-react)).+\\.js$`,
        '^.+\\.module\\.(css|sass|scss)$'
      ],
      moduleNameMapper: {
        // Handle CSS imports (with CSS modules)
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        // Handle CSS imports (without CSS modules)
        '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
        // Handle image imports
        '^.+\\.(jpg|jpeg|png|gif|webp)$': `<rootDir>/__mocks__/fileMock.js`
      }
    },
    {
      displayName: 'IDOL Backend Tests',
      testMatch: ['<rootDir>/**/*.test.ts'],
      transform: {
        '^.+\\.(js|ts|tsx)$': 'babel-jest'
      },
      setupFiles: ['backend/tests/setup.ts'],
      rootDir: '<rootDir>/backend/'
    }
  ]
};

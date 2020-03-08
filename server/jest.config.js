module.exports = {
  rootDir: '.',
  moduleFileExtensions: ['js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/../jest/server-setup.js'],
  testURL: 'http://localhost',
  testEnvironment: 'node',
  transform: {},
  collectCoverage: true,
  coverageReporters: ['text-summary'],
  coverageThreshold: {
    global: {
      statements: 50,
      functions: 20,
      lines: 55,
      branches: 0,
    },
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
};

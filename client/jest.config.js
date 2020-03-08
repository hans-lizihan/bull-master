module.exports = {
  verbose: true,
  rootDir: '.',
  moduleFileExtensions: ['jsx', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/../jest/client-setup.js'],
  testURL: 'http://localhost',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '^.*\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  coveragePathIgnorePatterns: ['<rootDir>/index.jsx', '<rootDir>/polyfill.js'],
  collectCoverage: true,
  coverageReporters: ['text-summary'],
  coverageThreshold: {
    global: {
      lines: 70,
    },
  },
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'], // Adjust the path to match your test directory
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
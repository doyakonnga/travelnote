import type { Config } from 'jest'

// const baseDir = '<rootDir>/src/';
// const baseTestDir = '<rootDir>/__test';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['./test/setup-test.ts'],
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   `${baseDir}/**/*.ts`
  // ],
  // testMatch: [
  //   `${baseTestDir}/**/*.ts`
  // ]
}

export default config
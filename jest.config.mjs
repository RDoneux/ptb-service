/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  reporters: ['default', 'jest-junit'],
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
};

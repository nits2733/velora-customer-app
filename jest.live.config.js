/**
 * Plain Node environment for src/__live__, so the tests use Node's real fetch, FormData and Blob
 * (jest-expo replaces fetch with React Native's XHR shim). Run with `npm run test:live`.
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/__live__/**/*.live.test.ts'],
  transform: { '\.[jt]sx?$': ['babel-jest', { presets: ['babel-preset-expo'] }] },
  // babel-preset-expo adds an ESM import of expo/virtual/env, which has to be compiled too.
  transformIgnorePatterns: ['/node_modules/(?!expo/virtual/)'],
  globals: { __DEV__: true },
  moduleNameMapper: {
    '^react-native$': '<rootDir>/src/__live__/stubs/react-native.js',
    '^expo-constants$': '<rootDir>/src/__live__/stubs/expo-constants.js',
    '^expo-secure-store$': '<rootDir>/src/__live__/stubs/expo-secure-store.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

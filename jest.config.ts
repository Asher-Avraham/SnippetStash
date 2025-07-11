
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '**/src/**/*.test.tsx',
  ],
};

module.exports = {
    roots: ["<rootDir>/tests"],
    testMatch: [
    "**/tests/**/*.+(ts)",
    "**/?(*.)+(spec|test).+(ts)",
  ],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000
  };
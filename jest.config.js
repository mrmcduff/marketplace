
module.exports = {
	globals: {
		'ts-jest': {
			tsConfigFile: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': './node_modules/ts-jest/preprocessor.js'
	},
	testMatch: [
		'**/test/**/*.test.(ts|js)'
	],
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/*.{ts,js,jsx}",
    "!**/node_modules/**"
  ],
  coverageThreshold: {
    global: {
      "branches": 40,
      "statements": 40
    }
  }
};

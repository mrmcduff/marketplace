
module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/test/**/*.test.(ts|js)'
	],
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.{ts,js,jsx}",
    "!**/node_modules/**"
  ],
  coverageThreshold: {
    global: {
      "branches": 40,
      "statements": 40
    }
  }
};

module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '.*': [
      'ts-jest',
      {
        diagnostics: false,
        // tsconfig: 'jest.tsconfig.json'
      },
    ]
  },
  testURL: 'http://localhost',
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
};

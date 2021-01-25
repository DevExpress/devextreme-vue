module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
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

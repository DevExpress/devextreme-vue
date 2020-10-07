module.exports = {
    "roots": [
      "<rootDir>/src/core"
    ],
    "transform": {
      "^.+\\.(j|t)sx?$": "ts-jest"
    },
    "testURL": "http://localhost",
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    "moduleNameMapper": {
      "^vue$": "vue/dist/vue.common.js",
      "^@/(.*)$": "<rootDir>/src/core/$1"
    }
};

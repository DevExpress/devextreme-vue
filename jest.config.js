const vue = require("./node_modules/vue/package.json");
const testsPath = vue.version.split(".")[0] === "2" ? "<rootDir>/src/core/tests/vue2" : "<rootDir>/src/core/tests/vue3";
const vuePath = vue.version.split(".")[0] === "2" ? "vue/dist/vue.common.js" : "vue/dist/vue.cjs";
module.exports = {
    "roots": [
      testsPath,
      "<rootDir>/tools"
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
      "^vue$": vuePath,
      "^@/(.*)$": "<rootDir>/src/$1"
    }
};
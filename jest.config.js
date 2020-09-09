const vue = require("./node_modules/vue/package.json");
const vueVersion = vue.version.split(".")[0];
const testsPath = `<rootDir>/src/core/tests/vue${vueVersion}`;
const vuePath = vueVersion === "2" ? "vue/dist/vue.common.js" : "vue/dist/vue.cjs";
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
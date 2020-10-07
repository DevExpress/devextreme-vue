
module.exports = {
  core: './src/core/**/*.ts',
  ignoredGlobs: ['!./src/core/**/*.test.ts', '!./src/core/**/__mocks__/*'],
  example: {
    src: "example/**/*.{ts,vue}"
  },
  npm: {
    dist: './npm/',
  }
};


module.exports = {
  src: './src/**/*.ts',
  strategySrc: './vue2-strategy/src',
  ignoredGlobs: ['!./src/**/*.test.ts', '!./src/**/__mocks__/*'],
  generator: {
    src: './tools/src/**/*.ts',
    binDir: './tools/bin/',
    entry: './tools/bin/generator.js'
  },
  example: {
    src: "example/**/*.{ts,vue}"
  },
  npm: {
    dist: './npm/',
    strategySrc: './vue2-strategy/npm/*',
    strategyDist: './npm/core/strategy/vue2',
    package: 'package.json',
    license: 'LICENSE',
    readme: 'README.md'
  },
  metadataPath: './tools/integration-data.json',
  generatedComponentsDir: './src',
  oldComponentsDir: './src/ui',
  coreComponentsDir: './src/core',
  indexFileName: './src/index.ts',
  baseComponent: './core/index',
  configComponent: './core/index',
  widgetsPackage: 'devextreme'
};


module.exports = {
  src: './src/**/*.ts',
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
    package: 'package.json',
    license: 'LICENSE',
    readme: 'README.md'
  },
  metadataPath: './tools/integration-data.json',
  generatedComponentsDir: './src',
  oldComponentsDir: './src/ui',
  coreComponentsDir: './src/core',
  indexFileName: './src/index.ts',
  baseComponent: './core/component',
  configComponent: './core/configuration-component',
  extensionComponent: './core/extension-component'
};

module.exports = {
  src: './src/**/*.ts',
  testSrc: './src/**/*.test.ts', 
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
    pattern: '**/*.{ts,js}',
    package: 'package.json',
    license: 'LICENSE',
    readme: 'README.md'
  },
  metadataPath: './tools/integration-data.json',
  componentFolder: './src/ui',
  indexFileName: './src/index.ts',
  baseComponent: '../core/component',
  configComponent: '../core/configuration-component',
  extensionComponent: '../core/extension-component'
};
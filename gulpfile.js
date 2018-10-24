const mkdir = require('mkdirp');
const fs = require('fs');
const path = require('path');
const del = require('del');

const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const ts = require('gulp-typescript');
const tslint = require("gulp-tslint");
const runSequence = require('run-sequence');

const config = require('./build.config');

const
  GENERATE = 'generate',
  CLEAN = 'clean',

  OUTPUTDIR_CLEAN = 'output-dir.clean',
  OLD_OUTPUTDIR_CREATE = 'output-dir.create',
  GEN_COMPILE = 'generator.compile',
  GEN_CLEAN = 'generator.clean',
  GEN_RUN = 'generator.run',

  LINT = 'lint',

  NPM_CLEAN = 'npm.clean',
  NPM_PACKAGE = 'npm.package',
  NPM_LICENSE = 'npm.license',
  NPM_BUILD_WITH_HEADERS = 'npm.license-headers',
  NPM_README = 'npm.readme',
  NPM_BUILD = 'npm.build',
  NPM_PACK = 'npm.pack';

gulp.task(GENERATE, (done) =>
  runSequence(
    CLEAN,
    [OLD_OUTPUTDIR_CREATE, GEN_COMPILE],
    GEN_RUN,
    done
  )
);

gulp.task(CLEAN, [OUTPUTDIR_CLEAN, GEN_CLEAN, NPM_CLEAN]);

gulp.task(OUTPUTDIR_CLEAN, (c) =>
  del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c)
);

gulp.task(GEN_CLEAN, (c) =>
  del([config.generator.binDir], c)
);

gulp.task(OLD_OUTPUTDIR_CREATE, (done) =>
  mkdir(config.oldComponentsDir, {}, done)
);

gulp.task(GEN_COMPILE, [GEN_CLEAN], () =>
  gulp.src([config.generator.src, `!**/*.test.ts`])
    .pipe(ts({
      'target': 'es6',
      'module': 'commonjs'
    }))
    .pipe(gulp.dest(config.generator.binDir))
);

gulp.task(GEN_RUN, (done) => {
  const generateSync = require(`${config.generator.binDir}generator.js`).default;
  generateSync(
    JSON.parse(fs.readFileSync(config.metadataPath).toString()),
    config.baseComponent,
    config.configComponent,
    config.extensionComponent,
    {
      componentsDir: config.generatedComponentsDir,
      oldComponentsDir: config.oldComponentsDir,
      indexFileName: config.indexFileName
    }
  );

  done();
});


gulp.task(NPM_CLEAN, (c) =>
  del(config.npm.dist, c)
);

gulp.task(NPM_PACKAGE, [NPM_CLEAN], () =>
  gulp.src(config.npm.package)
    .pipe(gulp.dest(config.npm.dist))
)

gulp.task(NPM_LICENSE, [NPM_CLEAN], () =>
  gulp.src(config.npm.license)
    .pipe(gulp.dest(config.npm.dist))
)

gulp.task(NPM_README, [NPM_CLEAN], () =>
  gulp.src(config.npm.readme)
    .pipe(gulp.dest(config.npm.dist))
)

gulp.task(NPM_BUILD, [NPM_LICENSE, NPM_PACKAGE, NPM_README, GENERATE], () => {
  return gulp.src([
      config.src,
      "!" + config.testSrc
    ])
    .pipe(ts('tsconfig.json'))
    .pipe(gulp.dest(config.npm.dist))
});

gulp.task(NPM_BUILD_WITH_HEADERS, [NPM_BUILD], function() {
  const pkg = require('./package.json'),
      now = new Date(),
      data = {
          pkg: pkg,
          date: now.toDateString(),
          year: now.getFullYear()
      };

  var banner = [
      '/*!',
      ' * <%= pkg.name %>',
      ' * Version: <%= pkg.version %>',
      ' * Build date: <%= date %>',
      ' *',
      ' * Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED',
      ' *',
      ' * This software may be modified and distributed under the terms',
      ' * of the MIT license. See the LICENSE file in the root of the project for details.',
      ' *',
      ' * https://github.com/DevExpress/devextreme-vue',
      ' */',
      '\n'
      ].join('\n');

  return gulp.src(path.join(config.npm.dist, config.npm.pattern))
      .pipe(header(banner, data))
      .pipe(gulp.dest(config.npm.dist));
});

gulp.task(NPM_PACK, [NPM_BUILD_WITH_HEADERS], shell.task(['npm pack'], { cwd: config.npm.dist }));

gulp.task(LINT, () => {
  return gulp.src([config.src, config.generator.src])
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report())
})

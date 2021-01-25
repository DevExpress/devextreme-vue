const mkdir = require('mkdirp');
const fs = require('fs');
const del = require('del');

const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const ts = require('gulp-typescript');

const generateSync = require('devextreme-vue-generator').default;

const config = require('./build.config');

const
  GENERATE = 'generate',
  CLEAN = 'clean',

  OUTPUTDIR_CLEAN = 'output-dir.clean',
  OLD_OUTPUTDIR_CREATE = 'output-dir.create',
  GEN_RUN = 'generator.run',

  NPM_CLEAN = 'npm.clean',
  NPM_PACKAGE = 'npm.package',
  NPM_LICENSE = 'npm.license',
  NPM_BUILD_WITH_HEADERS = 'npm.license-headers',
  NPM_README = 'npm.readme',
  NPM_BUILD = 'npm.build',
  NPM_PACK = 'npm.pack';

gulp.task(OUTPUTDIR_CLEAN, (c) =>
  del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c)
);

gulp.task(NPM_CLEAN, (c) =>
  del(config.npm.dist, c)
);

gulp.task(CLEAN, gulp.parallel(OUTPUTDIR_CLEAN, NPM_CLEAN));

gulp.task(OLD_OUTPUTDIR_CREATE, (done) =>
  mkdir(config.oldComponentsDir, {}, done)
);

gulp.task(GEN_RUN, (done) => {
  generateSync(
    JSON.parse(fs.readFileSync(config.metadataPath).toString()),
    config.baseComponent,
    config.configComponent,
    {
      componentsDir: config.generatedComponentsDir,
      oldComponentsDir: config.oldComponentsDir,
      indexFileName: config.indexFileName
    },
    config.widgetsPackage
  );

  done();
});

gulp.task(GENERATE, gulp.series(
  OLD_OUTPUTDIR_CREATE,
  GEN_RUN
));

gulp.task(NPM_PACKAGE,
  () => gulp.src(config.npm.package).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_LICENSE,
  () => gulp.src(config.npm.license).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_README,
  () => gulp.src(config.npm.readme).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_BUILD, gulp.series(
  CLEAN,
  gulp.parallel(NPM_LICENSE, NPM_PACKAGE, NPM_README),
  GENERATE,
  () => {
    return gulp.src([
        config.src,
        ...config.ignoredGlobs
      ])
      .pipe(ts('tsconfig.json'))
      .pipe(gulp.dest(config.npm.dist))
  }
));

gulp.task(NPM_BUILD_WITH_HEADERS, gulp.series(
  NPM_BUILD,
  () => {
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

    return gulp.src(`${config.npm.dist}**/*.{ts,js}`)
        .pipe(header(banner, data))
        .pipe(gulp.dest(config.npm.dist));
  }
));

var INSTALL_STRATEGY = 'install.strategy';

gulp.task(INSTALL_STRATEGY, shell.task([`npm i ../${config.npm.strategySrc} -B --production`], { cwd: config.npm.dist }));

gulp.task(NPM_PACK, gulp.series(
  NPM_BUILD_WITH_HEADERS,
  INSTALL_STRATEGY,
  shell.task(['npm pack'], { cwd: config.npm.dist })
));
const del = require('del');

const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const ts = require('gulp-typescript');
// const tslint = require("gulp-tslint");

const config = require('./build.config');

const
  CLEAN = 'clean',
  // LINT = 'lint',

  NPM_CLEAN = 'npm.clean',
  NPM_BUILD_WITH_HEADERS = 'npm.license-headers',
  NPM_BUILD = 'npm.build',
  NPM_PACK = 'npm.pack';

gulp.task(NPM_CLEAN, (c) =>
  del(config.npm.dist, c)
);

gulp.task(CLEAN, gulp.parallel(NPM_CLEAN));

gulp.task(NPM_BUILD, gulp.series(
  CLEAN,
  () => {
    return gulp.src([
        config.core,
        ...config.ignoredGlobs
      ])
      .pipe(ts('tsconfig.json'))
      .pipe(gulp.dest(config.npm.dist))
  }
));

gulp.task(NPM_BUILD_WITH_HEADERS, gulp.series(
  NPM_BUILD,
  () => {
    const pkg = require('../package.json'),
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

gulp.task(NPM_PACK, gulp.series(
  NPM_BUILD_WITH_HEADERS
));

// gulp.task(LINT, () => {
//   return gulp.src([config.src, config.generator.src])
//     .pipe(tslint({
//         formatter: "verbose"
//     }))
//     .pipe(tslint.report())
// });

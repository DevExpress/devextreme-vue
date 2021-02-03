const gulp = require('gulp');
const tslint = require("gulp-tslint");

gulp.task('lint', () => gulp.src(['packages/*/src/**/*.ts', 'packages/**/sandbox/*/*.ts'])
  .pipe(tslint({
    formatter: "verbose"
  }))
  .pipe(tslint.report()));

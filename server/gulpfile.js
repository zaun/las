process.chdir('../');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var webpackStream = require('webpack-stream');

process.stdin.setRawMode(true);

gulp.task('clean', function () {
  return gulp.src('build', { read: false })
    .pipe(plugins.clean());
});

gulp.task('copy', function () {
  return gulp.src('server/lambdaAPI/**/*')
    .pipe(plugins.copy('build/lambdaAPI', { prefix: 2 }));
});

gulp.task('install', gulp.series(['copy'], function () {
  return gulp.src('build/lambdaAPI/*')
    .pipe(gulp.dest('build/lambdaAPI/'))
    .pipe(plugins.install());
}));

gulp.task('zip', function () {
  return gulp.src('build/lambdaAPI/**/*')
    .pipe(plugins.zip('lambdaAPI.zip'))
    .pipe(gulp.dest('build'));
});

gulp.task('buildAPI', gulp.series(['copy', 'install', 'zip'], function (done) {
  done();
}));
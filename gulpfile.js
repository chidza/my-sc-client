"use strict";

var gulp = require('gulp'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  minifyCss = require('gulp-clean-css'),
  stripDebug = require('gulp-strip-debug'),
  runSequence = require('run-sequence'),
  ts = require('gulp-typescript'),
  Server = require('karma').Server,
  e2e = require('gulp-protractor').protractor,
  minifyHtml = require("gulp-minify-html");

var source = 'src',
  destination = 'dist';

gulp.task('clean', function () {
  del([
    destination
  ]);
});

gulp.task("tsc", function () {
  var tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("."));
});

gulp.task('minify', ['tsc'], function () {
  gulp.src(source + '/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', stripDebug()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
  gulp.src(source + '/app/**/*.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest(destination + '/app'));
});

gulp.task('fonts', function () {
  gulp.src([source + '/lib/bootstrap/fonts/*.*',
  source + '/lib/components-font-awesome/fonts/*.*'])
    .pipe(gulp.dest(destination + '/fonts'));
});

gulp.task('images', function () {
  gulp.src([source + '/img/*.*'])
    .pipe(gulp.dest(destination + '/img'));
});

gulp.task('watch', ['tsc'], function () {
  gulp.watch([source + '/app/**/*.ts'], ['tsc']);
});

gulp.task('default', ['watch']);

gulp.task('compile', ['clean'], function (done) {
  runSequence(
    ['tsc', 'minify', 'fonts', 'html', 'images'], done);
});

gulp.task('test', ["tsc"], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('coverage', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    reporters: ['coverage']
  }, done).start();
});

gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});



gulp.task('test:chrome', function (done) {
  new Server({
    configFile: __dirname + 'karma.conf.js',
    browsers: ['Chrome']
  }, function (exitCode) {
    done();
    process.exit(exitCode);
  }).start();
});

gulp.task('e2e', function (done) {
  gulp.src(['test/e2e/**/*.js'])
    .pipe(e2e({
      configFile: "test/protractor.config.js",
      args: ['--baseUrl', 'http://localhost:8000']
    }))
    .on('end', done);
});

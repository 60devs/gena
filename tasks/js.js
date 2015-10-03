var gulp = require('gulp');
var jspm = require('jspm');

gulp.task('js', function(done) {
  return jspm.bundleSFX('src/js/main', './dist/js/main.js', {
    minify: true, mangle: false});
});

gulp.task('dev-js', function(done) {
  return jspm.bundleSFX('src/js/main', './dist/js/main.js', {
    minify: false, mangle: false});
});


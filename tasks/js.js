var gulp = require('gulp');
var jspm = require('jspm');

gulp.task('js', function(done) {
  return jspm.buildStatic('src/js/main', './dist/js/main.js', {
    minify: true, mangle: true});
});

gulp.task('dev-js', function(done) {
  return jspm.buildStatic('src/js/main', './dist/js/main.js', {
    minify: false, mangle: false});
});


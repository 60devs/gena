var gulp = require('gulp');
var runSequence = require('run-sequence');
var console = require('gulp-util');
var site = global.site;

gulp.task('build', ['clean'],  function(callback) {
  var build = site.build;
  runSequence.apply(null, build.concat([callback]));
});

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('davai!', function(cb) {
  runSequence('build', 'deploy');
});

gulp.task('davai', function(cb) {
  runSequence('build', 'deploy');
});

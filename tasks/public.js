var gulp = require('gulp');

gulp.task('public', function() {
  return gulp.src('./public/**/*')
    .pipe(gulp.dest('./dist'));
});

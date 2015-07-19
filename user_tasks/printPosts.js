var gulp = require('gulp');
var gulpPrint = require(process.cwd() + '/node_modules/gulp-print');

gulp.task('printPosts', function() {
  return gulp.src(['./src/posts/*.md'])
    .pipe(gulpPrint());
});
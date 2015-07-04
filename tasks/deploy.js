var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var rsync = require('gulp-rsync');
var site = global.site;

gulp.task('deploy', function() {
  switch (site.deploy.method) {
    case 'github':
      return gulp.src('./dist/**/*')
        .pipe(ghPages({
          remoteUrl: site.deploy.url,
          branch: 'master'
        }));
    case 'rsync':
      return gulp.src(['dist/**/*'])
        .pipe(rsync(site.deploy));
  }
});

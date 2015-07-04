var gulp = require('gulp');
var sitemap = require('gulp-sitemap');
var plumber = require('gulp-plumber');
var site = global.site;

gulp.task('sitemap', function() {
  return gulp.src('dist/**/*.html')
    .pipe(plumber())
    .pipe(sitemap({
      siteUrl: site.url,
      changefreq: site.sitemap.changefreq
    }))
    .pipe(gulp.dest('./dist'));
});

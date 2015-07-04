var rimraf = require('rimraf');
var gulp = require('gulp');

var site = global.site;

gulp.task('clean', function(cb) {
  site.pages = [];
  site.posts = [];
  site.pagesMap = {};
  site.postsMap = {};
  rimraf('./dist/', cb);
});

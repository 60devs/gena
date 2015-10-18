var rimraf = require('rimraf');
var gulp = require('gulp');

var site = global.site;

gulp.task('clean', function(cb) {
  site.pages = [];
  site.posts = [];
  site.authors = [];
  site.pagesMap = {};
  site.postsMap = {};
  site.authorsMap = {};
  rimraf('./dist/', cb);
});

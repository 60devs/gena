var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var connectSSI = require('connect-ssi');

var site = global.site;

function server() {
  site.local = true;
  var dest = './dist/';
  connect.server({
    root: dest,
    livereload: true,
    port: 3000,
    middleware: function() {
      return [connectSSI({
        ext: '.html',
        baseDir: dest
      })];
    }
  });

  watch(['./src/**/*', './public/**/*'], batch(function(events, done) {
    gulp.start('dev-build', function() {
      events.pipe(connect.reload());
      done();
    });
  }));

  var options = {
    url: 'http://localhost:3000'
  };

  return gulp.src('./dist/index.html')
    .pipe(open('', options));
}

gulp.task('server', ['dev-build'], server);
gulp.task('s', ['dev-build'], server);

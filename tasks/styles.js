var gulp = require('gulp');
var vcl = require('gulp-vcl-preprocessor');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uncss = require('gulp-uncss');
var glob = require('glob');
var plumber = require('gulp-plumber');

var site = global.site;

gulp.task('styles', function() {
  var pipe = gulp.src('src/styles/main.styl')
    .pipe(plumber())
    .pipe(vcl())
    .pipe(concat('main.css'));

  if (site.uncss) {
    pipe = pipe.pipe(uncss({
      html: glob.sync('dist/**/*.html'),
      ignore: ['#bounce-in', 'bounce-in', '.bounce-in', '.vclTimelineContent.bounce-in'],
      media: ['(max-width: 640px)', '(min-width: 390px) and (max-width: 1280px)', '(max-width: 390px)', '(min-width: 1280px)']
    }));
  }

  return pipe.pipe(autoprefixer())
    .pipe(minifyCss({
        cache: true,
        keepBreaks: false
      }))
    .pipe(gulp.dest('dist/styles/'));
});

gulp.task('styles-lite', function() {
  return gulp.src('src/styles/main.styl')
    .pipe(plumber())
    .pipe(vcl())
    .pipe(concat('main.css'))
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/styles/'));
});


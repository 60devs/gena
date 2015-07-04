var gulp = require('gulp');
var vcl = require('gulp-vcl-preprocessor');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var glob = require('glob');
var plumber = require('gulp-plumber');

var site = global.site;

gulp.task('styles', function() {
  var pipe = gulp.src('src/styles/main.styl')
    .pipe(plumber())
    .pipe(vcl())
    .pipe(concat('main.css'));

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


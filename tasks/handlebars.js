// Load and use polyfill for ECMA-402.
if (!global.Intl) {
  global.Intl = require('intl');
}

var changed = require('gulp-changed');
var concat = require('gulp-concat');
var fm = require('gulp-front-matter');
var foreach = require('gulp-foreach');
var fs = require('fs');
var gulp = require('gulp');
var gulpIgnore = require('gulp-ignore');
var htmlmin = require('gulp-html-minifier');
var markdown = require('gulp-markdown');
var merge = require('merge-stream');
var path = require('path');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var sort = require('gulp-sort');

var Handlebars = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
var HandlebarsStatic = require('gulp-static-handlebars');
var HandlebarsLayouts = require('handlebars-layouts');

var helpers = requireDir('../handlebars/helpers');
var partials = requireDir('../handlebars/partials');

var LAYOUTS_DIR = './src/layouts/*';
var PAGES_DIR = './src/pages/*';
var PARTIALS_DIR = './src/partials/*';
var POSTS_DIR = './src/posts/*';
var HELPERS_DIR = './src/helpers/*';

// HandlebarsIntl.registerWith(Handlebars);
HandlebarsStatic.instance(Handlebars);
HandlebarsLayouts(Handlebars);

var util = require('util');

var site = global.site;

site.highlightjs_root = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/';

var fUpper = site.fUpper;
var buildPostMetaData = site.buildPostMetaData;
var pureName = site.pureName;

gulp.task('index-content', function() {
  var postsIndex = gulp.src(POSTS_DIR)
    .pipe(plumber())
    .pipe(sort({
      asc: false,
    }))
    .pipe(
      fm({
        property: 'fm',
        remove: false,
      })
    )
    .pipe(foreach(
        function(stream, file) {
          var name = file.path.replace(file.base, '');
          name = pureName(name);
          if (file.fm.publish !== false) {
            file.fm.url = name.replace(/\d{4}-\d{2}-\d{2}-/g, '');
            site.posts.push(file.fm);
            site.postsMap[name] = buildPostMetaData(name, file.fm);
          }

          return stream;
        }

      ));
  var pagesIndex = gulp.src(PAGES_DIR)
    .pipe(sort({
      comparator: function(file1, file2) {
        var name1 = file1.path.replace(file1.base, '');
        name1 = pureName(name1);

        var name2 = file2.path.replace(file2.base, '');
        name2 = pureName(name2);

        var index1 = site.pages_order.indexOf(name1);
        var index2 = site.pages_order.indexOf(name2);

        return index1 - index2;
      },
    }))
    .pipe(foreach(function(stream, file) {
      var name = file.path.replace(file.base, '');
      name = pureName(name);
      var page = {
        name: name,
        title: site.titleCaps(name),
        url: name + '.html',
        full_url: site.url + '/' + name.url,
      };

      page.mainNav = site.pages_order.indexOf(name) !== -1;
      if (name == 'index') {
        page.title = '';
      }

      site.pages.push(page);
      site.pagesMap[name] = page;
      return stream;
    }));

  return merge(postsIndex, pagesIndex);
});

function isPublished(file) {
  if (file.fm.publish === false) {
    return true;
  } else {
    return false;
  }
}

gulp.task('posts', function() {
  return gulp.src(POSTS_DIR)
    .pipe(plumber())
    .pipe(fm({
      property: 'fm',
      remove: false,
    }))
    .pipe(gulpIgnore.exclude(isPublished))
    .pipe(
      fm({
        remove: true,
      })
    )
    .pipe(
      markdown()
    )
    .pipe(foreach(function(stream, file) {
      var name = file.path.replace(file.base, '');
      name = pureName(name);
      var context = site.postsMap[name];
      if (!context) {
        return gulp.src([]);
      }

      return gulp.src('src/layouts/' + (context.layout || 'post') + '.hbs')
            .pipe(HandlebarsStatic({
              page: context,
              site: site,
              content: file._contents.toString('utf-8'),
            }, {
              helpers: gulp.src([HELPERS_DIR, 'node_modules/gena/handlebars/helpers/*.js']),
              partials: gulp.src([PARTIALS_DIR, LAYOUTS_DIR]),
            }))
            .pipe(concat(name));
    }))
    .pipe(rename(function(path) {
      path.basename = site.postsMap[path.basename].url.replace('.html', '');
      path.extname = '.html';
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('pages', function() {
  return gulp.src(PAGES_DIR)
    .pipe(foreach(function(stream, file) {
         var name = file.path.replace(file.base, '');
         name = pureName(name);
         var context = site.pagesMap[name];
         if (!context) {
           return gulp.src([]);
         }
         return stream
               .pipe(HandlebarsStatic({
                 page: context,
                 site: site,
               }, {
                 helpers: gulp.src([HELPERS_DIR]),
                 partials: gulp.src([PARTIALS_DIR, LAYOUTS_DIR]),
               }))
               .pipe(concat(name));
       }))
    .pipe(rename(function(path) {
        path.extname = '.html';
      }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('handlebars', function(callback) {
  runSequence('index-content', 'posts', 'pages', callback);
});

var foreach = require('gulp-foreach');
var frontMatter = require('gulp-front-matter');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var sort = require('gulp-sort');
var plumber = require('gulp-plumber');

var gulp = require('gulp');
var site = global.site;

gulp.task('rss', function() {
  var feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>' + site.title + '</title>',
    '    <description></description>',
    '    <link>' + site.url + '</link>',
    '    <atom:link href="' + site.url + '/feed.xml" rel="self" type="application/rss+xml"/>',
    '    <pubDate>' + (new Date().toUTCString()) + '</pubDate>',
    '    <lastBuildDate>' + (new Date().toUTCString()) + '</lastBuildDate>',
    '    <generator>Any</generator>'];

  var feedEnd = [
    '</channel>',
    '</rss>'
  ];

  return gulp.src('./src/posts/*.md')
    .pipe(plumber())
  // Read input files
    .pipe(sort({
      asc: false
    }))
    .pipe(foreach(
        function(stream, file) {
          var name = file.path.replace(file.base, '');
          name = site.pureName(name);
          file.fm = site.postsMap[name];
          var fm = file.fm;
          var item = [
    '        <item>',
    '          <title>' + fm.title + '</title>',
    '          <pubDate>' + new Date(fm.date).toUTCString() + '</pubDate>',
    '          <link>' + site.url + '/' + fm.url + '</link>',
    '          <guid isPermaLink="true">' + site.url + '/' + fm.url + '</guid>'
          ];
          if (fm.categories) {
            fm.categories.split(' ').forEach(function(c) {
              item.push('<category>' + c + '</category>');
            });
          }

          item.push('</item>');

          feed = feed.concat(item);
          return stream;
        }

      ))
    .pipe(concat('feed.xml'))
    .pipe(tap(function(file) {
       file.contents =
         new Buffer(feed.concat(feedEnd).join('\n'), 'utf8');
     }))
    .pipe(gulp.dest('./dist'));
});

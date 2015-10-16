var concat = require('gulp-concat');
var foreach = require('gulp-foreach');
var frontMatter = require('gulp-front-matter');
var gulpIgnore = require('gulp-ignore');
var plumber = require('gulp-plumber');
var sort = require('gulp-sort');
var tap = require('gulp-tap');

var Entities = require('html-entities').XmlEntities;
var entities = new Entities();

var gulp = require('gulp');
var site = global.site;

function analytics(urlPart, fm) {
  return urlPart + '?utm_source=feed&utm_content=rssClick&utm_medium=rss&utm_campaign=' +
    encodeURIComponent(site.title);
}

gulp.task('rss', function() {
  var feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>' + entities.encode(site.title) + '</title>',
    '    <description></description>',
    '    <link>' + entities.encode(site.url) + '</link>',
    '    <atom:link href="' + site.url + '/feed.xml" rel="self" type="application/rss+xml"/>',
    '    <pubDate>' + (new Date().toUTCString()) + '</pubDate>',
    '    <lastBuildDate>' + (new Date().toUTCString()) + '</lastBuildDate>',
    '    <generator>60devs</generator>',];

  var feedEnd = [
    '</channel>',
    '</rss>',
  ];

  function isPublished(file) {
    if (file.fm.publish === false) {
      return true;
    } else {
      return false;
    }
  }

  return gulp.src('./src/posts/*.md')
    .pipe(plumber())
    .pipe(frontMatter({
      property: 'fm',
      remove: false,
    }))
    .pipe(gulpIgnore.exclude(isPublished))

  // Read input files
    .pipe(sort({
      asc: false,
    }))
    .pipe(foreach(
        function(stream, file) {
          var name = file.path.replace(file.base, '');
          name = site.pureName(name);
          file.fm = site.postsMap[name];
          var fm = file.fm;
          var item = [
    '        <item>',
    '          <title>' + entities.encode(fm.title) + '</title>',
    '          <pubDate>' + new Date(fm.date).toUTCString() + '</pubDate>',
    '          <link>' + entities.encode(site.url + '/' + analytics(fm.url, fm)) + '</link>',
    '          <guid isPermaLink="true">' + entities.encode(site.url + '/' + analytics(fm.url, fm)) + '</guid>',
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

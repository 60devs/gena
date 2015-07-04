var gulp = require('gulp');
var request = require('request');
var console = require('gulp-util');
var site = global.site;

gulp.task('seo', function(cb) {
  var googleUrl = 'http://www.google.com/webmasters/tools/ping?sitemap=' + (site.url + '/sitemap.xml');
  var bingUrl = 'http://www.bing.com/webmaster/ping.aspx?siteMap=' + (site.url + '/sitemap.xml');

  console.log('Notifying google: ' + googleUrl);
  console.log('Notifying bing: ' + bingUrl);
  request(googleUrl, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      console.log(googleUrl, error, body);
    }

    request(bingUrl, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.log(bingUrl, error, body);
        }

        cb();
      });
  });

});

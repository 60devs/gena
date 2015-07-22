process.env.TZ = 'Europe/Amsterdam';

var requireDir = require('require-dir');
var path = require('path');

var site = {
  pages: [],
  posts: [],
  pagesMap: {},
  postsMap: {}
};

global.site = site;

function pureName(name) {
  ['.hbs', '.md', '.markdown', '.html'].forEach(function(ext) {
    name = path.basename(name, ext);
  });

  return name;
}

site.pureName = pureName;

function buildPostMetaData(name, fm) {
  fm.url = fm.url + '.html';
  fm.title = titleCaps(fm.title);
  fm.full_url = site.url + '/' + fm.url;
  return fm;
}

site.buildPostMetaData = buildPostMetaData;

function fUpper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

site.fUpper = fUpper;


/*
 * Title Caps
 *
 * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
 * License: http://www.opensource.org/licenses/mit-license.php
 */
var small = '(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)';
var punct = '([!"#$%&\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)';

var titleCaps = function(title) {
  var parts = [];
  var split = /[:.;?!] |(?: |^)["Ò]/g;
  var index = 0;

  var punct = function(all, punct, word) {
    return punct + upper(word);
  };

  var test = function(all) {
    return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
  };

  while (true) {
    var m = split.exec(title);

    parts.push(title.substring(index, m ? m.index : title.length)
      .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, test)
      .replace(RegExp('\\b' + small + '\\b', 'ig'), lower)
      .replace(RegExp('^' + punct + small + '\\b', 'ig'), punct)
      .replace(RegExp('\\b' + small + punct + '$', 'ig'), upper));

    index = split.lastIndex;

    if (m) parts.push(m[0]);
    else break;
  }

  return parts.join('').replace(/ V(s?)\. /ig, ' v$1. ')
    .replace(/(['Õ])S\b/ig, '$1s')
    .replace(/\b(AT&T|Q&A)\b/ig, function(all) {
      return all.toUpperCase();
    });
};

function lower(word) {
  return word.toLowerCase();
}

function upper(word) {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
}

site.titleCaps = titleCaps;

var yaml = require('js-yaml');
var fs   = require('fs');
var _ = require('lodash');

try {
  var doc = yaml.safeLoad(fs.readFileSync(process.cwd() + '/config.yml', 'utf-8'));
  _.merge(site, doc);
  if (!site.pages_order) {
    site.pages_order = [];
  }
} catch (e) {
  console.log(e);
}

requireDir('./tasks');
try {
  requireDir('./user_tasks');
  console.log('Using user tasks');
} catch (err) {
  console.log('Error loading user tasks ' + err);
}

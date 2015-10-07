#!/usr/bin/env node

'use strict';

var argv = require('minimist')(process.argv.slice(2));
var run = require('../lib/run');
function generateMeta(name) {
  var now = new Date().toISOString();
  var meta = ['---',
    'layout: post',
    'title:  "' + name + '"',
    'date: ' + now,
    'comments: true',
    'categories: TODO',
    'author: TODO',
    'googlePlus: "TODO"',
    'excerpt: "TODO"',
    'difficulty: "Beginner"',
    'publish: false',
    '---'];
  return meta.join('\n');
}

if (argv._[0] === 'init') {
  console.log('Initializing...');
  run([
    'git',
    'clone',
    '-b master',
    'https://github.com/60devs/gena-blog.git',
    './'
    ].join(' ')).then(function() {
      run('npm install');
    }, function(err) {
      console.error(err);
    });
} else if (argv._[0] === 'new') {
  var what = argv._[1];
  var name = argv._[2];
  var usage = 'Usage: gena new post my-post-name';
  switch (what) {
    case 'post':
      if (name) {
        var now = new Date().toISOString().slice(0, 10);
        var fullName = now + '-' + name.replace(/_/gi, '-') + '.md';
        var fs = require('fs');
        var fullPath = './src/posts/' + fullName;
        if (fs.existsSync(fullPath)) {
          console.log('Post ' + fullName + ' already exists');
        } else {
          fs.writeFileSync(fullPath, generateMeta(name), 'utf-8');
        }
      } else {
        console.error(usage);
      }
      break;
    default:
      console.error(usage);
  }

} else {
  var fs = require('fs-extra');

  if (fs.existsSync('./tasks')) {
    console.log('Loading user tasks: ' + '/tasks');
    fs.copySync('./tasks', './node_modules/gena/user_tasks/');
  } else {
    fs.deleteSync('./node_modules/gena/user_tasks/');
  }

  run([
    'gulp',
    '--cwd .',
    '--gulpfile node_modules/gena/gulpfile.js',
    argv._.join(' ')
  ].join(' ')).catch(function(err) {
    console.error(err);
  });
}

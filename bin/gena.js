#!/usr/bin/env node

'use strict';

var args = process.argv.slice(2);
var run = require('../lib/run');

if (args[0] === 'init') {
  console.log('Initializing...');
  run([
    'git',
    'clone',
    '-b master',
    'https://github.com/60devs/gena-blog.git',
    './'
    ].join(' ')).then(function() {
      run('npm install').then(function() {
        run('jspm install');
      });
    }, function(err) {
      console.log(err);
    });
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
    args.join(' ')
    ].join(' ')).catch(function(err) {
    });
}

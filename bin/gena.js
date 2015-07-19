#!/usr/bin/env node

'use strict';

var exec = require('child_process').exec;
var args = process.argv.slice(2);
var Promise = require('bluebird');

function run(cmd) {
  return new Promise(function(resolve, reject) {
    var child = exec(cmd,
      { stdio: 'inherit' },
      function(error, stdout, stderr) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}

if (args[0] === 'init') {
  console.log('Initializing...');
  run([
    'git',
    'clone',
    '-b master',
    'https://github.com/60devs/gena-blog.git',
    './'
    ].join(' ')).then(function() {
      run([
      'npm install && jspm install'
      ].join(' '));
    }, function(err) {
      console.log(err);
    });
} else {
  run([
    'gulp',
    '--cwd .',
    '--gulpfile node_modules/gena/gulpfile.js',
    args.join(' ')
    ].join(' '));
}

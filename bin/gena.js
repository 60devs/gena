#!/usr/bin/env node

'use strict';

var exec = require('child_process').exec;

var args = process.argv.slice(2);

if (args[0] === 'init') {
  console.log('Initializing...');
  var nodegit = require('nodegit');
  var Clone = nodegit.Clone;
  Clone.clone('https://github.com/60devs/gena-blog.git', '.', {
    checkoutBranch: 'master'
  })
  .then(function(repo) {
      var r = repo;
      var child = exec([
        'npm install && jspm install'
        ].join(' ')
      );

      child.stdout.on('data', function(data) {
        console.log(data.toString());
      });
    }, function(err) {
      console.log(err);
    }
  );
} else {
  var child = exec([
    'gulp',
    '--cwd .',
    '--gulpfile node_modules/gena/gulpfile.js',
    args.join(' ')
    ].join(' ')
  );

  child.stdout.on('data', function(data) {
    console.log(data.toString());
  });

}

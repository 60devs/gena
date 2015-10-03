var gulp = require('gulp');
gulp.task('deploy', function() {
  var ghPages = require('gulp-gh-pages');
  var rsync = require('gulp-rsync');
  var run = require('../lib/run');

  var site = global.site;

  function doDeploy() {
    switch (site.deploy.method) {
      case 'github':
        return gulp.src('./dist/**/*')
          .pipe(ghPages({
            remoteUrl: site.deploy.url,
            branch: site.deploy.branch || 'master'
          }));
      case 'rsync':
        return gulp.src(['dist/**/*'])
          .pipe(rsync(site.deploy));
    }
  }

  function getBranch(data) {
    var spl = data.split('\n');
    var branchName = null;
    spl.forEach(function(branch) {
      if (branch[0] === '*') {
        branchName = branch.substring(2).trim();
      }
    });
    return branchName;
  }

  function upToDate(name) {
    return run('git remote show origin', true).then(function(output) {
      var re = new RegExp(name + ' \\(up to date\\)', 'gi');
      if (re.test(output)) {
        console.log('Current branch is not up-to-date');
        return;
      } else {
        throw new Error('Current branch is not up-to-date');
      }
    });
  }

  run('git branch', true).then(function(data) {
    var currentBranch = getBranch(data);
    console.log('Current branch: ' + currentBranch);
    if (!currentBranch) {
      console.log('Cannot detect current git branch name');
    }
    upToDate(currentBranch).then(function() {
      doDeploy();
    }).catch(function(err) {
      console.error(err);
      console.error('Deployment aborted!');
    });
  }).catch(function(err, data) {
    console.log(err, data);
  });
});

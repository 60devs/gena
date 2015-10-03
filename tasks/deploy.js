var gulp = require('gulp');
var site = global.site;
var ghPages = require('gulp-gh-pages');
var rsync = require('gulp-rsync');
var run = require('../lib/run');

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
      console.log('Current branch is up-to-date');
      return true;
    } else {
      throw new Error('Current branch is not up-to-date');
    }
  });
}

gulp.task('check-deploy', function(done) {
  run('git branch', true).then(function(data) {
    var currentBranch = getBranch(data);
    console.log('Current branch: ' + currentBranch);
    if (!currentBranch) {
      console.log('Cannot detect current git branch name');
    }
    upToDate(currentBranch).then(function() {
      done();
    }).catch(function(err) {
      console.error(err);
      console.error('Deployment aborted!');
      done(err);
    });
  }).catch(function(err, data) {
    console.log(err, data);
    done(err);
  });
});

gulp.task('deploy', ['check-deploy'], function() {
  console.log('Doing deployment via ' + site.deploy.method);
  switch (site.deploy.method) {
    case 'github':
      return gulp.src('./dist/**/*')
        .pipe(ghPages({
          remoteUrl: site.deploy.url,
          branch: site.deploy.branch || 'master'
        }));
    case 'rsync':
      return gulp.src('dist/**/*')
        .pipe(rsync(site.deploy));
  }
  return doDeploy();
});

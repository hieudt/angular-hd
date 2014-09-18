'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var slash = require('slash');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var bowerResolve = require('bower-resolve');

gulp.task('bundle:vendor', function () {
  return bundleVendor(true);
});

gulp.task('bundle:vendor:dist', function () {
  return bundleVendor(false);
});

function bundleVendor(debug) {
  var basedir = process.cwd();
  var bundler = browserify({
    noparse: true,
    debug: debug
  });

  buildConfig.bower.packageIds.forEach(function (id) {
    var packagePath = bowerResolve.fastReadSync(id);
    packagePath = slash(packagePath.replace(basedir, '.'));

    bundler.require(packagePath, {
      expose: id,
      basedir: basedir
    });
  });

  return bundler.bundle()
    .on('error', function (error) {
      gutil.log(gutil.colors.red('Error while bundling vendor scripts: ' + error.message));
      gutil.beep();
      this.end();
    })
    .pipe(source('vendor.bundle.js'))
    .pipe(gulp.dest('build/js/'));
}

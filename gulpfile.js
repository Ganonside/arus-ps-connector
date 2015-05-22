// require('babel/register');
var fs = require('fs');
var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');

function changedJsWarning(event) {
  var relPath = event.path.replace(/.*((\/|\\)lib\2js\2.*?\.js)/, '.$1');
  console.warn('Warning: Detected the following change to \'./lib/js\'');
  console.warn('\tFile: ' + relPath + '\n\tAction: ' + event.type);
  console.warn('\'./lib/js/\' is a generated directory. Changes made here are liable to be overwritten.');
}

gulp.task('default', ['cleanSlate', 'generateJs']);

gulp.task('watch', ['cleanSlate', 'generateJs', 'watchEs6', 'watchJs']);

/**
 * Deletes the `lib/js` directory to clean out files deleted in `lib/es6`
 */
gulp.task('cleanSlate', function() {
  del(['./lib/js/**/*.js']);
});

/**
 * Generates the `lib/js` directory from the transpiled `lib/es6` directory
 */
gulp.task('generateJs', ['cleanSlate', 'setChangedEs6', 'transpileEs6', 'cleanup']);

/**
 * Creates a `.txt` file that lets gulp know that it shouldn't throw an error when modifying the
 * `lib/js` directory
 */
gulp.task('setChangedEs6', function() {
  if (!fs.existsSync('./generated')) {
    fs.mkdirSync('./generated');
  }
  fs.writeFileSync('./generated/changedEs6.txt', 'true');
});

/**
 * Transpiles the `.es6` files into javascript and gives them the extension `.js`
 */
gulp.task('transpileEs6', ['cleanSlate', 'setChangedEs6'], function() {

  var transpiled;
  try {
    transpiled = gulp.src('./lib/es6/**/*.es6')
      .pipe(babel())
      .pipe(rename(function(srcpath) {
        srcpath.extname = '.js';
      }))
      .pipe(gulp.dest('./lib/js'));
  } catch (err) {
    console.error('Transpile Error:\n\t', err);
    transpiled = gulp.src('./lib/es6/**/*.es6', { read: false });
  }

  return transpiled;
});

/**
 * Deletes the `./generated` directory
 */
gulp.task('cleanup', ['setChangedEs6', 'transpileEs6'], function(cb) {
  setTimeout(function () {
    del(['./generated'], cb);
  }, 1000);
});

/**
 * Watches for changes in `lib/es6` directory and fires the `generateJs` task when it notices one
 */
gulp.task('watchEs6', ['generateJs'], function() {
  gulp.watch('./lib/es6/**/*.es6', ['generateJs']);
});

/**
 * Watches for changes in the `lib/js` directory and warns the user when it notices one if the
 * changes weren't spawned by a change in the `lib/es6` directory
 */
gulp.task('watchJs', ['generateJs'], function() {
  gulp.watch('./lib/js/**/*.js', function(event) {
    if (!fs.existsSync('./generated/changedEs6.txt')) {
      changedJsWarning(event);
    }
  });
});

require('babel/register');
gulp.task('test', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ timeout: 20000 }));
});

gulp.task('test:Courses', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ grep: 'Courses', timeout: 10000 }));
});

gulp.task('test:Event', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ grep: 'Events' }));
});

gulp.task('test:Notification', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ grep: 'Notification' }));
});

gulp.task('test:Picture', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ grep: 'Picture' }));
});

gulp.task('test:Profile', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ grep: 'Profile' }));
});

gulp.task('test:Schedule', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ grep: 'Schedule' }));
});

gulp.task('test:Subjects', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({ grep: 'Subjects', timeout: 20000 }));
});

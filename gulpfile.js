// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    exec = require('gulp-exec'),
    wintersmith = require('gulp-wintersmith'),
    lr = require('tiny-lr'),
    server = lr();
 
// Styles
gulp.task('styles', function() {
  return gulp.src('build/css/*.css')
//    .pipe(sass({ style: 'expanded', }))
//    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
//    .pipe(gulp.dest('dist/styles'))
//    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(livereload(server))
    .pipe(gulp.dest('build/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});
 
// Scripts
gulp.task('scripts', function() {
  return gulp.src('build/js/*.js')
//    .pipe(jshint('.jshintrc'))
//    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('build/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
 
// Images
gulp.task('images', function() {
  return gulp.src('build/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(livereload(server))
    .pipe(gulp.dest('build/img'))
    .pipe(notify({ message: 'Images task complete' }));
});
 
// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
    .pipe(clean());
});

// Execute wintersmith preview
gulp.task('remove', function() {
  var options = {
    silent: false,
    continueOnError: true, // default: false
    catalog: "./build"
  };
 gulp.src('./build')
    .pipe(exec('rm -rf ./build', options));
});

// Usage of preview action
gulp.task('site-preview', function() {
    gulp.src('./config.json')
        .pipe(wintersmith('preview', {port: '8080'}));
});

// Usage of build action
gulp.task('site-build', function() {
    gulp.src('./config.json')
        .pipe(wintersmith('build', {port: '8080'}));
});
 
// Default task
gulp.task('default', ['site-build'], function() {
    gulp.start('styles', 'scripts');
});
 
// Watch
gulp.task('watch', function() {
 
  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };
 
    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);
 
    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);
 
    // Watch image files
    gulp.watch('src/images/**/*', ['images']);
 
  });
 
});

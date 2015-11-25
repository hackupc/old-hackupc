var browserify = require('browserify');
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    notify = require('gulp-notify'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    autoprefixer = require('autoprefixer'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

var config = {
  sassPath: './sass'
};

/*gulp.task('icons', function() {
  return gulp.src('./fonts/**.*')
    .pipe(gulp.dest('./public/fonts'));
});*/

gulp.task('js', function() {
  var b = browserify({
    entries: './js/landing.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('./js/landing.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'));
});

gulp.task('css', function() {
  return sass(config.sassPath + '/app.scss', {
        style: 'compressed',
        loadPath: [
          './sass'
        ]
      })
      .on("error", notify.onError(function (error) {
        return "Error: " + error.message;
      }))
    .pipe(sourcemaps.init())
    //.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
     gulp.watch(config.sassPath + '/**/*.scss', ['css']);
});

gulp.task('default', ['css', 'js']);

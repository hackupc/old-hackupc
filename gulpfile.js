var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    notify = require('gulp-notify'),
    bower = require('gulp-bower'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer');

var config = {
  sassPath: './sass',
  bowerDir: './bower_components'
};

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir));
});

gulp.task('icons', function() {
  return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('js', function() {
  return gulp.src(config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js')
    .pipe(gulp.dest('./public/js'));
});

gulp.task('css', function() {
  return sass(config.sassPath + '/app.scss', {
        style: 'compressed',
        loadPath: [
          './sass',
          config.bowerDir + '/bootstrap-sass/assets/stylesheets',
          config.bowerDir + '/font-awesome/scss',
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

gulp.task('default', ['bower', 'icons', 'css', 'js']);

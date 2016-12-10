'use strict';

let gulp = require('gulp');
let babelify = require('babelify');
let browserify = require('browserify');
let browserSync = require('browser-sync');
let autoprefixer = require('gulp-autoprefixer');
let minifycss = require('gulp-uglifycss');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let concat = require('gulp-concat');
let notify = require('gulp-notify');
let sass = require('gulp-sass');
let plumber = require('gulp-plumber');
let vinylSourceStream = require('vinyl-source-stream');

//path configs
let dirRoot = './';

gulp.task('sass', () => {
  console.log("Compiling Sass");
  return gulp.src(dirRoot+'sass/*.sass')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(plumber.stop())
  .pipe(gulp.dest(dirRoot+'css'))
  .pipe(browserSync.stream());
});

gulp.task('js', () => {
  console.log("Compiling JS");
  return browserify(dirRoot+'js/src/app.js')
    .transform( "babelify", {presets: ["es2015"]} )
    .bundle()
    .on( 'error', function ( err ) {
      notify().write( err );
      this.emit("end")
    })
    .pipe(vinylSourceStream( 'app.js' ))
    .pipe( gulp.dest(dirRoot+'js/dist'))
});

gulp.task('browser-sync', () => {
  browserSync.init({
    // server: {
    //   baseDir: './'
    // },
    proxy: {
      target: 'localhost',
      ws: true
    },
    open: false,
  });
});

gulp.task('watch', () => {
  gulp.watch(dirRoot+'sass/components/**/*.sass', ['sass']);
  gulp.watch(dirRoot+'sass/*.sass', ['sass']);
  gulp.watch(dirRoot+'sass/components/**/*.scss', ['sass']);
  gulp.watch(dirRoot+'js/src/**/*.js', ['js']);
  gulp.watch(dirRoot+'js/src/**/*.js').on('change', browserSync.reload);
  gulp.watch(dirRoot+'*.html').on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'browser-sync'], () => {
  console.log("Time to build some shit");
});
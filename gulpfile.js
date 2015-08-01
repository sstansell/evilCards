'use strict';

/** 
 * requirements & declarations
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
//var gzip = require('gulp-gzip');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');

//defines the environment paths to work with
var bases = {
  src: 'src/',
  dist: 'dist/build/',
  public: 'src/public/'
};

//defines the paths to various types of files in the app (used by helper functions)
var paths = {
  scripts: [bases.public + 'js/**/*.js', bases.public + '!src/js/vendor/**/*.js'],
  js: 'src/public/js',
  libs: ['src/js/vendor/*.js'],
  sass: bases.public + "sass/",
  styles: [bases.public + 'css/**/*.css'],
  html: ['src/index.html', '404.html'],
  images: ['images/**/*.*'],
  fonts: ['fonts/**/*.*'],
  extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico', '.htaccess'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src', 
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist)
  .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
  gulp.src(paths.scripts, {cwd: bases.src})
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(uglify())
  .pipe(concat('script.js'))
  //.pipe(gzip({ append: true }))
  .pipe(gulp.dest(bases.dist + 'js/'));
});
// Process vendor scripts and concatenate them into one output file
gulp.task('vendorScripts', ['clean'], function() {
  gulp.src(paths.libs, {cwd: bases.src})
  .pipe(concat('vendor.js'))
  //.pipe(gzip({ append: true }))
  .pipe(gulp.dest(bases.dist + 'js/vendor/'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
   gulp.src(paths.images, {cwd: bases.src})
   .pipe(imagemin())
   .pipe(gulp.dest(bases.dist + 'images/'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
   // Copy html
   gulp.src(paths.html, {cwd: bases.src})
   .pipe(gulp.dest(bases.dist));
   
   // Copy styles
   gulp.src(paths.styles, {cwd: bases.src})
   .pipe(gulp.dest(bases.dist + 'css'));

   // Copy fonts
   gulp.src(paths.fonts, {cwd: bases.src})
   .pipe(gulp.dest(bases.dist + 'font'));
   
   // Copy vendor scripts, maintaining the original directory structure
   gulp.src(paths.libs, {cwd: bases.src})
   .pipe(gulp.dest(bases.dist + 'js/vendor'));
   
   // Copy extra files
   gulp.src(paths.extras, {cwd: bases.src})
   .pipe(gulp.dest(bases.dist));
});

// Compile sass into CSS & auto-inject into browsers (compressed for release)
gulp.task('sass-release', ['clean'], function() {
    return gulp.src("dev/sass/style.scss")
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())          
        .pipe(gulp.dest("dev/css"))
        .pipe(browserSync.stream());
});
// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(paths.sass + "style.scss")
        .pipe(sass().on("error", handleError))    
        .pipe(autoprefixer())        
        .pipe(gulp.dest("src/public/css"))
        .pipe(browserSync.stream());
});

// Minify the HTML
gulp.task('minify-html', ['clean'], function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./dev/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./release/'));
});

// Transform JSX into JS
gulp.task('transform', function(){
  gulp.src(paths.js)
    .pipe(react())
    .pipe(gulp.dest(paths.DEST_SRC));
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

/////////////////////////
//BUILD AN SERVE TASKS //
/////////////////////////


// Define the build task as a sequence of the helper tasks 
gulp.task('build', ['clean', 'transform', 'scripts', 'imagemin', 'sass-release', 'copy', 'minify-html']);

// start a dev server on the RELEASE code 
gulp.task('serve-release', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: "release"
        },
        ui: false,
        ghostMode: false,
        notify: false
    });
});

// start a dev server, including watching files for changes and reloading
// using the DEV folder of the app
gulp.task('serve', ['sass', 'transform'], function() {
  browserSync({
    server: {
      baseDir: bases.src
    }
  });
  gulp.watch("src/public/sass/**/*.scss", ['sass']);
  gulp.watch(['src/*.html', 'src/public/css/**/*.css', 'src/public/js/**/*.js', 'src/public/js/**/*.jsx'], reload);
});
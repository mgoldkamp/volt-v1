var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var size     = require('gulp-size');
var jade = require('gulp-jade');
var livereload = require('gulp-livereload');


//Sources
var sources = {
  jade: "src/pages/*.jade",
  partials: "src/partials/*.jade",
  scss: "src/scss/base.scss",
  scripts: "js/**/*.js"
};


// Define destinations object
var destinations = {
  html: "dist/",
  css: "dist/css/",
  js: "dist/js",
  img: "dist/img"
};




// SCSS COMPILE

gulp.task('styles', function () {
    return sass(sources.scss) 
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest(destinations.css));
});


//IMGAES

gulp.task('images', function() {
  return gulp.src('src/img/**/*.{svg,jpg,jpeg,gif,png}')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(destination.img))
    .pipe(size());
});

// Compile and copy Jade
gulp.task("jade", function(event) {
  return gulp.src(sources.jade)
  .pipe(jade({pretty: true}))
  .on('error', function (err) {
      console.error('Error!', err.message);
   })
  .pipe(gulp.dest(destinations.html))
});

// Minify and copy all JavaScript
gulp.task('scripts', function() {
  gulp.src(sources.scripts)
    .pipe(uglify())
    .pipe(gulp.dest(destinations.js));
});

// Server
gulp.task('server', function () {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname+'/dist/'));
  app.listen(4000, '0.0.0.0');
});

// Watch sources for change, executa tasks
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(sources.jade, ["jade", "refresh"]);
  gulp.watch(sources.partials, ["jade", "refresh"]);
  gulp.watch('**/*.scss', ["styles", "refresh"]);
  gulp.watch(sources.scripts, ["scripts", "refresh"]);
});

// Refresh task. Depends on Jade task completion
gulp.task('refresh', ["jade", "styles"], function(){
  livereload.changed(__dirname+'/dist/');
  console.log('LiveReload is triggered');
});

// Define default task
gulp.task("default", ["jade", "styles", "scripts", "server", "watch"]);



// Static Server + watching scss/html files
// gulp.task('serve', ['sass'], function() {

//     browserSync({
//         server: "./app"
//     });

//     gulp.watch("src/scss/*.scss", ['sass']);
//     gulp.watch("src/pages/*.jade").on('change', reload);
// });


//Watch Task
// gulp.task('watch', function(){
// 	browserSync({
//         server: {
//             baseDir: "./dist"
//         }
//     });
//  	gulp.watch('**/*.scss', ['sass']);
//  	gulp.watch('src/img/*.{svg,jpg,jpeg,gif,png}', ['images']);
//   gulp.watch('src/pages/*.jade'), ['jade']
// });

//DEFAULT
// gulp.task('default',['images','sass', 'watch' ,'jade']);
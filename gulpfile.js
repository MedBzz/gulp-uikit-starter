const { src, dest, parallel, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require("gulp-sass");
const less = require('gulp-less');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-csso');
const image = require('gulp-image');
const browserSync = require('browser-sync').create();

function html() {
    return src('src/views/*.pug')
    .pipe(pug({pretty:true}))
    .pipe(dest('dist'))
}

// function css() {
//   return src('./src/assets/less/*.less')
//     .pipe(less())
//     .pipe(concat('app.min.css'))
//     .pipe(minifyCSS())
//     .pipe(dest('dist/css'))
// }

function css() {
    return src("./src/assets/scss/*.scss")
    .pipe(sass()).on("error", sass.logError)
    .pipe(concat('app.min.css'))
    .pipe(minifyCSS())
    .pipe(dest('dist/assets/css'))
    .pipe(browserSync.stream());
}

function js() {
    return src([
        './src/assets/js/*.js', 
        './node_modules/uikit/dist/js/uikit.js', 
        './node_modules/uikit/dist/js/uikit-icons.js'
    ], { sourcemaps: true })
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(dest('dist/assets/js', { sourcemaps: true }))
}

function img() {
    return src('./src/assets/images/*')
    .pipe(image())
    .pipe(dest('dist/assets/images'));
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.build = parallel(html, css, js, img);


exports.watch = function() {
    browserSync.init({
        server: {
           baseDir: "./dist",
           index: "/index.html"
        }
    });
    watch('./src/assets/js/**/*.js', { events: 'all', ignoreInitial: false }, js).on('change', browserSync.reload);
    watch('./src/views/**/*.pug', { events: 'all', ignoreInitial: false }, html).on('change', browserSync.reload);
    watch('./src/assets/scss/**/*.scss', { events: 'all', ignoreInitial: false }, css);
};
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      prefix = require('gulp-autoprefixer'),
      browserify = require('browserify'),
      babelify = require('babelify'),
      source = require('vinyl-source-stream');

gulp.task('gulp-sass', function () {
    return gulp
        .src("src/sass/*.sass")
        .pipe(sass())
        .pipe(prefix())
        .pipe(gulp.dest('src/css/'));
});

gulp.task("bundle-js", function () {
    return browserify({entries: "src/index.js", extensions: ['.js'], debug: true})
        .transform('babelify', {presets: ['@babel/preset-env', '@babel/preset-react']})
        .bundle()
        .pipe(source("index.js"))
        .pipe(gulp.dest("src/dist"));
});

/*__________ BUILD _____________________________*/

gulp.task("build-html", function () {
    return gulp.src("src/index.html")
        .pipe(gulp.dest("public/"));
});

gulp.task("build-js", function () {
    return gulp.src("src/dist/index.js")
        .pipe(gulp.dest("public/dist/"));
});

gulp.task("build-css", function () {
    return gulp.src("src/css/*.css")
        .pipe(gulp.dest("public/css/"));
});

gulp.task('build', gulp.series(
    ["gulp-sass",
    "bundle-js",
    "build-js",
    "build-css",
    "build-html"]
));

/*______________________________________*/

gulp.task('watch', function () {
    gulp.watch(["src/sass/*.sass"], gulp.series("gulp-sass"));
});

gulp.task('default', gulp.parallel("gulp-sass", "watch"));

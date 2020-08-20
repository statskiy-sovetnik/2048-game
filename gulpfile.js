const gulp = require('gulp'),
      sass = require('gulp-sass'),
      prefix = require('gulp-autoprefixer'),
      browserify = require('browserify'),
      babelify = require('babelify'),
      source = require('vinyl-source-stream');

gulp.task('build-sass', function () {
    return gulp
        .src("src/sass/*.sass")
        .pipe(sass())
        .pipe(prefix())
        .pipe(gulp.dest('src/css/'));
});

gulp.task("build-js", function () {
    return browserify({entries: "src/scripts/Game.js", extensions: ['.js'], debug: true})
        .transform('babelify', {presets: ['@babel/env', '@babel/react']})
        .bundle()
        .pipe(source("index.js"))
        .pipe(gulp.dest("src/dist"));
});

gulp.task('watch', function () {
    gulp.watch(["src/sass/*.sass"], gulp.series("build-sass"));
    gulp.watch(["src/scripts/**/*.js"], gulp.series("build-js"));
});

gulp.task('default', gulp.parallel("build-sass", "build-js", "watch"));

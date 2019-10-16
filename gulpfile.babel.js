'use strict';

// modules
const gulp     = require('gulp');
const sass     = require('gulp-sass');
const ts       = require('gulp-typescript');
const jasmine  = require('gulp-jasmine');
const babel    = require('gulp-babel');
const concat   = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify   = require('gulp-uglify');
// directories
const sassDir  = './dev/sass/';
const tsDir    = './dev/ts/';
const cssDir   = './build/styles';
const jsDir    = './build/scripts';
const specsDir = './dev/specs/';

sass.compiler  = require('node-sass');

gulp.task('sass', function() {
    return gulp.src(sassDir + '**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDir))
});

gulp.task('sass-production', function() {
    return gulp.src(sassDir + '**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssDir))
});

gulp.task('ts', function() {
    return gulp.src(tsDir + '**/*.ts')
        .pipe(ts({
            noImplicitAny: true
        }))
        .pipe(babel())
        .pipe(gulp.dest(jsDir))
});

gulp.task('js-production', function() {
    return gulp.src(tsDir + '**/*.ts')
        .pipe(ts({
            noImplicitAny: true
        }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(jsDir))
});

gulp.task('specs', function() {
    return gulp.src(specsDir + '**/*.js')
        .pipe(jasmine());
});

const builder = gulp.series('sass', 'ts');
const production = gulp.series('sass-production', 'js-production')
gulp.task('builder', builder);
gulp.task('production', production)

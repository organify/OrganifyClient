const gulp = require('gulp');
const prettyError = require('gulp-prettyerror');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');

// Create basic Gulp tasks

gulp.task('sass', function () {
    return gulp
        .src('./sass/style.scss', {
            sourcemaps: true
        })
        .pipe(prettyError())
        .pipe(sass())
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions']
            })
        )
        .pipe(gulp.dest('./'))
        .pipe(cssnano())
        .pipe(rename('style2.min.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('lint', function () {
    return gulp
        .src(['./js/*.js'])
        .pipe(prettyError())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task(
    'scripts',
    gulp.series('lint', function () {
        return gulp
            .src(['./js/main.js', './js/*.js'])
            .pipe(concat('concat.js'))
            .pipe(gulp.dest('./public/js'))
            .pipe(uglify())
            .pipe(
                rename({
                    extname: '.min.js'
                })
            )
            .pipe(gulp.dest('./public/js'));
    })
);

// Set-up BrowserSync and watch

gulp.task('browser-sync', function () {
    const files = [
        './public/css/*.css',
        './public/js/*.js',
        './*.html',
        './**/*.html',
        './*.htm',
        './**/*.htm'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './',
        }
    });

    gulp.watch(files).on('change', browserSync.reload);
});

gulp.task('watch', function () {
    gulp.watch('js/*.js', gulp.series('scripts'));
    gulp.watch('**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.parallel('browser-sync', 'watch', 'scripts', 'sass'));
let gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    multipipe = require('multipipe'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    pug = require('gulp-pug'),
    notify = require('gulp-notify');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('sass', function () {
    return multipipe(
        gulp.src('app/sass/**/*.scss'),
        (sourcemaps.init()),
        (sass()),
        (rename({suffix: '.min', prefix: ''})),
        (autoprefixer(['last 15 versions'])),
        (cleanCSS()),
        (sourcemaps.write()),
        (gulp.dest('app/css')),
        (browserSync.reload({stream: true}))
    ).on('error', notify.onError());
});


gulp.task('babel', function () {
    return multipipe(
        gulp.src('app/js/common.js'),
        (sourcemaps.init()),
        (babel({
            presets: ['es2015']
        })),
        (sourcemaps.write()),
        (rename('bundle.js')),
        (gulp.dest('app/js')),
        (browserSync.reload)
    ).on('error', notify.onError());
});

gulp.task('gulp-pug', function gulpPug() {
    return multipipe(
        gulp.src('app/pug/*.pug'),
        (pug({
            pretty: '  ',
        })),
        (gulp.dest('app/')))
        .on('error', notify.onError());
});

gulp.task('watch', ['sass', 'babel', 'gulp-pug', 'browser-sync'], function () {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/pug/**/*.pug', ['gulp-pug']);
    gulp.watch('app/**/*.html').on('change', browserSync.reload);
    gulp.watch('app/js/common.js', ['babel']);
});

gulp.task('default', ['watch']);

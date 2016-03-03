var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var path = require('path');

var config = {
    path: {
        css: 'css',
        cssMin: 'css/min',
        cssSprites: 'css/sprites',
        images: 'images',
        imagesIcons: 'images/icons',
        imagesSprites: 'images/sprites',
        less: 'less'
    }
};

gulp.task('build', ['sprite', 'minify']);

// create sprites
gulp.task('sprite', function () {
    var spriteData = gulp.src(path.join(config.path.imagesIcons, '*.*'))
        .pipe(spritesmith({
            imgName: path.join(config.path.imagesSprites, 'sprite.png'),
            cssName: path.join(config.path.cssSprites, 'sprite.css')
        }));

    spriteData.img.pipe(gulp.dest('./'));
    spriteData.css.pipe(gulp.dest('./'));
});

// minify css files
gulp.task('minify', ['less'], function () {
    return gulp.src(path.join(config.path.css, '*.css'))
        .pipe(minifyCSS())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest(config.path.cssMin));
});

// convert less into css
gulp.task('less', function () {
    return gulp.src(path.join(config.path.less, 'styles.less'))
        .pipe(less())
        .pipe(gulp.dest('css'));
});

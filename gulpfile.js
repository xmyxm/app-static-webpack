var gulp = require('gulp');
var path = require('path');
var del = require('del');
var babel = require("gulp-babel");
var runSequence = require('run-sequence').use(gulp);
var webpack = require("webpack");
// const webpack_stream = require('webpack-stream')
var html_dir = require('./f2eci.json').output;
var build_dir = require('./f2eci.json').dist;



gulp.task('clean', function () {
    return del([
        build_dir + "/**/**"
    ]);
});

gulp.task('html', function () {
   return gulp.src(['./' + html_dir + '/**/*.html'])
       .pipe(gulp.dest(build_dir));
});

// gulp.task('js', function () {
//    return gulp.src(['./' + html_dir + '/**/*.js'])
//        .pipe(gulp.dest(build_dir));
// })

// gulp.task('webpack', ['clean'] ,() => {
//    return webpack_stream(webpack_config)
//        .pipe(gulp.dest(`${paths.build}`));
// });

gulp.task('js', function () {
   webpack(require('./webpack/webpack.static.config.js'), function(err, stats) {
        console.info(stats.toString())
    });
});

gulp.task('webpack', function (cb) {
    webpack(require('./webpack.config'), function(err, stats) {
        console.info(stats.toString())
        cb()
    });
});


gulp.task('default', function () {
    runSequence('clean', 'html', 'js','webpack');
});


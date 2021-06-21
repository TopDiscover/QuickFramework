/* jshint node: true, strict: true */

"use strict";

var gulp        = require('gulp'),
    dom         = require('../../');



// Gulp task which will fix unvalid markup

gulp.task('correct-faulty-markup', function() {
    return gulp.src('./src/example.html')
        .pipe(dom(function(){
            return this;
        }))
        .pipe(gulp.dest('./build'));
});



// Default task

gulp.task('default', ['correct-faulty-markup']);

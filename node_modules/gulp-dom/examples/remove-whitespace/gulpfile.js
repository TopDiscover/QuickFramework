/* jshint node: true, strict: true */

"use strict";

var gulp        = require('gulp'),
    whitespace  = require('dom-whitespace'),
    dom         = require('../../');



/**
  * Gulp task for safe removal of whitespace
  *
  * Uses the dom-whitespace module to remove whitespace:
  * https://github.com/trygve-lie/dom-whitespace
  */

gulp.task('strip-whitespace', function() {
    return gulp.src('./src/example.html')
        .pipe(dom(function(){
            return whitespace.remove(this);
        }))
        .pipe(gulp.dest('./build'));
});



// Default task

gulp.task('default', ['strip-whitespace']);

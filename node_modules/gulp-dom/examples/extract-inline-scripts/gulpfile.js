/* jshint node: true, strict: true */

"use strict";

var gulp        = require('gulp'),
    dom         = require('../../');



// Gulp task for extracting inline scripts and storing
// the content as a js file

gulp.task('extract-inline-scripts', function() {
    return gulp.src('./src/example.html')
        .pipe(dom(function(){
            var scripts = this.querySelectorAll('script'),
                result  = '',
                i       = scripts.length;

            while (i--) {
                result += scripts[i].innerHTML;
            }

            return result;
        }, false))
        .pipe(gulp.dest('./build'));
});



// Default task

gulp.task('default', ['extract-inline-scripts']);

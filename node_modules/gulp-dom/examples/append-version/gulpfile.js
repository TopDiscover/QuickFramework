/* jshint node: true, strict: true */

"use strict";

var gulp        = require('gulp'),
    dom         = require('../../'),
    version     = '1.x.x';



// Gulp task for appendig versio number

gulp.task('append-version', function() {
    return gulp.src('./src/example.html')
        .pipe(dom(function(){
            this.getElementById('version').innerHTML = version;
            return this;
        }))
        .pipe(gulp.dest('./build'));
});



// Default task

gulp.task('default', ['append-version']);

/* jshint node: true, strict: true */

"use strict";

var request     = require('request'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    gulp        = require('gulp'),
    dom         = require('../../');



// Gulp task for web scraping

gulp.task('web-scrape', function() {
    return request('http://nodejs.org/')
        .pipe(source('example.txt'))
        .pipe(buffer())
        .pipe(dom(function(){
            return this.title;
        }, false))
        .pipe(gulp.dest('./build'));
});



// Default task

gulp.task('default', ['web-scrape']);

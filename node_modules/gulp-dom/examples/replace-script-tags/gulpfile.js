/* jshint node: true, strict: true */

"use strict";

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    dom         = require('../../');



// Helper for removing a DOM node

function remove(node) {
    var parent = node.parentNode;
    parent.removeChild(node);
}



// Concatinate js files into one file

gulp.task('concat-js-files', function() {
    return gulp.src(['./src/js/**/*'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./build/js/'));
});



// Gulp task for replacing references to existing script tags 
// with reference to concatinated version

gulp.task('replace-script-tags', function() {
    return gulp.src('./src/example.html')
        .pipe(dom(function(){
            var scripts = this.querySelectorAll('script[src]'),
            	i 		= scripts.length;

        	// Remove references file scripts
        	while(i--) {
        		remove(scripts[i]);
        	}
            
        	// Append reference to concatinated script
			var lib = this.createElement('script');
            lib.setAttribute('src', 'js/lib.js');
            this.body.appendChild(lib);

            return this;
        }))
        .pipe(gulp.dest('./build'));
});



// Default task

gulp.task('default', ['concat-js-files', 'replace-script-tags']);

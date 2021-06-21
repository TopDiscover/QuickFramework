/* jshint node: true, strict: true */
/* global describe: true, it: true, before: true */

"use strict";

var assert          = require('chai').assert,
    Vinyl           = require('vinyl'),
    dom             = require('../');



function createFixture(markup) {
    return new Vinyl({
        cwd: './',
        base: './',
        path: './',
        contents: Buffer.from(markup)
    });
}



describe('gulp-dom()', function(){

    describe('error handling', function(){

        it('should pass file when it isNull()', function(done) {
            var stream = dom();
            var mockFile = {
                isNull: function() {
                    return true;
                }
            };

            stream.on('data', function(data) {
                assert.equal(data, mockFile);
                done();
            });

            stream.write(mockFile);
        });

        it('should emit error when file isStream()', function (done) {
            var stream  = dom();
            var mockFile = {
                    isNull: function () {
                        return false;
                    },
                    isStream: function () {
                        return true;
                    }
                };

            stream.on('error', function (err) {
                assert.equal(err.message, 'Streaming not supported');
                done();
            });

            stream.write(mockFile);
        });

    });



    describe('parsing', function(){

        it('should manipulate document', function (done) {
            var result = '<html><head></head><body><p id="test">foo</p></body></html>';
            var fixture = createFixture('<html><body><p id="test">test</p></body></html>');
            var stream = dom(function(){
                this.getElementById('test').innerHTML = 'foo';
                return this;
            });

            stream.on('data', function (data) {
                assert.equal(data.contents.toString("utf8"), result);
                done();
            });

            stream.write(fixture);
        });

    });

});
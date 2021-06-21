# gulp-dom

[![Dependencies](https://img.shields.io/david/trygve-lie/gulp-dom.svg?style=flat-square)](https://david-dm.org/trygve-lie/gulp-dom)[![Build Status](http://img.shields.io/travis/trygve-lie/gulp-dom/master.svg?style=flat-square)](https://travis-ci.org/trygve-lie/gulp-dom)

Gulp plugin for generic DOM manipulation.

This [Gulp](http://gulpjs.com/) plugin is a simple wrapper around
[jsdom](https://github.com/tmpvar/jsdom) making it possible to run DOM
operations on any inbound HTML.

This can be used for several things in a build process. Some examples:

* [Append a version number](https://github.com/trygve-lie/gulp-dom/tree/master/examples/append-version) or any other "stamp data" to the document on build time.
* [Extract inline scripts / css](https://github.com/trygve-lie/gulp-dom/tree/master/examples/extract-inline-scripts) and put them in a separate file.
* [Fix unvalid markup.](https://github.com/trygve-lie/gulp-dom/tree/master/examples/fix-unvalid-markup)
* [Remove whitespace](https://github.com/trygve-lie/gulp-dom/tree/master/examples/remove-whitespace) in the document in a safe way.
* [Replace script / css references](https://github.com/trygve-lie/gulp-dom/tree/master/examples/replace-script-tags) with a new reference (to ex a minified version).
* [Web scraping.](https://github.com/trygve-lie/gulp-dom/tree/master/examples/web-scrape) Take a document from a URL and transform it or extract parts of it during build.


## Installation

```bash
$ npm install gulp-dom
```


## Basic example

Example on adding a `data` attribute with a version number on the `body` tag of
a HTML document:

```js
var gulp = require('gulp'),
    dom  = require('gulp-dom');

gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(dom(function(){
            return this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
        }))
        .pipe(gulp.dest('./public/'));
});
```


## Usage

The plugin has only one method which takes two attributes:


### mutator

Type: `function`

The first attribute is required and is a mutator function. This is where you put
the code which you want to run and manipulate the HTML.

The plugin will take the provided HTML and parse it into a DOM document. The DOM
document is then set as `this` on the mutator function.

A value must be returned by the mutator function and it is this returned value
which will be passed on to the next step in the gulp chain.

Example of basic mutator function:

```js
dom(function(){
    // 'this' holds the DOM and we can something on it
    this.getElementById('foo').setAttribute('class', 'bar');

    // return the DOM so it can be passed on to the next gulp step
    return this;
});
```

By default it is expected that the mutator function returns a DOM document, but
any `String` value can be returned. If the default is being used, the returned
DOM document will be serialized into a HTML document.

If the mutator function shall return something else than a DOM document its
important that serialization is turned off. Please see the
[serialize attribute](#serialize) for further information.


### serialize

Type: `Boolean`

By default the pugin assume that the returned value form the mutator function
is a DOM document and will then serialize the value into HTML document.

This attribute turns this serialization on and off. By providing no value or
`true` the returned value of the mutator function will be serialized. By
providing `false` the returned value of the mutator function will not be
serialized.

If the returned value of the mutator function is a `String` this values should
be set to `false`.

Example of mutator function which returns the content of a inline script tag as
a `String`:

```js
dom(function(){
    return this.querySelectorAll('script:not([src])')[0].innerHTML;
}, false)
```


## A note on jsdom

This plugin wraps [jsdom](https://github.com/tmpvar/jsdom). Though, this plugin
does not enable all features provided by jsdom. The sole purpose for jsdom in
this plugin is to parse a HTML document into a DOM so we can run operations on
it.

Features such as injecting scripts into the DOM which jsdom can do is not
enabled in this plugin.


## Tests

```bash
$ npm test
```

Tests are written in [mocha](http://mochajs.org/).


## License

The MIT License (MIT)

Copyright (c) 2014 - Trygve Lie - post@trygve-lie.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

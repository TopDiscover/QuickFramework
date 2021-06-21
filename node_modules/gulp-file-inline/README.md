# gulp-file-inline

[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependencies][dep-image]][dep-url]
[![DevDependencies][dev-dep-image]][dev-dep-url]

> A gulp plugin to inline link, script or other tags into the file.

## Usage

First, install `gulp-file-inline` as a development dependency:

```shell
npm install --save-dev gulp-file-inline
```

Then, add it to your `gulpfile.js`:

```js
var gulp = require('gulp');
var fileInline = require('gulp-file-inline');

gulp.task('default', function() {
	return gulp
		.src('index.html')
		.pipe(fileInline())
		.pipe(gulp.dest('dist'));
});
```

## Example

### Using filter

```js
var gulp = require('gulp');
var fileInline = require('gulp-file-inline');

gulp.task('default', function() {
	return gulp
		.src('index.html')
		.pipe(fileInline({
			js: {
				filter: function(tag) {
					return tag.indexOf(' data-inline="true"') > 0;
				}
			}
		}))
		.pipe(gulp.dest('dist'));
});
```

### Custom inline type

This is an example to inline images:

```js
var fs = require('fs');
var mime = require('mime');
var gulp = require('gulp');
var fileInline = require('gulp-file-inline');

gulp.task('default', function () {
	return gulp
		.src(['index.html'])
		.pipe(fileInline({
			img: {
				tagPattern: /<img[^>]* src=[^>]+>/g,
				urlPattern: / src=['"]?([^'"]+)['"]?/,
				tagParser: function (codes, attrCodes) {
					return '<img' + attrCodes + ' src="' + codes + '">';
				},
				parser: function (base, filename, encoding, minify) {
					var content = fs.readFileSync(filename).toString('base64');
					var contentType = mime.getType(filename);
					return 'data:' + contentType + ';base64,' + content;
				}
			}
		}))
		.pipe(gulp.dest('dist'));
});
```

## API

### fileInline(options)

#### options

Type: `Object`

Default:

```js
{
	css: {
		tagPattern: fileInline.CSS_TAG_PATTERN,
		urlPattern: fileInline.CSS_HREF_PATTERN,
		tagParser: fileInline.cssTagParser,
		parser: fileInline.cssParser,
		filter: null,
		minify: true //@see https://www.npmjs.com/package/clean-css#constructor-options
	},
	js: {
		tagPattern: fileInline.JS_TAG_PATTERN,
		urlPattern: fileInline.JS_SRC_PATTERN,
		tagParser: fileInline.jsTagParser,
		parser: fileInline.jsParser,
		filter: null,
		minify: true //@see https://www.npmjs.com/package/uglify-js#minify-options
	}
}
```

[build-url]: https://circleci.com/gh/Lanfei/gulp-file-inline
[build-image]: https://img.shields.io/circleci/project/github/Lanfei/gulp-file-inline.svg
[coverage-url]: https://coveralls.io/github/Lanfei/gulp-file-inline
[coverage-image]: https://coveralls.io/repos/github/Lanfei/gulp-file-inline/badge.svg
[version-url]: https://npmjs.org/package/gulp-file-inline
[version-image]: https://img.shields.io/npm/v/gulp-file-inline.svg
[license-url]: https://github.com/Lanfei/gulp-file-inline/blob/master/LICENSE
[license-image]: https://img.shields.io/npm/l/gulp-file-inline.svg
[dep-url]: https://david-dm.org/Lanfei/gulp-file-inline
[dep-image]: https://david-dm.org/Lanfei/gulp-file-inline/status.svg
[dev-dep-url]: https://david-dm.org/Lanfei/gulp-file-inline?type=dev
[dev-dep-image]: https://david-dm.org/Lanfei/gulp-file-inline/dev-status.svg

const through2 = require('through2');
const Vinyl = require('vinyl');
const JavaScriptObfuscator = require('javascript-obfuscator');
const PluginError = require('plugin-error');
const applySourceMap = require('vinyl-sourcemaps-apply');

module.exports = function gulpJavaScriptObfuscator (options = {}) {
	return through2.obj(function (file, enc, cb) {
		if (file.isNull()) return cb(null, file);
		if (!file.isBuffer()) throw new PluginError('gulp-javascript-obfuscator', 'Only Buffers are supported!');
		if (file.sourceMap) {
			options.sourceMap = true;
			options.inputFileName = file.relative;
			options.sourceMapMode = 'separate';
		}

		try {
			const obfuscationResult = JavaScriptObfuscator.obfuscate(String(file.contents), options);
			file.contents = new Buffer(obfuscationResult.getObfuscatedCode());
			if (options.sourceMap && options.sourceMapMode !== 'inline') {
				if ( file.sourceMap ) {
					const sourceMap = JSON.parse(obfuscationResult.getSourceMap());
					sourceMap.file = file.sourceMap.file;
					applySourceMap(file, sourceMap);
				}
				else {
					this.push(new Vinyl({
						cwd: file.cwd,
						base: file.base,
						path: file.path + '.map',
						contents: new Buffer(obfuscationResult.getSourceMap())
					}))
				}
			}
			return cb(null, file);
		} catch (err) {
			throw new PluginError('gulp-javascript-obfuscator', err);
		}
	});
};

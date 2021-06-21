/* jshint node: true, strict: true */

"use strict";

var jsdom = require("jsdom");
var PluginError = require('plugin-error');
var through2 = require("through2");
var pluginName = "gulp-dom";

module.exports = function (mutator) {
    var stream = through2.obj(function(file, enc, callback) {

        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return stream.emit("error", new PluginError(pluginName, "Streaming not supported"));
        }

        if (file.isBuffer()) {
            var dom = new jsdom.JSDOM(file.contents.toString("utf8"));
            var mutated = mutator.call(dom.window.document);

            file.contents = Buffer.from(typeof mutated === 'string' ? mutated : dom.serialize());
            callback(null, file);

            dom.window.close();
        }
    });

    return stream;
};

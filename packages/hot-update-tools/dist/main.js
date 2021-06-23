"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.unload = exports.load = void 0;
var fs = require("fs");
var path = require("path");
function load() {
}
exports.load = load;
function unload() {
}
exports.unload = unload;
exports.messages = {
    showPanel: function () {
        Editor.Panel.open("hot-update-tools", Editor.argv);
    },
    "editor:build-finished": function (t, options) {
        Editor.log("[HotUpdateTools] build platform:" + options.platform);
        if ("win32" === options.platform || "android" === options.platform || "ios" === options.platform || "mac" === options.platform) {
            var dest = path.normalize(options.dest);
            var mainJSPath_1 = path.join(dest, "main.js");
            fs.readFile(mainJSPath_1, "utf8", function (error, content) {
                if (error)
                    throw error;
                content = content.replace(/if\s*\(\s*window.jsb\)\s*\{/g, "if (window.jsb) {\nvar hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');\nif (hotUpdateSearchPaths) {\njsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));\n}");
                fs.writeFile(mainJSPath_1, content, function (error) {
                    if (error)
                        throw error;
                    Editor.log("[HotUpdateTools] SearchPath updated in built main.js for hot update");
                });
            });
        }
        else {
            Editor.log("[HotUpdateTools] don't need update main.js, platform: " + options.platform);
        }
    }
};

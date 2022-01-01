"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.messages = void 0;
const Helper_1 = require("./Helper");
exports.messages = {
    open_panel() {
        Editor.Panel.open("png-compress");
    }
};
const LOG_NAME = "[图片压缩]:";
function onBuildStart(options, callback) {
    if (Helper_1.helper.config.enabled) {
        Editor.log(LOG_NAME, "将在构建完成后自动压缩 PNG 资源");
    }
    callback();
}
function onBuildFinished(options, callback) {
    Helper_1.helper.onAfterBuild(options.dest).then(() => {
        callback();
    });
}
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
const load = function () {
    Editor.Builder.on('build-start', onBuildStart);
    Editor.Builder.on('build-finished', onBuildFinished);
};
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
const unload = function () {
    Editor.Builder.removeListener('build-start', onBuildStart);
    Editor.Builder.removeListener('build-finished', onBuildFinished);
};
exports.unload = unload;

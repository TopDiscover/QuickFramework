"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.messages = void 0;
//@ts-ignore
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
const Helper_1 = require("./Helper");
exports.messages = {
    showPanel() {
        Editor.Panel.open("hotupdate");
    }
};
function onBuildStart(options, callback) {
    Helper_1.helper.onBuildStart(options, callback);
}
function onBuildFinished(options, callback) {
    Helper_1.helper.onBuildFinished(options, callback);
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.messages = void 0;
const Helper_1 = require("./Helper");
const PACKAGE_NAME = "png-compress";
exports.messages = {
    open_panel() {
        Editor.Panel.open("png-compress");
    }
};
const LOG_NAME = "[图片压缩]:";
function onBuildStart(options, callback) {
    Helper_1.helper.readConfig();
    if (Helper_1.helper.config.enabled) {
        Helper_1.helper.config.isProcessing = true;
        Helper_1.helper.saveConfig();
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "onStartCompress");
    }
    else {
        Helper_1.helper.config.isProcessing = false;
        Helper_1.helper.saveConfig();
    }
    Editor.log("[图片压缩]:", `开始构建,构建平台:${options.platform}`);
    callback();
}
function onBuildFinished(options, callback) {
    Helper_1.helper.readConfig();
    if (Helper_1.helper.config.enabled) {
        Helper_1.helper.config.isProcessing = true;
        Helper_1.helper.saveConfig();
        Editor.Panel.open("png-compress");
    }
    else {
        Helper_1.helper.config.isProcessing = false;
        Helper_1.helper.saveConfig();
    }
    Editor.log(`${LOG_NAME} 构建完成,是否构建后自动压缩:${Helper_1.helper.config.enabled}`);
    Helper_1.helper.onAfterBuild({
        platform: options.platform,
        md5Cache: options.md5Cache,
        dest: options.dest,
        debug: options.debug
    }).then(() => {
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

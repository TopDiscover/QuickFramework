"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const Helper_1 = require("./Helper");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
const PACKAGE_NAME = "png-compress";
exports.methods = {
    open_panel() {
        Editor.Panel.open(PACKAGE_NAME);
    },
    onBeforeBuild(platform) {
        Helper_1.helper.readConfig();
        if (Helper_1.helper.config.enabled) {
            Helper_1.helper.config.isProcessing = true;
            Helper_1.helper.saveConfig();
            Editor.Message.send(PACKAGE_NAME, "onStartCompress");
        }
        else {
            Helper_1.helper.config.isProcessing = false;
            Helper_1.helper.saveConfig();
        }
        console.log("[图片压缩]:", `开始构建,构建平台:${platform}`);
    },
    onAfterBuild(op) {
        Helper_1.helper.readConfig();
        if (Helper_1.helper.config.enabled) {
            Helper_1.helper.config.isProcessing = true;
            Helper_1.helper.saveConfig();
            Editor.Panel.open(PACKAGE_NAME);
        }
        else {
            Helper_1.helper.config.isProcessing = false;
            Helper_1.helper.saveConfig();
        }
        Helper_1.helper.onAfterBuild(op);
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
const load = function () { };
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
const unload = function () { };
exports.unload = unload;

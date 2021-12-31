"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const Helper_1 = require("./Helper");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    open_panel() {
        Editor.Panel.open("png-compress");
    },
    log() {
        let args = [].concat(...arguments);
        console.log("[图片压缩]:", ...args);
    },
    warn() {
        let args = [].concat(...arguments);
        console.warn("[图片压缩]:", ...args);
    },
    error() {
        let args = [].concat(...arguments);
        console.error("[图片压缩]:", ...args);
    },
    onAfterBuild(dest) {
        Helper_1.helper.onAfterBuild(dest);
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

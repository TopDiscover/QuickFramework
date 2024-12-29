"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const Helper_1 = require("./Helper");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    showPanel() {
        Editor.Panel.open("hotupdate");
    },
    onAfterBuild(dest, platform) {
        if (Helper_1.helper.isSupportUpdate(platform)) {
            Helper_1.helper.onAfterBuild(dest);
        }
    },
    onBeforeBuild(platform) {
        console.log(`[热更新]开始构建，构建平台:${platform}`);
        if (Helper_1.helper.isSupportUpdate(platform)) {
            Helper_1.helper.onBeforeBuild();
        }
    },
    /**@description png图片压缩完成 */
    onPngCompressComplete(dest, platform) {
        console.log(`[热更新]png图片压缩完成,构建平台:${platform}`);
        if (Helper_1.helper.isSupportUpdate(platform)) {
            Helper_1.helper.onPngCompressComplete();
        }
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

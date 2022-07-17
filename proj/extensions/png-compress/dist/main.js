"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const HelperImpl_1 = require("./HelperImpl");
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
        HelperImpl_1.helper.read(true);
        if (HelperImpl_1.helper.data) {
            if (HelperImpl_1.helper.data.enabled) {
                HelperImpl_1.helper.data.isProcessing = true;
                HelperImpl_1.helper.save();
                Editor.Message.send(PACKAGE_NAME, "onStartCompress");
            }
            else {
                HelperImpl_1.helper.data.isProcessing = false;
                HelperImpl_1.helper.save();
            }
        }
        console.log("[图片压缩]:", `开始构建,构建平台:${platform}`);
    },
    onAfterBuild(op) {
        HelperImpl_1.helper.read(true);
        if (HelperImpl_1.helper.data) {
            if (HelperImpl_1.helper.data.enabled) {
                HelperImpl_1.helper.data.isProcessing = true;
                HelperImpl_1.helper.save();
                Editor.Panel.open(PACKAGE_NAME);
            }
            else {
                HelperImpl_1.helper.data.isProcessing = false;
                HelperImpl_1.helper.save();
            }
        }
        HelperImpl_1.helper.onAfterBuild(op);
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

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
        Editor.Panel.open("png-auto-compress");
    },
    /**@description 开始构建 */
    onBeforeBuild(options, result) {
        console.log(`=====onBeforeBuild=====>>${Helper_1.helper.config.enabled}`);
        if (Helper_1.helper.config.enabled) {
            console.log(`将在构建完成后自动压缩 PNG 资源`);
        }
    },
    onAfterBuild(options, result) {
        console.log(`=====onAfterBuild=====>>${Helper_1.helper.config.enabled}`);
        if (Helper_1.helper.config.enabled) {
            console.warn("开始压缩 PNG 资源，请勿进行其他操作！");
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

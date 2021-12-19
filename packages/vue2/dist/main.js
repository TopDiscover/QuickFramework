"use strict";
//@ts-ignore
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.messages = void 0;
exports.messages = {
    open_panel() {
        Editor.log("sssssssssssssssss");
        Editor.Panel.open("vue2");
    },
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

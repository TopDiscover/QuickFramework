"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
/**
* @en
* @zh 为扩展的主进程的注册方法
*/
exports.methods = {
    fixEngine() {
        console.log("测试");
    }
};
/**
* @en Hooks triggered after extension loading is complete
* @zh 扩展加载完成后触发的钩子
*/
const load = function () {
    console.log("加载fix_engine");
};
exports.load = load;
/**
* @en Hooks triggered after extension uninstallation is complete
* @zh 扩展卸载完成后触发的钩子
*/
const unload = function () {
    console.log("卸载fix_engine");
};
exports.unload = unload;

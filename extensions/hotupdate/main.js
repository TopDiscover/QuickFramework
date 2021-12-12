"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
// 扩展内定义的方法
exports.methods = {
    showPanel() {
        Editor.Panel.open('hotupdate');
    },
};
// 当扩展被启动的时候执行
function load() {
}
exports.load = load;
// 当扩展被关闭的时候执行
function unload() {
}
exports.unload = unload;
;

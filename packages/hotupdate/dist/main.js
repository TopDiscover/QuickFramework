"use strict";
//@ts-ignore
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.messages = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const Helper_1 = require("./Helper");
exports.messages = {
    showPanel() {
        Editor.Panel.open("hotupdate");
    },
    "editor:build-finished": (t, options) => {
        Editor.log("[HotUpdateTools] build platform:" + options.platform);
        if ("win32" === options.platform || "android" === options.platform || "ios" === options.platform || "mac" === options.platform) {
            let dest = path_1.default.normalize(options.dest);
            let mainJSPath = path_1.default.join(dest, "main.js");
            (0, fs_1.readFile)(mainJSPath, "utf8", (error, content) => {
                if (error)
                    throw error;
                content = content.replace(/if\s*\(\s*window.jsb\)\s*\{/g, `if (window.jsb) {
var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
if (hotUpdateSearchPaths) {
jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
}`);
                (0, fs_1.writeFile)(mainJSPath, content, (error) => {
                    if (error)
                        throw error;
                    Editor.log("[HotUpdateTools] SearchPath updated in built main.js for hot update");
                });
            });
        }
        else {
            Editor.log("[HotUpdateTools] don't need update main.js, platform: " + options.platform);
        }
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
const load = function () {
    Helper_1.helper.init();
};
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
const unload = function () { };
exports.unload = unload;

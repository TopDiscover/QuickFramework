//@ts-ignore
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */

import { readFile, writeFile } from "fs";
import path from "path";
import { helper } from "./Helper";

export const messages = {
    showPanel() {
        Editor.Panel.open("hotupdate");
    },
    "editor:build-finished": (t:any, options:BuildOptions) => {
        Editor.log("[HotUpdateTools] build platform:" + options.platform);
        if ("win32" === options.platform || "android" === options.platform || "ios" === options.platform || "mac" === options.platform) {
            let dest = path.normalize(options.dest);
            let mainJSPath = path.join(dest, "main.js");
            readFile(mainJSPath, "utf8", (error, content) => {
                if (error)
                    throw error;
                content = content.replace(/if\s*\(\s*window.jsb\)\s*\{/g, `if (window.jsb) {
var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
if (hotUpdateSearchPaths) {
jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
}`);
                writeFile(mainJSPath, content, (error) => {
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
}

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function() { 
    helper.init();
};

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function() { };

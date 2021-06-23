import * as fs from "fs"
import * as path from "path"
export function load() {

}

export function unload() {

}

export const messages = {
    showPanel: () => {
        Editor.Panel.open("hot-update-tools",Editor.argv);
    },
    "editor:build-finished": (t: any, options: Editor.BuildOptions) => {
        Editor.log("[HotUpdateTools] build platform:" + options.platform)
        if ("win32" === options.platform || "android" === options.platform || "ios" === options.platform || "mac" === options.platform) {
            let dest = path.normalize(options.dest);
            let mainJSPath = path.join(dest, "main.js");
            fs.readFile(mainJSPath, "utf8", (error, content) => {
                if (error) throw error;
                content = content.replace(/if\s*\(\s*window.jsb\)\s*\{/g, `if (window.jsb) {
var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
if (hotUpdateSearchPaths) {
jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
}`)
                fs.writeFile(mainJSPath, content, (error) => {
                    if (error) throw error;
                    Editor.log("[HotUpdateTools] SearchPath updated in built main.js for hot update")
                })
            })
        } else {
            Editor.log("[HotUpdateTools] don't need update main.js, platform: " + options.platform);
        }
    }
}
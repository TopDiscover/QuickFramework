module.exports = {
    load() {},
    unload() {},
    messages: {
        showPanel() {
            //Editor.log(JSON.stringify(Editor.argv));
            Editor.Panel.open("hot-update-tools",Editor.argv);
        },
        test(t, e) {
            Editor.log(e), Editor.Ipc.sendToPanel("hot-update-tools", "hot-update-tools:onBuildFinished")
        },
        "editor:build-finished": function (t, e) {
            let o = require("fire-fs"),
                a = require("fire-path");
            if (Editor.log("[HotUpdateTools] build platform:" + e.platform), "win32" === e.platform || "android" === e.platform || "ios" === e.platform || "mac" === e.platform) {
                let t = a.normalize(e.dest),
                    i = a.join(t, "main.js");
                o.readFile(i, "utf8", function (t, e) {
                    if (t) throw t;
                    let a = e.replace("(function () {", "(function () { \n\n    if (cc && cc.sys.isNative) { \n        var hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths'); \n        if (hotUpdateSearchPaths) { \n            jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths)); \n            console.log('[main.js] 热更新SearchPath: ' + JSON.parse(hotUpdateSearchPaths));\n        }else {\n            console.log('[main.js] 未获取到热更新资源路径!');\n        }\n    }else {\n        console.log('[main.js] 不是native平台!');\n    }\n");
                    o.writeFile(i, a, function (e) {
                        if (t) throw t;
                        Editor.log("[HotUpdateTools] SearchPath updated in built main.js for hot update")
                    })
                })
            } else Editor.log("[HotUpdateTools] don't need update main.js, platform: " + e.platform);
            let i = (new Date).getTime();
            Editor.Ipc.sendToPanel("hot-update-tools", "hot-update-tools:onBuildFinished", i), Editor.require("packages://hot-update-tools/core/CfgUtil.js").updateBuildTimeByMain(i)
        }
    }
};

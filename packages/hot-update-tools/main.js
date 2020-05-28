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
            let fs = require("fire-fs"),
                path = require("fire-path");
            if (Editor.log("[HotUpdateTools] build platform:" + e.platform), "win32" === e.platform || "android" === e.platform || "ios" === e.platform || "mac" === e.platform) {
                let t = path.normalize(e.dest),
                    i = path.join(t, "main.js");
                fs.readFile(i, "utf8", function (error, content) {
                    if (error) throw error;
                    content = content.replace(/if\s*\(\s*window.jsb\)\s*\{/g,`if (window.jsb) {
    var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
    if (hotUpdateSearchPaths) {
        jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
    }`)
                    fs.writeFile(i, content, function (e) {
                        if (error) throw error;
                        Editor.log("[HotUpdateTools] SearchPath updated in built main.js for hot update")
                    })
                })
            } else Editor.log("[HotUpdateTools] don't need update main.js, platform: " + e.platform);
            let i = (new Date).getTime();
            Editor.Ipc.sendToPanel("hot-update-tools", "hot-update-tools:onBuildFinished", i), Editor.require("packages://hot-update-tools/core/CfgUtil.js").updateBuildTimeByMain(i)
        }
    }
};

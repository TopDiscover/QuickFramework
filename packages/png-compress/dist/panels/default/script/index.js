"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const Helper_1 = require("../../../Helper");
let view = null;
module.exports = Editor.Panel.extend({
    template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {},
    messages: {
        //更新进度
        updateProgess(sender, progress) {
            if (view) {
                view.progress = progress;
                if (progress >= 100) {
                    view.isProcessing = false;
                }
            }
        },
        //压缩开始
        onStartCompress() {
            if (view) {
                view.isProcessing = true;
                view.progress = 0;
            }
        },
        //构建目录
        onSetBuildDir(sender, dir) {
            if (view) {
                view.buildAssetsDir = dir;
            }
        }
    },
    ready() {
        let self = this;
        let sourcePath = path_1.join(Editor.Project.path, "assets");
        const vm = new window.Vue({
            data() {
                return {
                    enabled: Helper_1.helper.config.enabled,
                    minQuality: Helper_1.helper.config.minQuality,
                    maxQuality: Helper_1.helper.config.maxQuality,
                    speed: Helper_1.helper.config.speed,
                    excludeFolders: Helper_1.helper.config.excludeFolders,
                    excludeFiles: Helper_1.helper.config.excludeFiles,
                    isProcessing: false,
                    progress: 0,
                    buildAssetsDir: "",
                    sourceAssetsDir: sourcePath,
                };
            },
            methods: {
                onChangeEnabled(enabled) {
                    // console.log("enabled",enabled);
                    Helper_1.helper.config.enabled = enabled;
                },
                onChangeMinQuality(value) {
                    // console.log("minQuality",value);
                    Helper_1.helper.config.minQuality = value;
                },
                onChangeMaxQuality(value) {
                    // console.log("maxQuality",value)
                    Helper_1.helper.config.maxQuality = value;
                },
                onChangeSpeed(value) {
                    // console.log("speed",value);
                    Helper_1.helper.config.speed = value;
                },
                onInputExcludeFoldersOver(value) {
                    // console.log("excludeFolders",value);
                    Helper_1.helper.config.excludeFolders = value;
                },
                onInputExcludeFilesOver(value) {
                    // console.log(`excludeFiles`,value);
                    Helper_1.helper.config.excludeFiles = value;
                },
                /**@description 保存配置 */
                onSaveConfig() {
                    Helper_1.helper.saveConfig();
                },
                onStartCompress() {
                    let view = this;
                    Helper_1.helper.onStartCompress(view.sourceAssetsDir);
                },
                onOpenBulidOutDir() {
                    let view = this;
                    let buildDir = view.buildAssetsDir;
                    if (!!!buildDir) {
                        buildDir = Editor.Project.path;
                    }
                    Editor.Dialog.openFile({
                        title: "打开构建目录",
                        defaultPath: buildDir,
                        properties: ["openDirectory"]
                    });
                },
                onOpenSourceAssetsDir() {
                    let view = this;
                    let sourceDir = view.sourceAssetsDir;
                    if (!!!sourceDir) {
                        sourceDir = Editor.Project.path;
                    }
                    Editor.Dialog.openFile({
                        title: "打开构建目录",
                        defaultPath: sourceDir,
                        properties: ["openDirectory"]
                    });
                }
            },
            created: function () {
                view = this;
            },
            mounted: function () {
            },
            el: self.shadowRoot
        });
    },
    beforeClose() { },
    close() { },
});

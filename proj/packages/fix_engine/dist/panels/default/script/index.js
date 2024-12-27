"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
let view = null;
let panel = null;
module.exports = Editor.Panel.extend({
    template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        startCompressBtn: "#startCompressBtn",
        saveBtn: "#saveBtn"
    },
    messages: {
        //更新进度
        updateProgess(sender, progress) {
            if (view) {
                view.progress = progress;
                // if (progress >= 100) {
                //     panel.$saveBtn.disabled = false;
                //     panel.$startCompressBtn.disabled = false;
                //     helper.data!.isProcessing = false;
                //     helper.save();
                // }
            }
        },
        //压缩开始
        onStartCompress() {
            if (view) {
                panel.$saveBtn.disabled = true;
                panel.$startCompressBtn.disabled = true;
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
        panel = this;
        let sourcePath = (0, path_1.join)(Editor.Project.path, "assets");
        const vm = new window.Vue({
            data() {
                return {
                // enabled: helper.data!.enabled,
                // enabledNoFound : helper.data!.enabledNoFound,
                // minQuality: helper.data!.minQuality,
                // maxQuality: helper.data!.maxQuality,
                // speed: helper.data!.speed,
                // excludeFolders: helper.data!.excludeFolders,
                // excludeFiles: helper.data!.excludeFiles,
                // progress: 0,//压缩进度
                // buildAssetsDir: "",//构建资源目录
                // sourceAssetsDir: sourcePath,
                };
            },
            methods: {
                onChangeEnabled(enabled) {
                    // console.log("enabled",enabled);
                    // helper.data!.enabled = enabled;
                    // helper.save();
                },
                onChangeEnabledNoFound(enabled) {
                    // helper.data!.enabledNoFound = enabled;
                    // helper.save();
                },
                onChangeMinQuality(value) {
                    // console.log("minQuality",value);
                    // helper.data!.minQuality = value;
                },
                onChangeMaxQuality(value) {
                    // console.log("maxQuality",value)
                    // helper.data!.maxQuality = value;
                },
                onChangeSpeed(value) {
                    // console.log("speed",value);
                    // helper.data!.speed = value;
                },
                onInputExcludeFoldersOver(value) {
                    // console.log("excludeFolders",value);
                    // helper.data!.excludeFolders = value;
                },
                onInputExcludeFilesOver(value) {
                    // console.log(`excludeFiles`,value);
                    // helper.data!.excludeFiles = value;
                },
                /**@description 保存配置 */
                onSaveConfig() {
                    // if ( helper.data!.isProcessing ){
                    //     helper.logger.warn(`${helper.module}处理过程中，请不要操作`);
                    //     return;
                    // }
                    // helper.save();
                },
                onStartCompress() {
                    // if ( helper.data!.isProcessing ){
                    //     helper.logger.warn(`${helper.module}处理过程中，请不要操作`);
                    //     return;
                    // }
                    // let view = this as any as MyView;
                    // helper.data!.isProcessing = true;
                    // helper.startCompress(view.sourceAssetsDir);
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
                // panel.$saveBtn.disabled = helper.data!.isProcessing;
                // panel.$startCompressBtn.disabled = helper.data!.isProcessing;
            },
            mounted: function () {
            },
            el: panel.shadowRoot
        });
    },
    beforeClose() { },
    close() { },
});

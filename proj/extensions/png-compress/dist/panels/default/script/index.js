"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const Helper_1 = require("../../../Helper");
let view = null;
module.exports = Editor.Panel.define({
    listeners: {},
    template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: "#app"
    },
    methods: {
        //更新进度
        updateProgess(progress) {
            if (view) {
                view.progress = progress;
                if (progress >= 100) {
                    view.isProcessing = false;
                    Helper_1.helper.config.isProcessing = false;
                    Helper_1.helper.saveConfig();
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
        onSetBuildDir(dir) {
            if (view) {
                view.buildAssetsDir = dir;
            }
        }
    },
    ready() {
        if (this.$.app) {
            let sourcePath = path_1.join(Editor.Project.path, "assets");
            const app = vue_1.createApp({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-");
            app.component("view-content", {
                template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        enabled: Helper_1.helper.config.enabled,
                        enabledNoFound: Helper_1.helper.config.enabledNoFound,
                        minQuality: Helper_1.helper.config.minQuality,
                        maxQuality: Helper_1.helper.config.maxQuality,
                        speed: Helper_1.helper.config.speed,
                        excludeFolders: Helper_1.helper.config.excludeFolders,
                        excludeFiles: Helper_1.helper.config.excludeFiles,
                        isProcessing: Helper_1.helper.config.isProcessing,
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
                    onChangeEnabledNoFound(enabled) {
                        Helper_1.helper.config.enabledNoFound = enabled;
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
                        Helper_1.helper.onStartCompress(this.sourceAssetsDir);
                    }
                },
                created() {
                    view = this;
                }
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});

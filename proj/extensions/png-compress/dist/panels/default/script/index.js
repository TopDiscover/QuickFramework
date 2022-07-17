"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vue_1 = require("vue");
const HelperImpl_1 = require("../../../HelperImpl");
let view = null;
module.exports = Editor.Panel.define({
    listeners: {},
    template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
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
                    HelperImpl_1.helper.data.isProcessing = false;
                    HelperImpl_1.helper.save();
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
            let sourcePath = (0, path_1.join)(Editor.Project.path, "assets");
            const app = (0, vue_1.createApp)({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-");
            app.component("view-content", {
                template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        enabled: HelperImpl_1.helper.data.enabled,
                        enabledNoFound: HelperImpl_1.helper.data.enabledNoFound,
                        minQuality: HelperImpl_1.helper.data.minQuality,
                        maxQuality: HelperImpl_1.helper.data.maxQuality,
                        speed: HelperImpl_1.helper.data.speed,
                        excludeFolders: HelperImpl_1.helper.data.excludeFolders,
                        excludeFiles: HelperImpl_1.helper.data.excludeFiles,
                        isProcessing: HelperImpl_1.helper.data.isProcessing,
                        progress: 0,
                        buildAssetsDir: "",
                        sourceAssetsDir: sourcePath,
                    };
                },
                methods: {
                    onChangeEnabled(enabled) {
                        // console.log("enabled",enabled);
                        HelperImpl_1.helper.data.enabled = enabled;
                        this.onSaveConfig();
                    },
                    onChangeEnabledNoFound(enabled) {
                        HelperImpl_1.helper.data.enabledNoFound = enabled;
                        this.onSaveConfig();
                    },
                    onChangeMinQuality(value) {
                        // console.log("minQuality",value);
                        HelperImpl_1.helper.data.minQuality = value;
                    },
                    onChangeMaxQuality(value) {
                        // console.log("maxQuality",value)
                        HelperImpl_1.helper.data.maxQuality = value;
                    },
                    onChangeSpeed(value) {
                        // console.log("speed",value);
                        HelperImpl_1.helper.data.speed = value;
                    },
                    onInputExcludeFoldersOver(value) {
                        // console.log("excludeFolders",value);
                        HelperImpl_1.helper.data.excludeFolders = value;
                    },
                    onInputExcludeFilesOver(value) {
                        // console.log(`excludeFiles`,value);
                        HelperImpl_1.helper.data.excludeFiles = value;
                    },
                    /**@description 保存配置 */
                    onSaveConfig() {
                        HelperImpl_1.helper.save();
                    },
                    onStartCompress() {
                        HelperImpl_1.helper.startCompress(this.sourceAssetsDir);
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

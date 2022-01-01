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
        app: '#app',
    },
    methods: {
        //更新进度
        updateProgess(progress) {
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
        onSetBuildDir(dir) {
            if (view) {
                view.buildDir = dir;
            }
        }
    },
    ready() {
        if (this.$.app) {
            const app = vue_1.createApp({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-");
            app.component('view-content', {
                template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        enabled: Helper_1.helper.config.enabled,
                        buildDir: Helper_1.helper.config.buildDir,
                        nodejs: Helper_1.helper.config.nodejs,
                        progress: 0,
                        isProcessing: false
                    };
                }, methods: {
                    onAutoComplete(value) {
                        Helper_1.helper.config.enabled = value;
                    },
                    onSelectBuildDir(dir) {
                        Helper_1.helper.config.buildDir = dir;
                    },
                    onCompress() {
                        Helper_1.helper.onStartCompress();
                    },
                    onSaveConfig() {
                        Helper_1.helper.saveConfig();
                    },
                    onSelectNodeJs(dir) {
                        Helper_1.helper.config.nodejs = dir;
                    }
                },
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});

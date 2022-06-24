import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp } from 'vue';
import { helper, MyView } from '../../../Helper';

let view: MyView = null!;
module.exports = Editor.Panel.define({
    listeners: {

    },
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: "#app"
    },
    methods: {
        //更新进度
        updateProgess(progress: number) {
            if (view) {
                view.progress = progress;
                if (progress >= 100) {
                    view.isProcessing = false;
                    helper.config.isProcessing = false;
                    helper.saveConfig();
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
        onSetBuildDir(dir: string) {
            if (view) {
                view.buildAssetsDir = dir;
            }
        }
    },
    ready() {
        if (this.$.app) {
            let sourcePath = join(Editor.Project.path, "assets");
            const app = createApp({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-")
            app.component("view-content", {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        enabled: helper.config.enabled,
                        enabledNoFound : helper.config.enabledNoFound,

                        minQuality: helper.config.minQuality,
                        maxQuality: helper.config.maxQuality,
                        speed: helper.config.speed,

                        excludeFolders: helper.config.excludeFolders,
                        excludeFiles: helper.config.excludeFiles,

                        isProcessing: helper.config.isProcessing,//开始及保存按钮操作状态
                        progress: 0,//压缩进度
                        buildAssetsDir: "",//构建资源目录
                        sourceAssetsDir: sourcePath,
                    }
                },
                methods: {
                    onChangeEnabled(enabled: boolean) {
                        // console.log("enabled",enabled);
                        helper.config.enabled = enabled;
                        this.onSaveConfig();
                    },
                    onChangeEnabledNoFound(enabled:boolean){
                        helper.config.enabledNoFound = enabled;
                        this.onSaveConfig();
                    },
                    onChangeMinQuality(value: number) {
                        // console.log("minQuality",value);
                        helper.config.minQuality = value;
                    },
                    onChangeMaxQuality(value: number) {
                        // console.log("maxQuality",value)
                        helper.config.maxQuality = value;
                    },
                    onChangeSpeed(value: number) {
                        // console.log("speed",value);
                        helper.config.speed = value;
                    },
                    onInputExcludeFoldersOver(value: string) {
                        // console.log("excludeFolders",value);
                        helper.config.excludeFolders = value;
                    },
                    onInputExcludeFilesOver(value: string) {
                        // console.log(`excludeFiles`,value);
                        helper.config.excludeFiles = value;
                    },
                    /**@description 保存配置 */
                    onSaveConfig() {
                        helper.saveConfig();
                    },
                    onStartCompress() {
                        helper.onStartCompress(this.sourceAssetsDir);
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

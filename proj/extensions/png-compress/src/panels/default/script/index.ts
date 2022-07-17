import { readFileSync } from 'fs';
import { join } from 'path';
import { createApp } from 'vue';
import { helper, MyView } from '../../../HelperImpl';

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
                    helper.data!.isProcessing = false;
                    helper.save();
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
                        enabled: helper.data!.enabled,
                        enabledNoFound : helper.data!.enabledNoFound,

                        minQuality: helper.data!.minQuality,
                        maxQuality: helper.data!.maxQuality,
                        speed: helper.data!.speed,

                        excludeFolders: helper.data!.excludeFolders,
                        excludeFiles: helper.data!.excludeFiles,

                        isProcessing: helper.data!.isProcessing,//开始及保存按钮操作状态
                        progress: 0,//压缩进度
                        buildAssetsDir: "",//构建资源目录
                        sourceAssetsDir: sourcePath,
                    }
                },
                methods: {
                    onChangeEnabled(enabled: boolean) {
                        // console.log("enabled",enabled);
                        helper.data!.enabled = enabled;
                        this.onSaveConfig();
                    },
                    onChangeEnabledNoFound(enabled:boolean){
                        helper.data!.enabledNoFound = enabled;
                        this.onSaveConfig();
                    },
                    onChangeMinQuality(value: number) {
                        // console.log("minQuality",value);
                        helper.data!.minQuality = value;
                    },
                    onChangeMaxQuality(value: number) {
                        // console.log("maxQuality",value)
                        helper.data!.maxQuality = value;
                    },
                    onChangeSpeed(value: number) {
                        // console.log("speed",value);
                        helper.data!.speed = value;
                    },
                    onInputExcludeFoldersOver(value: string) {
                        // console.log("excludeFolders",value);
                        helper.data!.excludeFolders = value;
                    },
                    onInputExcludeFilesOver(value: string) {
                        // console.log(`excludeFiles`,value);
                        helper.data!.excludeFiles = value;
                    },
                    /**@description 保存配置 */
                    onSaveConfig() {
                        helper.save();
                    },
                    onStartCompress() {
                        helper.startCompress(this.sourceAssetsDir);
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

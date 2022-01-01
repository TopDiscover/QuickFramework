import { existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import Vue from 'vue/dist/vue';
import { helper } from '../../../Helper';

interface MyView {
    sourceAssetsDir: string;
    buildAssetsDir: string;
    progress : number;
    isProcessing : boolean;
}
let view : MyView = null!;
module.exports = Editor.Panel.extend({
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {

    },
    messages: {
        //更新进度
        updateProgess(sender:any,progress:number) {
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
        onSetBuildDir(sender:any,dir: string) {
            if (view) {
                view.buildAssetsDir = dir;
            }
        }
    },
    ready() {
        let self = this as any;
        let sourcePath = join(Editor.Project.path, "assets");
        const vm = new window.Vue({
            data() {
                return {
                    enabled: helper.config.enabled,

                    minQuality: helper.config.minQuality,
                    maxQuality: helper.config.maxQuality,
                    speed: helper.config.speed,

                    excludeFolders: helper.config.excludeFolders,
                    excludeFiles: helper.config.excludeFiles,

                    isProcessing: false,//开始及保存按钮操作状态
                    progress: 0,//压缩进度
                    buildAssetsDir: "",//构建资源目录
                    sourceAssetsDir: sourcePath,
                };
            },
            methods: {
                onChangeEnabled(enabled: boolean) {
                    // console.log("enabled",enabled);
                    helper.config.enabled = enabled;
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
                    let view = this as any as MyView;
                    helper.onStartCompress(view.sourceAssetsDir);
                },
                onOpenBulidOutDir() {
                    let view = this as any as MyView;
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
                onOpenSourceAssetsDir(){
                    let view = this as any as MyView;
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
                view = this as any;
            },
            mounted: function () {

            },
            el: self.shadowRoot
        });
    },
    beforeClose() { },
    close() { },
});

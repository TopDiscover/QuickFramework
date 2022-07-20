import { readFileSync } from 'fs';
import { join } from 'path';
import { helper } from '../../../Helper';

interface MyView {
    sourceAssetsDir: string;
    buildAssetsDir: string;
    progress : number;
}
let view : MyView = null!;

interface MYPanel{
    shadowRoot : any;
    $startCompressBtn : HTMLButtonElement;
    $saveBtn : HTMLButtonElement;
}

let panel : MYPanel = null!;

module.exports = Editor.Panel.extend({
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        startCompressBtn : "#startCompressBtn",
        saveBtn : "#saveBtn"
    },
    messages: {
        //更新进度
        updateProgess(sender:any,progress:number) {
            if (view) {
                view.progress = progress;
                if (progress >= 100) {
                    panel.$saveBtn.disabled = false;
                    panel.$startCompressBtn.disabled = false;
                    helper.data!.isProcessing = false;
                    helper.save();
                }
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
        onSetBuildDir(sender:any,dir: string) {
            if (view) {
                view.buildAssetsDir = dir;
            }
        }
    },
    ready() {
        panel = this as any;
        let sourcePath = join(Editor.Project.path, "assets");
        const vm = new window.Vue({
            data() {
                return {
                    enabled: helper.data!.enabled,
                    enabledNoFound : helper.data!.enabledNoFound,

                    minQuality: helper.data!.minQuality,
                    maxQuality: helper.data!.maxQuality,
                    speed: helper.data!.speed,

                    excludeFolders: helper.data!.excludeFolders,
                    excludeFiles: helper.data!.excludeFiles,

                    progress: 0,//压缩进度
                    buildAssetsDir: "",//构建资源目录
                    sourceAssetsDir: sourcePath,
                };
            },
            methods: {
                onChangeEnabled(enabled: boolean) {
                    // console.log("enabled",enabled);
                    helper.data!.enabled = enabled;
                    helper.save();
                },
                onChangeEnabledNoFound(enabled:boolean){
                    helper.data!.enabledNoFound = enabled;
                    helper.save();
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
                    if ( helper.data!.isProcessing ){
                        helper.logger.warn(`${helper.module}处理过程中，请不要操作`);
                        return;
                    }
                    helper.save();
                },
                onStartCompress() {
                    if ( helper.data!.isProcessing ){
                        helper.logger.warn(`${helper.module}处理过程中，请不要操作`);
                        return;
                    }
                    let view = this as any as MyView;
                    helper.data!.isProcessing = true;
                    helper.startCompress(view.sourceAssetsDir);
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
                panel.$saveBtn.disabled = helper.data!.isProcessing;
                panel.$startCompressBtn.disabled = helper.data!.isProcessing;
            },
            mounted: function () {

            },
            el: panel.shadowRoot
        });
    },
    beforeClose() { },
    close() { },
});

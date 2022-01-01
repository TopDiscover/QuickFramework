import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp } from 'vue';
import { helper } from '../../../Helper';

interface MyView {
    isProcessing: boolean;
    progress: number;
    buildDir: string;
}
let view: MyView = null!;
module.exports = Editor.Panel.define({
    listeners: {

    },
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {
        //更新进度
        updateProgess(progress: number) {
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
        onSetBuildDir(dir: string) {
            if (view) {
                view.buildDir = dir;
            }
        }
    },
    ready() {
        if (this.$.app) {
            const app = createApp({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-")
            app.component('view-content', {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        enabled: helper.config.enabled,
                        buildDir: helper.config.buildDir,
                        nodejs : helper.config.nodejs,
                        progress: 0,
                        isProcessing : false
                    };
                }, methods: {
                    onAutoComplete(value: boolean) {
                        helper.config.enabled = value;
                    },
                    onSelectBuildDir(dir: string) {
                        helper.config.buildDir = dir;
                    },
                    onCompress() {
                        helper.onStartCompress();
                    },
                    onSaveConfig() {
                        helper.saveConfig();
                    },
                    onSelectNodeJs(dir:string){
                        helper.config.nodejs = dir;
                    }
                },
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});

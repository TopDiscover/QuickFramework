import { readFileSync } from 'fs';
import { join } from 'path';
import { createApp } from 'vue';
import { FixEngineConfig } from '../../../core/Defines';
import helper from '../../../main';

interface Data {
    creatorVerion: string;
    creatorPath: string;
    config: FixEngineConfig;
    isEnable: boolean;
    addText: string;
    supportVersion: string;
    tipState: string;
}

interface MyView extends Data {
}
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

    },
    ready() {
        if (this.$.app) {
            const app = createApp({});
            helper.read(true);
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-")
            app.component("view-content", {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        creatorVersion: helper.creatorVerion,
                        creatorPath: helper.creatorPath,
                        config: helper.data,
                        isEnable: true,
                        supportVersion: helper.supportVersions.join(" | "),
                        tipState: "",
                    };
                },
                methods: {
                    onInputIncludeItemOver(value: string) {
                        // console.log("onInputIncludeItemOver", value);
                        view.addText = value;
                    },
                    removeIncludeItem(index: number) {
                        console.log("removeIncludeItem", index, view.config.include[index]);
                        view.config.include.splice(index, 1);
                        helper.data = view.config;
                        helper.save();
                    },
                    addIncludeItem() {
                        console.log("addIncludeItem", view.addText);
                        if (view.config.include.includes(view.addText)) {
                            console.log("addIncludeItem重复", view.addText);
                            return;
                        }
                        view.config.include.push(view.addText);
                        helper.data = view.config;
                        helper.save();
                    },
                    reset() {
                        helper.data = helper.defaultData;
                        helper.save();
                        view.config = helper.data;
                    },
                    async onEngineBackup() {
                        view.isEnable = false;
                        view.tipState = "(引擎备份中，请稍等...)";
                        try {
                            setTimeout(async () => {
                                await helper.backupEngine();
                                view.isEnable = true;
                                view.tipState = "";
                            }, 100);
                        } catch (error) {
                            console.error(error);
                            view.isEnable = true;
                            view.tipState = "";
                        }
                    },
                    async onEngineRestore() {
                        view.isEnable = false;
                        view.tipState = "(引擎还原中，请稍等...)";
                        try {
                            setTimeout(async () => {
                                await helper.restoreEngine();
                                view.isEnable = true;
                                view.tipState = "";
                            }, 100);
                        } catch (error) {
                            console.error(error);
                            view.isEnable = true;
                            view.tipState = "";
                        }
                    },
                    async onSyncEngineToCustom() {
                        view.isEnable = false;
                        view.tipState = "(正在同步引擎修改，请稍等...)";
                        try {
                            setTimeout(async () => {
                                await helper.syncEngineToCustom();
                                view.isEnable = true;
                                view.tipState = "";
                            }, 100);
                        } catch (error) {
                            console.error(error);
                            view.isEnable = true;
                            view.tipState = "";
                        }
                    },
                    async onSyncCustomToEngine() {
                        // 检查是否有备份
                        if (helper.checkBackupEngine()){
                            view.isEnable = false;
                            view.tipState = "(正在同步自定义引擎修改，请稍等...)";
                            try {
                                setTimeout(async () => {
                                    await helper.syncCustomToEngine();
                                    view.isEnable = true;
                                    view.tipState = "";
                                }, 100);
                            } catch (error) {
                                console.error(error);
                                view.isEnable = true;
                                view.tipState = "";
                            }
                        }else{
                            const config = {
                                title: '警告',
                                detail: '',
                                buttons: ['取消', '备份'],
                            };
                            const code = await Editor.Dialog.warn('未检测到引擎的备份，请先备份引擎，是否继续?',config);
                            if (code.response == 1) {
                                await this.onEngineBackup();
                            }
                        }
                    },
                },
                created() {
                    view = this as any;
                }
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});

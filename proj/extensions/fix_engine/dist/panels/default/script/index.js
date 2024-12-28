"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vue_1 = require("vue");
const main_1 = __importDefault(require("../../../main"));
let view = null;
module.exports = Editor.Panel.define({
    listeners: {},
    template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: "#app"
    },
    methods: {},
    ready() {
        if (this.$.app) {
            const app = (0, vue_1.createApp)({});
            main_1.default.read(true);
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-");
            app.component("view-content", {
                template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        creatorVersion: main_1.default.creatorVerion,
                        creatorPath: main_1.default.creatorPath,
                        config: main_1.default.data,
                        isEnable: true
                    };
                },
                methods: {
                    onInputIncludeItemOver(value) {
                        // console.log("onInputIncludeItemOver", value);
                        view.addText = value;
                    },
                    removeIncludeItem(index) {
                        console.log("removeIncludeItem", index, view.config.include[index]);
                        view.config.include.splice(index, 1);
                        main_1.default.data = view.config;
                        main_1.default.save();
                    },
                    addIncludeItem() {
                        console.log("addIncludeItem", view.addText);
                        if (view.config.include.includes(view.addText)) {
                            console.log("addIncludeItem重复", view.addText);
                            return;
                        }
                        view.config.include.push(view.addText);
                        main_1.default.data = view.config;
                        main_1.default.save();
                    },
                    reset() {
                        main_1.default.data = main_1.default.defaultData;
                        main_1.default.save();
                        view.config = main_1.default.data;
                    },
                    async onEngineBackup() {
                        view.isEnable = false;
                        try {
                            await main_1.default.backupEngine();
                        }
                        catch (error) {
                            console.error(error);
                        }
                        view.isEnable = true;
                    },
                    onEngineRestore() {
                        // (this as any).setEnable(false);
                        // Editor.Ipc.sendToMain("fix_engine:onEngineRestore", (err: any, isSuccess: boolean) => {
                        //     Editor.log(`恢复引擎${isSuccess ? "成功" : "失败"}`);
                        //     (this as any).setEnable(true);
                        // });
                    },
                    onSyncEngineToCustom() {
                        // (this as any).setEnable(false);
                        // Editor.Ipc.sendToMain("fix_engine:onSyncEngineToCustom", (err: any, isSuccess: boolean) => {
                        //     Editor.log(`同步引擎修改到项目${isSuccess ? "成功" : "失败"}`);
                        //     (this as any).setEnable(true);
                        // });
                    },
                    async onSyncCustomToEngine() {
                        // 检查是否有备份
                        // Editor.Ipc.sendToMain("fix_engine:checkBackupEngine", async (err: any, isBackup: boolean) => {
                        //     Editor.log(`备份状态 : ${isBackup ? "已备份" : "未备份"}`);
                        //     if (isBackup) {
                        //         (this as any).setEnable(false);
                        //         Editor.Ipc.sendToMain("fix_engine:onSyncCustomToEngine", (err: any, isSuccess: boolean) => {
                        //             Editor.log(`同步项目修改到引擎${isSuccess ? "成功" : "失败"}`);
                        //             (this as any).setEnable(true);
                        //         });
                        //     } else {
                        //         const config = {
                        //             title: '警告',
                        //             detail: '未检测到引擎的备份，请先备份引擎，是否继续?',
                        //             buttons: ['取消', '备份'],
                        //         };
                        //         const code = await Editor.Dialog.messageBox(config);
                        //         if (code == 1) {
                        //             (this as any).onEngineBackup(false);
                        //         }
                        //     }
                        // });
                    },
                    setEnable(isEnable) {
                        // panel.$addIncludeBtn.disabled = !isEnable;
                        // panel.$addIncludeItem.disabled = !isEnable;
                        // panel.$resetBtn.disabled = !isEnable;
                        // panel.$engineBackup.disabled = !isEnable;
                        // panel.$engineRestore.disabled = !isEnable;
                        // panel.$syncEngineToCustom.disabled = !isEnable;
                        // panel.$syncCustomToEngine.disabled = !isEnable;
                    }
                },
                created() {
                    view = this;
                    Editor.Message.send("fix_engine", "creatorVersion");
                    // Editor.Message.send("fix_engine:creatorPath", (err: any, path: string) => {
                    //     view.creatorPath = path;
                    // });
                    // Editor.Message.send("fix_engine:getConfig", (err: any, data: FixEngineConfig) => {
                    //     view.config = data;
                    // });
                }
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});

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
                        isEnable: true,
                        supportVersion: main_1.default.supportVersions.join(" | "),
                        tipState: "",
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
                        view.tipState = "(引擎备份中，请稍等...)";
                        try {
                            setTimeout(async () => {
                                await main_1.default.backupEngine();
                                view.isEnable = true;
                                view.tipState = "";
                            }, 100);
                        }
                        catch (error) {
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
                                await main_1.default.restoreEngine();
                                view.isEnable = true;
                                view.tipState = "";
                            }, 100);
                        }
                        catch (error) {
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
                                await main_1.default.syncEngineToCustom();
                                view.isEnable = true;
                                view.tipState = "";
                            }, 100);
                        }
                        catch (error) {
                            console.error(error);
                            view.isEnable = true;
                            view.tipState = "";
                        }
                    },
                    async onSyncCustomToEngine() {
                        // 检查是否有备份
                        if (main_1.default.checkBackupEngine()) {
                            view.isEnable = false;
                            view.tipState = "(正在同步自定义引擎修改，请稍等...)";
                            try {
                                setTimeout(async () => {
                                    await main_1.default.syncCustomToEngine();
                                    view.isEnable = true;
                                    view.tipState = "";
                                }, 100);
                            }
                            catch (error) {
                                console.error(error);
                                view.isEnable = true;
                                view.tipState = "";
                            }
                        }
                        else {
                            const config = {
                                title: '警告',
                                detail: '',
                                buttons: ['取消', '备份'],
                            };
                            const code = await Editor.Dialog.warn('未检测到引擎的备份，请先备份引擎，是否继续?', config);
                            if (code.response == 1) {
                                await this.onEngineBackup();
                            }
                        }
                    },
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
let view = null;
let panel = null;
module.exports = Editor.Panel.extend({
    template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        addIncludeItem: "#addIncludeItem",
        engineBackup: "#engineBackup",
        engineRestore: "#engineRestore",
        syncEngineToCustom: "#syncEngineToCustom",
        syncCustomToEngine: "#syncCustomToEngine",
        addIncludeBtn: "#addIncludeBtn",
        resetBtn: "#resetBtn",
    },
    messages: {},
    ready() {
        panel = this;
        const vm = new window.Vue({
            data() {
                return {
                    creatorVerion: "",
                    creatorPath: "",
                    config: { include: [], exclude: [] },
                    isEnable: true,
                    supportVersions: "",
                };
            },
            methods: {
                removeIncludeItem(index) {
                    if (view.isEnable == false) {
                        Editor.log("操作中断");
                        return;
                    }
                    ;
                    Editor.log("removeIncludeItem", index, view.config.include[index]);
                    view.config.include.splice(index, 1);
                    Editor.Ipc.sendToMain("fix_engine:saveConfig", view.config);
                },
                addIncludeItem() {
                    if (view.isEnable == false) {
                        Editor.log("操作中断");
                        return;
                    }
                    Editor.log("addIncludeItem", panel.$addIncludeItem.value);
                    view.config.include.push(panel.$addIncludeItem.value);
                    Editor.Ipc.sendToMain("fix_engine:saveConfig", view.config);
                },
                reset() {
                    if (view.isEnable == false) {
                        Editor.log("操作中断");
                        return;
                    }
                    Editor.Ipc.sendToMain("fix_engine:restoreDefault", (err, data) => {
                        Editor.log("reset", data);
                        view.config = data;
                    });
                },
                onEngineBackup() {
                    this.setEnable(false);
                    Editor.Ipc.sendToMain("fix_engine:onEngineBackup", (err, isSuccess) => {
                        Editor.log(`备份引擎${isSuccess ? "成功" : "失败"}`);
                        this.setEnable(true);
                    });
                },
                onEngineRestore() {
                    this.setEnable(false);
                    Editor.Ipc.sendToMain("fix_engine:onEngineRestore", (err, isSuccess) => {
                        Editor.log(`恢复引擎${isSuccess ? "成功" : "失败"}`);
                        this.setEnable(true);
                    });
                },
                onSyncEngineToCustom() {
                    this.setEnable(false);
                    Editor.Ipc.sendToMain("fix_engine:onSyncEngineToCustom", (err, isSuccess) => {
                        Editor.log(`同步引擎修改到项目${isSuccess ? "成功" : "失败"}`);
                        this.setEnable(true);
                    });
                },
                async onSyncCustomToEngine() {
                    // 检查是否有备份
                    Editor.Ipc.sendToMain("fix_engine:checkBackupEngine", async (err, isBackup) => {
                        Editor.log(`备份状态 : ${isBackup ? "已备份" : "未备份"}`);
                        if (isBackup) {
                            this.setEnable(false);
                            Editor.Ipc.sendToMain("fix_engine:onSyncCustomToEngine", (err, isSuccess) => {
                                Editor.log(`同步项目修改到引擎${isSuccess ? "成功" : "失败"}`);
                                this.setEnable(true);
                            });
                        }
                        else {
                            const config = {
                                title: '警告',
                                detail: '未检测到引擎的备份，请先备份引擎，是否继续?',
                                buttons: ['取消', '备份'],
                            };
                            const code = await Editor.Dialog.messageBox(config);
                            if (code == 1) {
                                this.onEngineBackup(false);
                            }
                        }
                    });
                },
                setEnable(isEnable) {
                    panel.$addIncludeBtn.disabled = !isEnable;
                    panel.$addIncludeItem.disabled = !isEnable;
                    panel.$resetBtn.disabled = !isEnable;
                    panel.$engineBackup.disabled = !isEnable;
                    panel.$engineRestore.disabled = !isEnable;
                    panel.$syncEngineToCustom.disabled = !isEnable;
                    panel.$syncCustomToEngine.disabled = !isEnable;
                }
            },
            created: function () {
                view = this;
                Editor.Ipc.sendToMain("fix_engine:creatorVersion", (err, version) => {
                    view.creatorVerion = version;
                });
                Editor.Ipc.sendToMain("fix_engine:creatorPath", (err, path) => {
                    view.creatorPath = path;
                });
                Editor.Ipc.sendToMain("fix_engine:getConfig", (err, data) => {
                    view.config = data;
                });
                Editor.Ipc.sendToMain("fix_engine:supportVersion", (err, versions) => {
                    view.supportVersions = versions;
                });
            },
            mounted: function () {
            },
            el: panel.shadowRoot
        });
    },
    beforeClose() { },
    close() { },
});

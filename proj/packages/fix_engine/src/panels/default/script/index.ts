import { readFileSync } from 'fs';
import { join } from 'path';
import { FixEngineConfig } from '../../../core/Defines';


interface Data {
    creatorVerion: string;
    creatorPath: string;
    config: FixEngineConfig;
    isEnable: boolean;
    supportVersions: string;
}

interface MyView extends Data {
    sourceAssetsDir: string;
    buildAssetsDir: string;
    progress: number;
}
let view: MyView = null!;

interface MYPanel {
    shadowRoot: any;
    $addIncludeItem: HTMLInputElement;
    $engineBackup: HTMLButtonElement;
    $engineRestore: HTMLButtonElement;
    $syncEngineToCustom: HTMLButtonElement;
    $syncCustomToEngine: HTMLButtonElement;
    $addIncludeBtn: HTMLButtonElement;
    $resetBtn: HTMLButtonElement;
}

let panel: MYPanel = null!;

module.exports = Editor.Panel.extend({
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        addIncludeItem: "#addIncludeItem",
        engineBackup: "#engineBackup",
        engineRestore: "#engineRestore",
        syncEngineToCustom: "#syncEngineToCustom",
        syncCustomToEngine: "#syncCustomToEngine",
        addIncludeBtn: "#addIncludeBtn",
        resetBtn: "#resetBtn",
    },
    messages: {

    },
    ready() {
        panel = this as any;
        const vm = new window.Vue({
            data() {
                return {
                    creatorVerion: "",
                    creatorPath: "",
                    config: { include: [], exclude: [] } as FixEngineConfig,
                    isEnable: true,
                    supportVersions: "",
                };
            },
            methods: {
                removeIncludeItem(index: number) {
                    if (view.isEnable == false) {
                        Editor.log("操作中断");
                        return;
                    };
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
                    Editor.Ipc.sendToMain("fix_engine:restoreDefault", (err: any, data: FixEngineConfig) => {
                        Editor.log("reset", data);
                        view.config = data;
                    });
                },
                onEngineBackup() {
                    (this as any).setEnable(false);
                    Editor.Ipc.sendToMain("fix_engine:onEngineBackup", (err: any, isSuccess: boolean) => {
                        Editor.log(`备份引擎${isSuccess ? "成功" : "失败"}`);
                        (this as any).setEnable(true);
                    });
                },
                onEngineRestore() {
                    (this as any).setEnable(false);
                    Editor.Ipc.sendToMain("fix_engine:onEngineRestore", (err: any, isSuccess: boolean) => {
                        Editor.log(`恢复引擎${isSuccess ? "成功" : "失败"}`);
                        (this as any).setEnable(true);
                    });
                },
                onSyncEngineToCustom() {
                    (this as any).setEnable(false);
                    Editor.Ipc.sendToMain("fix_engine:onSyncEngineToCustom", (err: any, isSuccess: boolean) => {
                        Editor.log(`同步引擎修改到项目${isSuccess ? "成功" : "失败"}`);
                        (this as any).setEnable(true);
                    });
                },
                async onSyncCustomToEngine() {
                    // 检查是否有备份
                    Editor.Ipc.sendToMain("fix_engine:checkBackupEngine", async (err: any, isBackup: boolean) => {
                        Editor.log(`备份状态 : ${isBackup ? "已备份" : "未备份"}`);
                        if (isBackup) {
                            (this as any).setEnable(false);
                            Editor.Ipc.sendToMain("fix_engine:onSyncCustomToEngine", (err: any, isSuccess: boolean) => {
                                Editor.log(`同步项目修改到引擎${isSuccess ? "成功" : "失败"}`);
                                (this as any).setEnable(true);
                            });
                        } else {
                            const config = {
                                title: '警告',
                                detail: '未检测到引擎的备份，请先备份引擎，是否继续?',
                                buttons: ['取消', '备份'],
                            };
                            const code = await Editor.Dialog.messageBox(config);
                            if (code == 1) {
                                (this as any).onEngineBackup(false);
                            }
                        }
                    });


                },
                setEnable(isEnable: boolean) {
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
                view = this as any;
                Editor.Ipc.sendToMain("fix_engine:creatorVersion", (err: any, version: string) => {
                    view.creatorVerion = version;
                });
                Editor.Ipc.sendToMain("fix_engine:creatorPath", (err: any, path: string) => {
                    view.creatorPath = path;
                });
                Editor.Ipc.sendToMain("fix_engine:getConfig", (err: any, data: FixEngineConfig) => {
                    view.config = data;
                });
                Editor.Ipc.sendToMain("fix_engine:supportVersion", (err: any, versions: string) => {
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

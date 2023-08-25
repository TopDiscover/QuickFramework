import { Update } from "../framework/core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../framework/core/update/UpdateItem";
import { Macro } from "../framework/defines/Macros";

/**@description 大厅更新代理 */
export class HallUpdateHandlerImpl implements UpdateHandlerDelegate, ISingleton {
    static module = "【大厅热更新】"
    module: string = null!;
    isResident = true;

    onNewVersionFund(item: UpdateItem): void {
        item.doUpdate();
    }
    onUpdateFailed(item: UpdateItem): void {
        let content = App.getLanguage("downloadFailed");
        App.alert.show({
            text: content,
            confirmCb: (isOK) => {
                item.checkUpdate();
            }
        });
        App.updateLoading.hide();
    }
    onPreVersionFailed(item: UpdateItem): void {
        let content = App.getLanguage("downloadFailed");
        App.alert.show({
            text: content,
            confirmCb: (isOK) => {
                item.checkUpdate();
            }
        });
        App.updateLoading.hide();
    }
    onShowUpdating(item: UpdateItem): void {
        App.updateLoading.show(App.getLanguage("loading"));
    }
    onNeedUpdateMain(item: UpdateItem): void {
        App.updateLoading.hide();
        let content = App.getLanguage("mainPackVersionIsTooLow") as string;
        App.alert.show({
            text: content,
            confirmCb: (isOK) => {
                if (App.stageData.isLoginStage()) {
                    //如果是在登录界面，直接检测更新
                    App.entryManager.onCheckUpdate();
                } else {
                    App.entryManager.enterBundle(Macro.BUNDLE_RESOURCES);
                }
            }
        });
    }
    onOther(item: UpdateItem): void {

    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        App.updateLoading.updateProgress(info.progress);
    }
    onAreadyUpToData(item: UpdateItem): void {
        //大厅更新，直接进入
        App.bundleManager.loadBundle(item);
    }
    onStarCheckUpdate(item: UpdateItem): void {
        App.updateLoading.show(App.getLanguage("loading"));
    }
    onStartLoadBundle(item: UpdateItem): void {

    }
    onLoadBundleError(item: UpdateItem, err: Error | null): void {
        App.updateLoading.hide();
        App.tips.show(App.getLanguage("loadFailed",[item.name]));
    }
    onLoadBundleComplete(item: UpdateItem): void {
        App.updateLoading.hide();
        App.entryManager.onLoadBundleComplete(item);
    }
    onLoadBundle(item: UpdateItem): void {
        App.bundleManager.loadBundle(item);
    }
    onDownloadComplete(item: UpdateItem): void {
        App.releaseManger.tryRemoveBundle(item.bundle);
        this.onLoadBundle(item);
    }
    onNeedRestartApp(item: UpdateItem, onComplete: (isDelayRestart : boolean)=>void): void {
        let where = App.stageData.where;
        Log.d(`重启游戏,当前位置 :${where},之前位置 : ${App.stageData.prevWhere}`);
        if ( where == Macro.BUNDLE_RESOURCES ){
            onComplete(true);
        }else{
            let content = App.getLanguage("restartApp",[item.name])
            App.alert.show({
                text: content,
                confirmCb: (isOK) => {
                    onComplete(false);
                }
            });
        }
    }
}
import { Update } from "../core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../core/update/UpdateItem";

/**@description 主包更新代理 */
export class MainUpdate implements UpdateHandlerDelegate, ISingleton {
    static module: string = "【主包热更新】";
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
    
    onOther(item: UpdateItem): void {

    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        App.updateLoading.updateProgress(info.progress);
    }
    onAreadyUpToData(item: UpdateItem): void {
        App.updateLoading.hide();
        App.entryManager.onMainUpdateComplete(item);
    }
    onStarCheckUpdate(item: UpdateItem): void {
        App.updateLoading.show(App.getLanguage("loading"));
    }
    onStartLoadBundle(item: UpdateItem): void {

    }
    onLoadBundleError(item: UpdateItem, err: Error | null): void {
        //主包原则上说是不可能加载错误的
        App.updateLoading.hide();
        App.tips.show(App.getLanguage("loadFailed",[item.name]));
        Log.dump(err, "onLoadBundleError");
    }
    onLoadBundleComplete(item: UpdateItem): void {
        App.updateLoading.hide();
        App.entryManager.onLoadBundleComplete(item);
    }
    onLoadBundle(item: UpdateItem): void {
        //主包不会释放，直接隐藏loading
        App.updateLoading.hide();
    }
    onDownloadComplete(item: UpdateItem): void {

    }
    onNeedRestartApp(item: UpdateItem, onComplete: (isDelayRestart : boolean)=>void): void {
        onComplete(true);
    }
}
import { Update } from "../../framework/core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../../framework/core/update/UpdateItem";

/**@description 主包更新代理 */
export class MainUpdateHandlerImpl implements UpdateHandlerDelegate , ISingleton{
    static module: string = "【主包热更新】";
    module: string = null!;
    isResident = true;
    onNewVersionFund(item: UpdateItem): void {
        item.doUpdate();
    }
    onUpdateFailed(item: UpdateItem): void {
        let content = Manager.getLanguage("downloadFailed");
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                item.downloadFailedAssets();
            }
        });
        Manager.updateLoading.hide();
    }
    onPreVersionFailed(item: UpdateItem): void {
        let content = Manager.getLanguage("downloadFailed");
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                item.checkUpdate();
            }
        });
        Manager.updateLoading.hide();
    }
    onShowUpdating(item: UpdateItem): void {
        Manager.updateLoading.show(Manager.getLanguage("loading"));
    }
    onNeedUpdateMain(item: UpdateItem): void {
        
    }
    onOther(item: UpdateItem): void {
        
    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        Manager.updateLoading.updateProgress(info.progress);
    }
    onAreadyUpToData(item: UpdateItem): void {
        Manager.updateLoading.hide();
    }
    onTryDownloadFailedAssets(item: UpdateItem): void {
        item.downloadFailedAssets();
    }
    onStarCheckUpdate(item: UpdateItem): void {
        Manager.updateLoading.show(Manager.getLanguage("loading"));
    }
    onStartLoadBundle(item: UpdateItem): void {
        
    }
    onLoadBundleError(item: UpdateItem, err: Error | null): void {
        //主包原则上说是不可能加载错误的
        Manager.updateLoading.hide();
        Manager.tips.show(Manager.getLanguage(["loadFailed",item.name]));
        Log.dump(err,"onLoadBundleError");
    }
    onLoadBundleComplete(item: UpdateItem): void {
        Manager.updateLoading.hide();
        Manager.entryManager.onLoadBundleComplete(item);
    }
    onLoadBundle(item: UpdateItem): void {
        //主包不会释放，直接隐藏loading
        Manager.updateLoading.hide();
    }
    onDownloadComplete(item:UpdateItem):void{
        
    }
}
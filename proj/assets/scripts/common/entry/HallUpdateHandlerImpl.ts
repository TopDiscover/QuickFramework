import { Update } from "../../framework/core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../../framework/core/update/UpdateItem";
import { Macro } from "../../framework/defines/Macros";
import { Global } from "../data/Global";

/**@description 大厅更新代理 */
export class HallUpdateHandlerImpl implements UpdateHandlerDelegate {
    private static _instance: HallUpdateHandlerImpl = null!;
    public static Instance() { return this._instance || (this._instance = new HallUpdateHandlerImpl()); }
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
        Manager.updateLoading.hide();
        let content = Manager.getLanguage("mainPackVersionIsTooLow") as string;
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                let data = Manager.dataCenter.get(Global) as Global;
                if ( data.where == Macro.BUNDLE_RESOURCES ){
                    //如果是在登录界面，直接检测更新
                    Manager.entryManager.onCheckUpdate();
                }else{
                    Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES);
                }
            }
        });
    }
    onOther(item: UpdateItem): void {
        
    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        Manager.updateLoading.updateProgress(info.progress);
    }
    onAreadyUpToData(item: UpdateItem): void {
        //大厅更新，直接进入
        Manager.bundleManager.loadBundle(item);
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
        Manager.updateLoading.hide();
        Manager.tips.show(Manager.getLanguage(["loadFailed",item.name]));
    }
    onLoadBundleComplete(item: UpdateItem): void {
        Manager.updateLoading.hide();
        Manager.entryManager.onLoadBundleComplete(item);
    }
    onLoadBundle(item: UpdateItem): void {
        Manager.bundleManager.loadBundle(item);
    }
    onDownloadComplete(item:UpdateItem):void{
        Manager.releaseManger.tryRemoveBundle(item.bundle);
        this.onLoadBundle(item);
    }
}
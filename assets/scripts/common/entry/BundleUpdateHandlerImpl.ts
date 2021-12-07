import { Update } from "../../framework/core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../../framework/core/update/UpdateItem";
import { Macro } from "../../framework/defines/Macros";
/**@description bundle更新下载代理 */
export class BundleUpdateHandlerImpl implements UpdateHandlerDelegate {
    private static _instance: BundleUpdateHandlerImpl = null!;
    public static Instance() { return this._instance || (this._instance = new BundleUpdateHandlerImpl()); }
    onNewVersionFund(item: UpdateItem): void {
        item.doUpdate();
    }
    onUpdateFailed(item: UpdateItem): void {
        Manager.tips.show(Manager.getLanguage(["updateFaild",item.name]));
    }
    onUpdating(item: UpdateItem): void {
        Manager.tips.show(Manager.getLanguage("checkingUpdate"));
    }
    onNeedUpdateMain(item: UpdateItem): void {
        let content = Manager.getLanguage("mainPackVersionIsTooLow") as string;
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES);
            }
        });
    }
    onOther(item: UpdateItem): void {
        
    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        throw new Error("Method not implemented.");
    }
    onAreadyUpToData(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }
    onTryDownloadFailedAssets(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }
    onStarCheckUpdate(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }
    onStartLoadBundle(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }
    onLoadBundleError(item: UpdateItem, err: Error | null): void {
        throw new Error("Method not implemented.");
    }
    onLoadBundleComplete(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }

}
import { Update } from "../../framework/core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../../framework/core/update/UpdateItem";

/**@description 大厅更新代理 */
export class HallUpdateHandlerImpl implements UpdateHandlerDelegate {
    private static _instance: HallUpdateHandlerImpl = null!;
    public static Instance() { return this._instance || (this._instance = new HallUpdateHandlerImpl()); }
    onNewVersionFund(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }
    onUpdateFailed(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }
    onUpdating(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }
    onNeedUpdateMain(item: UpdateItem): void {
        throw new Error("Method not implemented.");
    }
    onOther(item: UpdateItem): void {
        throw new Error("Method not implemented.");
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
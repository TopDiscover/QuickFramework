import { Update } from "./Update";

/**
 * @description 更新项状态
 */
export enum UpdateItemStatus {
    /**@description 无状态 */
    None,
    /**@description 检测更新中 */
    Checking,
}

/**@description 更新项处理者代理 */
export interface UpdateHandlerDelegate {
    /**@description 正在检测更新 */
    onChecking(item: UpdateItem): void;
    /**@description 发现新版本*/
    onNewVersionFund(item: UpdateItem): void;
    /**@description 下载失败 */
    onDownloadFailed(item: UpdateItem): void;
    /**@description 正在更新 */
    onUpdating(item: UpdateItem): void;
    /**@description 需要更新主包 */
    onNeedUpdateMain(item: UpdateItem): void;
    /**@description 其它状态 */
    onOther(item: UpdateItem, code: Update.Code, state: Update.State): void;
    /**@description 下载进度 */
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void;
    /**@description 已经是最新版本 */
    onAreadyUpToData(item:UpdateItem):void;
}

/**@description 更新项处理者 */
export class UpdateHandler implements UpdateHandlerDelegate {

    delegate: UpdateHandlerDelegate | null = null;
    onChecking(item: UpdateItem): void {
        if ( item.state == Update.State.DOWNLOADING_VERSION ){
            Manager.tips.show(Manager.getLanguage("loadVersions"));
        }else if ( item.code == Update.Code.ERROR_DOWNLOAD_MANIFEST ){
            Manager.tips.show(Manager.getLanguage("warnNetBad"));
        }
        if (this.delegate) this.delegate.onChecking(item);
    }
    onNewVersionFund(item: UpdateItem): void {
        if (this.delegate) this.delegate.onNewVersionFund(item);
    }
    onDownloadFailed(item: UpdateItem): void {
        if (this.delegate) this.delegate.onDownloadFailed(item);
    }
    onUpdating(item: UpdateItem): void {
        if (this.delegate) this.delegate.onUpdating(item);
    }
    onNeedUpdateMain(item: UpdateItem): void {
        if (this.delegate) this.delegate.onNeedUpdateMain(item);
    }
    onOther(item: UpdateItem, code: Update.Code, state: Update.State): void {
        if (this.delegate) this.delegate.onOther(item, code, state);
    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        if (this.delegate) this.delegate.onDownloading(item, info);
    }
    onAreadyUpToData(item:UpdateItem):void{
        if ( this.delegate ) this.delegate.onAreadyUpToData(item);
    }
}

export class UpdateItem {
    /**@description 更新项名字,如果大厅 */
    name: string = "";
    /**@description 更新项bundle名 */
    bundle: string = "";
    /**@description 处理者,统一指定，具体实现由内部的代理来处理 */
    handler: UpdateHandler = new UpdateHandler();
    /**@description 下载项状态 */
    status: UpdateItemStatus = UpdateItemStatus.None;
    /**@description 更新用户自定义数据,多次点击，以最新数据为主 */
    userData: any = null;

    code : Update.Code = Update.Code.UNINITED;
    state : Update.State = Update.State.UNINITED;

    /**@description 是否在检测更新中 */
    get isChecking(){
        if ( this.state == Update.State.DOWNLOADING_VERSION){
            return true;
        }
        return false;
    }
}


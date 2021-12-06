import { Update } from "./Update";

/**
 * @description 更新项状态
 */
export enum UpdateItemStatus {

}

/**@description 更新项处理者 */
export interface UpdateHandler {
    /**
     * @description 发现新版本
     * @param item 
     */
    onNewVersionFund(item: UpdateItem): void;
    /**@description 下载失败 */
    onDownloadFailed(item: UpdateItem): void;
    /**@description 正在更新 */
    onUpdating(item:UpdateItem):void;
    /**@description 需要更新主包 */
    onNeedUpdateMain(item:UpdateItem):void;
    /**@description 其它状态 */
    onOther(item:UpdateItem,code:Update.Code,state:Update.State):void;
    /**@description 下载进度 */
    onDownloading(item:UpdateItem,info:Update.DownLoadInfo):void;
}

export class UpdateItem {
    /**@description 更新项名字,如果大厅 */
    name: string = "";
    /**@description 更新项bundle名 */
    bundle: string = "";
    /**@description 处理者 */
    handler:UpdateHandler = null!;
}


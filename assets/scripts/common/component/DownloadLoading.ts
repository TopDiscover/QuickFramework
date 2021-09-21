import UIView from "../../framework/core/ui/UIView";
import { find, Label, ProgressBar, tween, _decorator } from "cc";
import { DEBUG } from "cc/env";
import { i18n } from "../language/CommonLanguage";
import { HotUpdate } from "../../framework/core/hotupdate/Hotupdate";

/**@description 下载界面 */
const { ccclass, property } = _decorator;

@ccclass
export default class DownloadLoading extends UIView {

    public static getPrefabUrl(){
        return "common/prefabs/DownloadLoading";
    }
    
    /**@description 下载过程中提示语 */
    private get tips(){
        return i18n.updatingtips;
    }

    /**@description 下载进度 */
    private progress : ProgressBar = null!;

    /**@description 下载过程中显示文字的节点 */
    private tipsLabel : Label = null!;

    private tipsIndex = 0;

    /**@description 下载的状态 */
    private state : HotUpdate.State = null!;

    private updateName = "";

    protected addEvents() {
        super.addEvents();
        this.addEvent(HotUpdate.Event.HOTUPDATE_DOWNLOAD, this.onDownload);
    }

    onLoad(){
        super.onLoad();
        if( this.args ){
            this.state = this.args[0];
            this.updateName = this.args[1];
        }
        this.tipsLabel = find("tips",this.node)?.getComponent(Label) as Label;
        this.progress = find("progressBar",this.node)?.getComponent(ProgressBar) as ProgressBar;
        this.startTips();
        this.scheduleOnce(this.doUpdate,1.5);
    }

    private doUpdate() {
        if (this.state == HotUpdate.State.TRY_DOWNLOAD_FAILED_ASSETS) {
            Manager.hotupdate.downloadFailedAssets();
        }else{
            Manager.hotupdate.hotUpdate();
        }
    }

    private startTips() {
       tween(this.tipsLabel.node)
       .call(()=>{
           this.tipsLabel.string = this.tips[this.tipsIndex];
       })
       .delay(2)
       .call(()=>{
           this.tipsIndex++;
           if( this.tipsIndex >= this.tips.length ){
               this.tipsIndex = 0;
           }
           this.startTips();
       })
       .start();
    }

    private onDownload(info: HotUpdate.DownLoadInfo) {
        if (DEBUG) Log.d(JSON.stringify(info));
        if (info.code == HotUpdate.Code.UPDATE_PROGRESSION) {
            this.progress.progress = info.percent == Number.NaN ? 0 : info.percent;
        } else if (info.code == HotUpdate.Code.ALREADY_UP_TO_DATE) {
            this.progress.progress = 1;
        } else if (info.code == HotUpdate.Code.UPDATE_FINISHED) {
            Manager.tips.show(String.format(i18n.alreadyRemoteVersion, this.updateName));
            this.close();
        } else if (info.code == HotUpdate.Code.UPDATE_FAILED ||
            info.code == HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST ||
            info.code == HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST ||
            info.code == HotUpdate.Code.ERROR_PARSE_MANIFEST ||
            info.code == HotUpdate.Code.ERROR_UPDATING ||
            info.code == HotUpdate.Code.ERROR_DECOMPRESS) {
            Manager.tips.show(String.format(i18n.updateFaild, this.updateName));
            this.close();
        }
    }
}

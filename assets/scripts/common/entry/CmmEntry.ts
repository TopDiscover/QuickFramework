import { EntryDelegate } from "../../framework/core/entry/EntryDelegate";
import { HotUpdate } from "../../framework/core/hotupdate/Hotupdate";
import GameView from "../../framework/core/ui/GameView";
import { Macro } from "../../framework/defines/Macros";
import { Config } from "../config/Config";
import { i18n } from "../language/CommonLanguage";

export class CmmEntry extends EntryDelegate {

    /**@description 当前有正在加载中的bundle */
    onBundleLoading(versionInfo: HotUpdate.BundleConfig) {
        if ( versionInfo.bundle == Macro.BUNDLE_RESOURCES ){
            Manager.loading.show(i18n.checkingUpdate);
        }else{
            super.onBundleLoading(versionInfo);
        }
    }

    /**@description 发现新版本 */
    onNewVersionFund(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        if( versionInfo.bundle == Macro.BUNDLE_RESOURCES ){
            this.showUpdate(versionInfo,code,state);
        }else{
            super.onNewVersionFund(versionInfo,code,state);
        }
    }

    /**@description 下载失败 */
    onDownloadFailed(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        if ( versionInfo.bundle == Macro.BUNDLE_RESOURCES ){
            this.showUpdate(versionInfo,code,state);
        }else{
            super.onDownloadFailed(versionInfo,code,state);
        }
    }


    /**@description 当前已经是新包，无需更新 */
    onAreadyUpToData(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        if ( versionInfo.bundle == Macro.BUNDLE_RESOURCES ){
            Manager.loading.hide();
        }else{
            super.onAreadyUpToData(versionInfo,code,state)
        }
    }

    /**@description 下载版本文件失败 */
    onDownloadManifestFailed(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        super.onDownloadManifestFailed(versionInfo,code,state);
        Manager.loading.hide;
    }

    /**@description 进入bundle完成 */
    onEnterBundleComplete( entry : Entry , gameView : GameView){
        super.onEnterBundleComplete(entry,gameView);
        Manager.serviceManager.hideReconnet();
    }

    private showUpdate(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        cc.log(`提示更新`);
        Manager.loading.hide();
        Manager.alert.show({
            text: i18n.newVersion, confirmCb: (isOK) => {
                let data: HotUpdate.MessageData = {
                    isOk: isOK,
                    state: state,
                    name: i18n.hallText,
                    bundle: Config.BUNDLE_HALL
                };
                dispatch(HotUpdate.Event.DOWNLOAD_MESSAGE, data);
            }
        });
    }

    getEntryConfig(bundle:string) : HotUpdate.BundleConfig | null {
        let keys = Object.keys(Config.ENTRY_CONFIG);
        for( let i = 0 ; i < keys.length ; i++ ){
            let config : HotUpdate.BundleConfig = Config.ENTRY_CONFIG[keys[i]];
            if ( config && config.bundle == bundle ){
                return config;
            }
        }
        if( CC_DEBUG ){
            cc.error(`未找到入口配置信息`);
        }
        return null;
    }
}
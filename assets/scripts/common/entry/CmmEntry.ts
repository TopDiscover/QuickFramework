import { DEBUG } from "cc/env";
import { EntryDelegate } from "../../framework/core/entry/EntryDelegate";
import { HotUpdate } from "../../framework/core/hotupdate/Hotupdate";
import { Macro } from "../../framework/defines/Macros";
import { Config } from "../config/Config";
import { Global } from "../data/Global";
import { i18n } from "../language/CommonLanguage";

export class CmmEntry extends EntryDelegate {

    /**@description 当前有正在加载中的bundle */
    onBundleLoading(versionInfo: HotUpdate.BundleConfig) {
        if (versionInfo.bundle == Macro.BUNDLE_RESOURCES) {
            Manager.loading.show(i18n.checkingUpdate);
        } else {
            super.onBundleLoading(versionInfo);
        }
    }

    /**@description 发现新版本 */
    onNewVersionFund(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        if (versionInfo.bundle == Macro.BUNDLE_RESOURCES) {
            this.showUpdate(versionInfo, code, state);
        } else {
            super.onNewVersionFund(versionInfo, code, state);
        }
    }

    /**@description 下载失败 */
    onDownloadFailed(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        if (versionInfo.bundle == Macro.BUNDLE_RESOURCES) {
            this.showUpdate(versionInfo, code, state);
        } else {
            super.onDownloadFailed(versionInfo, code, state);
        }
    }


    /**@description 当前已经是新包，无需更新 */
    onAreadyUpToData(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        if (versionInfo.bundle == Macro.BUNDLE_RESOURCES) {
            Manager.loading.hide();
        } else {
            super.onAreadyUpToData(versionInfo, code, state)
        }
    }

    /**@description 下载版本文件失败 */
    onDownloadManifestFailed(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        super.onDownloadManifestFailed(versionInfo, code, state);
        Manager.loading.hide;
    }

    /**@description 进入bundle完成 */
    onEnterGameView(entry: Entry, gameView: GameView) {
        super.onEnterGameView(entry, gameView);
        Manager.uiReconnect.hide();
    }

    onShowGameView(entry: Entry | null, gameView: GameView) {
        let data = Manager.dataCenter.get(Global);
        if (data) {
            data.userInfo.where = gameView.bundle as string;
        }
    }

    private showUpdate(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        Log.d(`提示更新`);
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

    getEntryConfig(bundle: string): HotUpdate.BundleConfig | null {
        let config = Config.ENTRY_CONFIG[bundle];
        if (config) {
            return config;
        }
        if (DEBUG) {
            Log.e(`未找到入口配置信息`);
        }
        return null;
    }

    /**@description 获取常驻于内存不释放的bundle */
    getPersistBundle() {
        return [Macro.BUNDLE_RESOURCES, Config.BUNDLE_HALL];
    }
}
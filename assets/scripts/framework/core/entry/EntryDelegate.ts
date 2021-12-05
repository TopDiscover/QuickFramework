import { Macro } from "../../defines/Macros";
import { HotUpdate } from "../hotupdate/Hotupdate";

/**@description entry入口代理 */
export class EntryDelegate {

    /**@description 显示提示信息 */
    showTips( param: string | (string | number)[] ){
        Manager.tips.show(Manager.getLanguage(param));
    }

    /**@description 显示loading */
    showLoading( param: string | (string | number)[] ){
        Manager.loading.show(Manager.getLanguage(param));
    }

    hideLoading(){
        Manager.loading.hide();
    }

    /**@description 发现新版本 */
    onNewVersionFund(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        Log.d(`检测到有新版本更新 bundle${versionInfo.bundle} name : ${versionInfo.name}`);
        Manager.hotupdate.hotUpdate();
    }

    /**@description 下载失败 */
    onDownloadFailed(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        let content = Manager.getLanguage("downloadFailed");
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                Manager.hotupdate.downloadFailedAssets();
            }
        });
        Manager.loading.hide();
    }

    /**@description 当前已经是新包，无需更新 */
    onAreadyUpToData(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        Manager.loading.hide();
        // 下载完成后不能直接进入，后面如果有多个下载时，会出问题
        // Manager.loading.show(Manager.getLanguage("loading_game_resources"))
        // Manager.bundleManager.loadBundle(this);
    }

    /**@description 下载版本文件失败 */
    onDownloadManifestFailed(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        let content = Manager.getLanguage("downloadFailManifest") as string;
        if (code == HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST) {
            content = Manager.getLanguage("noFindManifest") as string;
        } else if (code == HotUpdate.Code.ERROR_PARSE_MANIFEST) {
            content = Manager.getLanguage("manifestError") as string;
        }
        Manager.tips.show(content);
        Manager.loading.hide();
    }

    /**@description 正在检测更新 */
    onCheckingVersion(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        //do nothing
    }

    /**@description 其它错误 */
    onOtherReason(versionInfo: HotUpdate.BundleConfig, code: HotUpdate.Code, state: HotUpdate.State) {
        //do nothing
    }

    /**@description 资源下载中 */
    onDownloading(versionInfo: HotUpdate.BundleConfig, info: HotUpdate.DownLoadInfo) {
        let newPercent = 0;
        let config = Manager.hotupdate.getBundleName(versionInfo.bundle);
        if (info.code == HotUpdate.Code.UPDATE_PROGRESSION) {
            newPercent = info.percent == Number.NaN ? 0 : info.percent;
            dispatch(HotUpdate.Event.DOWNLOAD_PROGRESS, { progress: newPercent, config: config });
        } else if (info.code == HotUpdate.Code.ALREADY_UP_TO_DATE) {
            newPercent = 1;
            Manager.loading.hide();
            dispatch(HotUpdate.Event.DOWNLOAD_PROGRESS, { progress: newPercent, config: config });
        } else if (info.code == HotUpdate.Code.UPDATE_FINISHED) {
            newPercent = 1.1;
            Manager.loading.hide();
            // Log.d(`正在加载${config.name}`);
            //下载完成不能直接进入,否则在多个任务下载时会出错
            // Manager.bundleManager.loadBundle(this);
            dispatch(HotUpdate.Event.DOWNLOAD_PROGRESS, { progress: newPercent, config: config });
        } else if (info.code == HotUpdate.Code.UPDATE_FAILED ||
            info.code == HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST ||
            info.code == HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST ||
            info.code == HotUpdate.Code.ERROR_PARSE_MANIFEST ||
            info.code == HotUpdate.Code.ERROR_DECOMPRESS) {
            newPercent = -1;
            Manager.loading.hide();
            dispatch(HotUpdate.Event.DOWNLOAD_PROGRESS, { progress: newPercent, config: config });
        }
    }

    /**@description 加载Bundle错误 */
    onLoadBundleError(versionInfo: HotUpdate.BundleConfig, err: Error) {
        Manager.loading.hide();
        let content = Manager.getLanguage(["updateFaild", versionInfo.name]) as string;
        Manager.tips.show(content);
    }

    /**@description 加载bundle完成 */
    onLoadBundleComplete(versionInfo: HotUpdate.BundleConfig, bundle: cc.AssetManager.Bundle) {
        //通知入口管理进入bundle
        Manager.loading.hide();
        Manager.entryManager.onLoadBundleComplete(versionInfo, bundle);
    }


    /**@description 进入bundle完成 */
    onEnterGameView(entry: Entry | null, gameView: GameView) {
        //删除除自己之外的其它bundle
        let excludeBundles = this.getPersistBundle();
        if (entry) {
            excludeBundles.push(entry.bundle);
        }

        //进入下一场景，关闭掉当前的场景
        if (Manager.gameView) {
            Manager.gameView.close();
        }
        Manager.gameView = gameView;

        Manager.bundleManager.removeLoadedBundle(this, excludeBundles);
    }

    onShowGameView(entry: Entry | null, gameView: GameView) {

    }

    /**@description 主包检测更新 */
    onCheckUpdate() {
        let config = new HotUpdate.BundleConfig(
            Manager.getLanguage("mainPack"),
            Macro.BUNDLE_RESOURCES
        );
        Manager.bundleManager.enterBundle(config, this);
    }

    /**@description 获取常驻于内存不释放的bundle */
    getPersistBundle() {
        return [Macro.BUNDLE_RESOURCES];
    }

    onQuitGame(mainEntry: Entry | null) {
        if (mainEntry) {
            if (Manager.gameView) {
                Manager.gameView.close();
            }
            mainEntry.onEnter(true);
        }
    }

    /**
     * @description 重新检测主包更新
     */
    onRecheckMainUpdate(code: HotUpdate.Code, config: HotUpdate.BundleConfig) {
        Manager.loading.hide();
        let content = Manager.getLanguage("mainPackVersionIsTooLow") as string;
        Manager.alert.show({
            text: content,
            confirmCb: (isOK) => {
                Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES,true);
            }
        });
    }

    getEntryConfig(bundle: BUNDLE_TYPE): HotUpdate.BundleConfig | null {
        return null;
    }
}
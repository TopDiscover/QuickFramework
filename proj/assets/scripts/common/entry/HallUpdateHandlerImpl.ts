import { Update } from "../../framework/core/update/Update";
import { UpdateHandlerDelegate, UpdateItem } from "../../framework/core/update/UpdateItem";
import { Macro } from "../../framework/defines/Macros";

/**@description 大厅更新代理 */
export class HallUpdateHandlerImpl implements UpdateHandlerDelegate, ISingleton {
    static module = "【大厅热更新】"
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
                item.checkUpdate();
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
                if (Manager.stageData.isLoginStage()) {
                    //如果是在登录界面，直接检测更新
                    Manager.entryManager.onCheckUpdate();
                } else {
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
    onStarCheckUpdate(item: UpdateItem): void {
        Manager.updateLoading.show(Manager.getLanguage("loading"));
    }
    onStartLoadBundle(item: UpdateItem): void {

    }
    onLoadBundleError(item: UpdateItem, err: Error | null): void {
        Manager.updateLoading.hide();
        Manager.tips.show(Manager.getLanguage("loadFailed",[item.name]));
    }
    onLoadBundleComplete(item: UpdateItem): void {
        Manager.updateLoading.hide();
        Manager.entryManager.onLoadBundleComplete(item);
    }
    onLoadBundle(item: UpdateItem): void {
        Manager.bundleManager.loadBundle(item);
    }
    onDownloadComplete(item: UpdateItem): void {
        Manager.releaseManger.tryRemoveBundle(item.bundle);
        this.onLoadBundle(item);
    }
}
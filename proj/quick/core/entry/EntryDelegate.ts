import { isValid } from "cc";
import { Macro } from "../../defines/Macros";
import { UpdateItem } from "../update/UpdateItem";

/**@description entry入口代理 */
export class EntryDelegate {

    /**@description 进入bundle完成 */
    onEnterGameView(entry: Entry, gameView: GameView) {

    }

    /**@description 关闭当前运行bundle的GameView */
    protected closeCurEntryGameView(){
        let curEntry = App.entryManager.getEntry(App.stageData.where);
        if ( curEntry && isValid(curEntry.gameView) ){
            curEntry.gameView.close();
        }
    }

    onShowGameView(entry: Entry, gameView: GameView) {
        //删除除自己之外的其它bundle
        let excludeBundles = this.getPersistBundle();
        if (entry) {
            excludeBundles.push(entry.bundle);
        }

        // 如果进入场景与当前显示场景相同，不进行切换，否则会造成黑屏，无显示场景了
        if (App.stageData.where === entry.bundle) {
            return;
        }

        //进入下一场景，关闭掉当前的场景
        this.closeCurEntryGameView();
        App.stageData.where = entry.bundle;
        App.bundleManager.removeLoadedBundle(excludeBundles);
    }

    /**@description 主包检测更新 */
    onCheckUpdate() {
        Log.d(`主包检测更新`);
        let config = this.getEntryConfig(Macro.BUNDLE_RESOURCES);
        App.bundleManager.enterBundle(config);
    }

    /**@description 获取常驻于内存不释放的bundle */
    getPersistBundle() {
        return [Macro.BUNDLE_RESOURCES];
    }

    onEnterMain(mainEntry: Entry | null, userData?: any) {
        if (mainEntry) {
            this.closeCurEntryGameView();
            mainEntry.onEnter(userData);
        }
    }

    getEntryConfig(bundle: BUNDLE_TYPE): UpdateItem | null {
        return null;
    }

    onMainUpdateComplete(mainEntry: Entry | null, item: UpdateItem) {
        if (mainEntry) {
            mainEntry.onMainUpdateComplete(item);
        }
    }
}
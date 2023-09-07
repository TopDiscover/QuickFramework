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
}
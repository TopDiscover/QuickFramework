import { isValid } from "cc";
import { Macro } from "../../defines/Macros";
import { UpdateItem } from "../update/UpdateItem";

/**@description entry入口代理 */
export class EntryDelegate {

    /**
     * @description 卸载附加bundle
     * @param bundle 
     * @return 返回要进入的上一个附加bundle
     */
    unloadAttachBundle(bundle: string) {
        // 排除常驻
        let excludeBundles = this.getPersistBundle();
        // 排除当前运行
        excludeBundles.push(App.stageData.where);
        // 排除附加运行 除当前要卸载的所有bundle
        excludeBundles.push(...App.stageData.excludeAttachWhere);
        App.bundleManager.removeLoadedBundle(excludeBundles);
        const prev = App.stageData.prevAttachWhere;
        if ( prev ){
            App.stageData.attachWhere = prev;
        }else{
            // 已经没有附加运行bundle了，清空当前附加运行场景堆栈
            App.stageData.clearAttachStack();
        }
        return prev;
    }

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

        // 处理 附加运行情况
        const isAttach = isValid(gameView) && gameView.args && gameView.args.isAttach;

        //删除除自己之外的其它bundle
        let excludeBundles = this.getPersistBundle();
        if (entry) {
            excludeBundles.push(entry.bundle);
            // 如果是附加运行，需要排除掉附加的bundle
            // 如果有附加运行，需要排除掉当前运行的bundle
            if (isAttach) {
                excludeBundles.push(...App.stageData.attachs);
                excludeBundles.push(App.stageData.where);
            }
        }

        // 如果进入场景与当前显示场景相同，不进行切换，否则会造成黑屏，无显示场景了
        if (App.stageData.where === entry.bundle) {
            return;
        }

        //进入下一场景，关闭掉当前的场景
        if (isAttach) {
            // 有附加运行的bundle 把附加bundle加入到当前运行的bundle中
            if ( entry.bundle == App.stageData.attachWhere ){
                return;
            }
            App.stageData.attachWhere = entry.bundle;
        } else {
            this.closeCurEntryGameView();
            App.stageData.clearAttachStack();
            App.stageData.where = entry.bundle;
        }
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
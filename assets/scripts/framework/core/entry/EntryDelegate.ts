import { Macro } from "../../defines/Macros";
import { UpdateItem } from "../update/UpdateItem";

/**@description entry入口代理 */
export class EntryDelegate {

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

        Manager.bundleManager.removeLoadedBundle(excludeBundles);
    }

    onShowGameView(entry: Entry | null, gameView: GameView) {

    }

    /**@description 主包检测更新 */
    onCheckUpdate() {
        let config = this.getEntryConfig(Macro.BUNDLE_RESOURCES);
        Manager.bundleManager.enterBundle(config);
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

    getEntryConfig(bundle: BUNDLE_TYPE): UpdateItem | null {
        return null;
    }
}
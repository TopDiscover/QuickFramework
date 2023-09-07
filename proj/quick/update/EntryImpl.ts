import { EntryDelegate } from "../core/entry/EntryDelegate";
import { UpdateItem } from "../core/update/UpdateItem";
import { Macro } from "../defines/Macros";
import { Singleton } from "../utils/Singleton";
import { BundleUpdate } from "./BundleUpdate";
import { HallUpdate } from "./HallUpdate";
import { MainUpdate } from "./MainUpdate";

export class EntryImpl extends EntryDelegate {

    /**@description 进入bundle完成 */
    onEnterGameView(entry: Entry, gameView: GameView) {
       
    }

    onShowGameView(entry: Entry, gameView: GameView) {
        super.onShowGameView(entry,gameView);
        App.loading.hide();
    }

    getEntryConfig(bundle: string): UpdateItem | null {
        let config = App.stageData.getEntry(bundle)
        if (config) {
            let item = App.updateManager.getItem(config)!;
            if (bundle == Macro.BUNDLE_RESOURCES) {
                item.handler = Singleton.get(MainUpdate)!;
            } else if (bundle == Macro.BUNDLE_HALL) {
                item.handler = Singleton.get(HallUpdate)!;
            } else {
                item.handler = Singleton.get(BundleUpdate)!;
            }
            return item;
        }
        Log.e(`未找到入口配置信息`);
        return null;
    }

    /**@description 获取常驻于内存不释放的bundle */
    getPersistBundle() {
        return [Macro.BUNDLE_RESOURCES, Macro.BUNDLE_HALL];
    }
}
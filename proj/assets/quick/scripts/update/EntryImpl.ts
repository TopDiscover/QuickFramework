import { EntryDelegate } from "../framework/core/entry/EntryDelegate";
import { UpdateItem } from "../framework/core/update/UpdateItem";
import { Macro } from "../framework/defines/Macros";
import { Singleton } from "../framework/utils/Singleton";
import { BundleUpdate } from "./BundleUpdate";
import { HallUpdate } from "./HallUpdate";
import { MainUpdate } from "./MainUpdate";

export class EntryImpl extends EntryDelegate {

    /**@description 进入bundle完成 */
    onEnterGameView(entry: Entry, gameView: GameView) {
        let data = App.stageData;
        data.where = entry.bundle;
        super.onEnterGameView(entry, gameView);
        App.loading.hide();
    }

    onShowGameView(entry: Entry | null, gameView: GameView) {
        App.stageData.where = gameView.bundle as string;
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
import { EntryDelegate } from "../../framework/core/entry/EntryDelegate";
import { UpdateItem } from "../../framework/core/update/UpdateItem";
import { Macro } from "../../framework/defines/Macros";
import { Singleton } from "../../framework/utils/Singleton";
import { BundleUpdateHandlerImpl } from "./BundleUpdateHandlerImpl";
import { HallUpdateHandlerImpl } from "./HallUpdateHandlerImpl";
import { MainUpdateHandlerImpl } from "./MainUpdateHandlerImpl";

export class CmmEntry extends EntryDelegate {

    /**@description 进入bundle完成 */
    onEnterGameView(entry: Entry, gameView: GameView) {
        let data = Manager.stageData;
        data.where = entry.bundle;
        super.onEnterGameView(entry, gameView);
        Manager.loading.hide();
    }

    onShowGameView(entry: Entry | null, gameView: GameView) {
        Manager.stageData.where = gameView.bundle as string;
    }

    getEntryConfig(bundle: string): UpdateItem | null {
        let config = Manager.stageData.getEntry(bundle)
        if (config) {
            let item = new UpdateItem(config);
            if (bundle == Macro.BUNDLE_RESOURCES) {
                item.handler = Singleton.instance.get(MainUpdateHandlerImpl) as MainUpdateHandlerImpl;
            } else if (bundle == Macro.BUNDLE_HALL) {
                item.handler = Singleton.instance.get(HallUpdateHandlerImpl) as HallUpdateHandlerImpl;
            } else {
                item.handler = Singleton.instance.get(BundleUpdateHandlerImpl) as BundleUpdateHandlerImpl;
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
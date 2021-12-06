import { EntryDelegate } from "../../framework/core/entry/EntryDelegate";
import { HotUpdate } from "../../framework/core/hotupdate/Hotupdate";
import { Macro } from "../../framework/defines/Macros";
import { Config } from "../config/Config";
import { Global } from "../data/Global";

export class CmmEntry extends EntryDelegate {

    /**@description 进入bundle完成 */
    onEnterGameView(entry: Entry, gameView: GameView) {
        let data = Manager.dataCenter.get(Global) as Global;
        data.prevWhere = data.where;
        data.where = entry.bundle;
        super.onEnterGameView(entry, gameView);
        Manager.loading.hide();
    }

    onShowGameView(entry: Entry | null, gameView: GameView) {
        let data = Manager.dataCenter.get(Global);
        if (data) {
            data.where = gameView.bundle as string;
        }
    }

    getEntryConfig(bundle: string): HotUpdate.BundleConfig | null {
        let config = Config.ENTRY_CONFIG[bundle];
        if (config) {
            return config;
        }
        if( CC_DEBUG ){
            Log.e(`未找到入口配置信息`);
        }
        return null;
    }

    /**@description 获取常驻于内存不释放的bundle */
    getPersistBundle() {
        return [Macro.BUNDLE_RESOURCES, Macro.BUNDLE_HALL];
    }
}
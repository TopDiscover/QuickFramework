
import { Config } from "../../../../script/common/config/Config";
import { GameData } from "../../../../script/common/base/GameData";
import { getSingleton } from "../../../../script/framework/base/Singleton";
/**@description 大厅数据 */
class _HallData extends GameData {
    private static _instance: _HallData = null;
    public static Instance() { return this._instance || (this._instance = new _HallData()); }

    get bundle() {
        return Config.BUNDLE_HALL;
    }
}
export const HallData = getSingleton(_HallData)

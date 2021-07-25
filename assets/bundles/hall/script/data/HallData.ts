
import { GameData } from "../../../../scripts/common/base/GameData";
import { Config } from "../../../../scripts/common/config/Config";
/**@description 大厅数据 */
class _HallData extends GameData {
    private static _instance: _HallData = null!;
    public static Instance() { return this._instance || (this._instance = new _HallData()); }

    get bundle() {
        return Config.BUNDLE_HALL;
    }
}
export const HallData = getSingleton(_HallData)


import { GameData } from "../../../../script/framework/base/GameData";
/**@description 大厅数据 */
class _HallData extends GameData {
    private static _instance: _HallData = null;
    public static Instance() { return this._instance || (this._instance = new _HallData()); }

    get bundle() {
        return td.Config.BUNDLE_HALL;
    }
}
export const HallData = getSingleton(_HallData)

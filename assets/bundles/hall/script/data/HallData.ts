
import { GameData } from "../../../../script/common/base/GameData";
import { getSingleton } from "../../../../script/framework/base/Singleton";
import { HALL_ZH } from "./HallLanguageZH";
import { Manager } from "../../../../script/common/manager/Manager";
import { HALL_EN } from "./HallLanguageEN";
import { i18n } from "../../../../script/common/language/LanguageImpl";
import { Config } from "../../../../script/common/config/Config";
/**@description 大厅数据 */
class _HallData extends GameData {
    private static _instance: _HallData = null;
    public static Instance() { return this._instance || (this._instance = new _HallData()); }

    get bundle() {
        return Config.BUNDLE_HALL;
    }

    onLanguageChange() {
        let lan = HALL_ZH;
        if (Manager.language.getLanguage() == HALL_EN.language) {
            lan = HALL_EN;
        }
        i18n[`${this.bundle}`] = {};
        i18n[`${this.bundle}`] = lan.data;
    }
}
export const HallData = getSingleton(_HallData)

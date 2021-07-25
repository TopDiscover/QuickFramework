/**@description 语言包具体的代码实现 */

import { i18n } from "../../../../script/common/language/CommonLanguage";
import { TankBettle } from "./TankBattleGameData";
import { TANK_LAN_EN } from "./TankBattleLanguageEN";
import { TANK_LAN_ZH } from "./TankBattleLanguageZH";


export class TankBattleLanguage implements LanguageDataSourceDelegate{
    name = TankBettle.gameData.bundle;
    data( language : string ): LanguageData {

        let data : any = i18n;
        if( data[`${this.name}`] && data[`${this.name}`].language == language ){
            return i18n;
        }
        let lan = TANK_LAN_ZH;
        if (language == TANK_LAN_EN.language) {
            lan = TANK_LAN_EN;
        }
        data[`${this.name}`] = {};
        data[`${this.name}`] = lan.data;
        data[`${this.name}`].language = lan.language;
        return i18n;
    }
}
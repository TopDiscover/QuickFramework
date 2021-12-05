/**@description 语言包具体的代码实现 */

import { TankBattleGameData } from "./TankBattleGameData";
import { TANK_LAN_EN } from "./TankBattleLanguageEN";
import { TANK_LAN_ZH } from "./TankBattleLanguageZH";


export class TankBattleLanguage implements Language.DataSourceDelegate{
    name = TankBattleGameData.bundle
    data( language : string , source : any): Language.Data {

        let data : any = source;
        if( data[`${this.name}`] && data[`${this.name}`].language == language ){
            return source;
        }
        let lan = TANK_LAN_ZH;
        if (language == TANK_LAN_EN.language) {
            lan = TANK_LAN_EN;
        }
        data[`${this.name}`] = {};
        data[`${this.name}`] = lan.data;
        data[`${this.name}`].language = lan.language;
        return source;
    }
}
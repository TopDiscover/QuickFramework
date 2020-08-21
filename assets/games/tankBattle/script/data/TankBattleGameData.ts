/**@@description 坦克大战游戏数据 */

import { GameData } from "../../../../script/common/base/GameData";
import { TANK_LAN_ZH } from "./TankBattleLanguageZH";
import { Manager } from "../../../../script/framework/Framework";
import { TANK_LAN_EN } from "./TankBattleLanguageEN";
import { i18n } from "../../../../script/common/language/LanguageImpl";

class TankBettleGameData extends GameData {
    onLanguageChange() {
        let lan = TANK_LAN_ZH;
        if (Manager.language.getLanguage() == TANK_LAN_EN.language) {
            lan = TANK_LAN_EN;
        }
        i18n[`${this.bundle}`] = {};
        i18n[`${this.bundle}`] = lan.data;
    }

    public get bundle() {
        return "tankBattle";
    }

    /**@description 单人模式 */
    isSingle = true;

    emenyStopTime = 0;
}

export namespace TankBettle {
    export const gameData = new TankBettleGameData;
    export enum Direction{
        UP,
        DOWN,
        LEFT,
        RIGHT,
    }
}

/**@@description 坦克大战游戏数据 */

import { GameData } from "../../../../script/common/base/GameData";
import { TANK_LAN_ZH } from "./TankBattleLanguageZH";
import { Manager } from "../../../../script/framework/Framework";
import { TANK_LAN_EN } from "./TankBattleLanguageEN";
import { i18n } from "../../../../script/common/language/LanguageImpl";
import { MapLevel } from "./TankBattleLevel";

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

    public nextLevel( ){
        let level = this.currentLevel + 1;
        if (level >= MapLevel.length ) {
            level = 0
        }
        this.currentLevel = level
        return level
    }

    public prevLevel( ){
        let level = this.currentLevel - 1;
        if (level < 0 ) {
            level = MapLevel.length -1
        }
        this.currentLevel = level
        return level
    }

    /**@description 单人模式 */
    isSingle = true;

    /**@description 当前关卡等级 */
    currentLevel = 0;

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

    export enum GAME_STATUS {
        /**@description 菜单*/
        MENU,
        /**@description 初始化 */
        INIT,
        /**@description 开始 */
        START,
        /**@description 游戏结束 */
        OVER,
        /**@description 过关 */
        WIN,
    }

    export enum BLOCK_TYPE {
        /**@description 墙 */
        WALL = 1,
        GRID,
        GRASS,
        WATER,
        ICE,
        HOME = 9,
        ANOTHREHOME = 8
    }
}

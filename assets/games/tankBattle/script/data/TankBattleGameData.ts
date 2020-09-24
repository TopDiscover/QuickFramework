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

    private _isSingle = true;
    /**@description 单人模式 */
    public set isSingle( value : boolean ){
        this._isSingle = value;
        if (value) {
            this.playerOneLive = 3;
            this.playerTwoLive = 0
        } else {
            this.playerOneLive = 3;
            this.playerTwoLive = 3;
        }
    }
    public get isSingle(){
        return this._isSingle;
    }

    /**@description 当前关卡等级 */
    currentLevel = 0;

    emenyStopTime = 0;

    /**@description 关卡敌机数量 */
    maxEnemy = 20;

    /**@description 当前敌机数量 */
    curEnemy = 20;

    /**@description 玩家1的生命数量 */
    playerOneLive = 3;
    /**@description 玩家2的生命数量 */
    playerTwoLive = 0;
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

    export enum EVENT {
        /**@description 显示地图 */
        SHOW_MAP_LEVEL = "SHOW_MAP_LEVEL",
        /**@description 换关卡动画播放完成 */
        CHANGE_STAGE_FINISHED = "CHANGE_STAGE_FINISHED",
    }
}

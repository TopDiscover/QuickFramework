/**@@description 坦克大战游戏数据 */

import { GameData } from "../../../../script/common/base/GameData";
import { TANK_LAN_ZH } from "./TankBattleLanguageZH";
import { TANK_LAN_EN } from "./TankBattleLanguageEN";
import { i18n } from "../../../../script/common/language/LanguageImpl";
import { MapLevel } from "./TankBattleLevel";
import { Manager } from "../../../../script/common/manager/Manager";
import TankBattleNetController from "../controller/TankBattleNetController";
import TankBattleMap from "../model/TankBattleMap";

class TankBettleGameData extends GameData {
    onLanguageChange() {
        let lan = TANK_LAN_ZH;
        if (Manager.language.getLanguage() == TANK_LAN_EN.language) {
            lan = TANK_LAN_EN;
        }
        i18n[`${this.bundle}`] = {};
        i18n[`${this.bundle}`] = lan.data;
    }

    /**@description 子弹预置 */
    public get bulletPrefab (){
        return this.gamePrefabs.getChildByName("bullet");
    }

    public get bundle() {
        return "tankBattle";
    }

    /**@description 游戏地图 */
    public gameMap : TankBattleMap = null;

    /**@description 游戏的各种预置 */
    public gamePrefabs : cc.Node = null;

    /**@description 动画预置 */
    public get animationPrefab(){
        return this.gamePrefabs.getChildByName("tank_animations")
    }

    /**@description 获取玩家的预置 */
    public getPlayerPrefab( isOne : boolean ){
        if (isOne) {
            return this.gamePrefabs.getChildByName("player_1")
        } else {
            return this.gamePrefabs.getChildByName("player_2")
        }
    }

    public nextLevel( ){
        let level = this.currentLevel + 1;
        if (level >= MapLevel.length ) {
            level = 0
        }
        this.curEnemy = this.maxEnemy;
        this.currentLevel = level
        return level
    }

    public prevLevel( ){
        let level = this.currentLevel - 1;
        if (level < 0 ) {
            level = MapLevel.length -1
        }
        this.currentLevel = level;
        this.curEnemy = this.maxEnemy;
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

    public clear(){
        //这个地方严谨点的写法，需要调用基类，虽然现在基类没有任何实现，不保证后面基类有公共的数据需要清理
        super.clear();
        this._isSingle = true;
        this.currentLevel = 0;
        this.playerOneLive = 3;
        this.playerTwoLive = 0;
    }

    /**@description 当前关卡等级 */
    currentLevel = 0;

    /**@description 关卡敌机数量 */
    maxEnemy = 20;


    /**@description 当前敌机数量 */
    curEnemy = 10;

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

    export enum BULLET_TYPE{
        PLAYER,
        ENEMY,
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
        /**@description 石墙*/
        STONE_WALL,
        /**@description 草丛*/
        GRASS,
        /**@description 水 */
        WATER,
        /**@description 冰面 */
        ICE,
        /**@description 老巢 */
        HOME = 9,
        /**@description 老巢占位，不创建 */
        ANOTHREHOME = 8
    }

    export enum GROUP{
        Wall = "Wall",
        StoneWall = "StoneWall",
        Grass = "Grass",
        Water = "Water",
        Ice = "Ice",
        Home = "Home",
        Bullet = "Bullet",
        Player = "Player",
        /**@description 边界 */
        Boundary = "Boundary"
    }

    export enum EVENT {
        /**@description 显示地图 */
        SHOW_MAP_LEVEL = "SHOW_MAP_LEVEL",
        /**@description 换关卡动画播放完成 */
        CHANGE_STAGE_FINISHED = "CHANGE_STAGE_FINISHED",
        /**@description 请求当前游戏关卡 */
        REQ_LEVEL = "REQ_LEVEL"
    }

    export function netController() : TankBattleNetController{
        return Manager.gameController;
    }

    /**@description 玩家状态 */
    export enum PLAYER_STATUS{
        FAST_SPEED,//加速
        STRONG,//这个状态下可以打白色砖块
        PROTECTED,//保护状态
    }

    export enum ZIndex{
        TANK,
        BULLET,
        BLOCK,
    }
}

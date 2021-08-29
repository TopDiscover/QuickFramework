/**@@description 坦克大战游戏数据 */

import { GameData } from "../../../../scripts/framework/data/GameData";
import { MapLevel } from "./TankBattleLevel";
import TankBattleNetController from "../controller/TankBattleNetController";
import TankBattleMap from "../model/TankBattleMap";
import TankBattleGameView from "../view/TankBattleGameView";
import TankBattleChangeStageView from "../view/TankBattleChangeStageView";
import TankBattleStartView from "../view/TankBattleStartView";
import TankBattleGameOver from "../view/TankBattleGameOver";

export namespace TankBettle {
    export enum Direction {
        MIN = 0,
        UP = MIN,
        DOWN,
        LEFT,
        RIGHT,
        MAX = RIGHT,
    }

    /**@description 最大敌人数量 */
    export const MAX_ENEMY = 20;
    /**@description 屏幕出现的最大敌人数量 */
    export const MAX_APPEAR_ENEMY = 5;
    /**@description 玩家的生命最大上限 */
    export const MAX_PLAYER_LIVE = 3;

    export enum GAME_STATUS {
        /**@description 未知*/
        UNKNOWN,
        /**@description 选择模式*/
        SELECTED,
        /**@description 游戏初始化 */
        INIT,
        /**@description 游戏中 */
        GAME,
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

    export enum GROUP {
        Wall = "Wall",
        StoneWall = "StoneWall",
        Grass = "Grass",
        Water = "Water",
        Ice = "Ice",
        Home = "Home",
        Bullet = "Bullet",
        Player = "Player",
        /**@description 边界 */
        Boundary = "Boundary",
        Props = "Props",
    }

    export enum EVENT {
        /**@description 显示地图 */
        SHOW_MAP_LEVEL = "SHOW_MAP_LEVEL",
        /**@description 换关卡动画播放完成 */
        CHANGE_STAGE_FINISHED = "CHANGE_STAGE_FINISHED",
        /**@description 请求当前游戏关卡 */
        REQ_LEVEL = "REQ_LEVEL"
    }

    export function netController(): TankBattleNetController {
        return Manager.gameController;
    }

    /**@description 玩家状态 */
    export enum PLAYER_STATUS {
        STRONG,//这个状态下可以打白色砖块
        PROTECTED,//保护状态
    }

    /**@description 玩家状态存在时间 */
    export const PLAYER_STATUS_EXIST_TIME = 5;

    export enum ZIndex {
        TANK,
        BULLET,
        BLOCK,
        PROPS,
    }

    export enum EnemyType {
        MIN,
        /**@description 普通的，一枪一个 */
        NORMAL = MIN,
        /**@description 速度快的，一枪一个 */
        SPEED,
        /**@description 牛逼的，三枪一个 */
        STRONG,
        MAX = STRONG,
    }

    export class TankConfig {
        /** @description 坦克time时间内移动的距离 */
        distance = 5;
        /**@description 坦克每次移动distance距离需要的时间 */
        time = 0.1;
        /**@description 坦克子弹在bulletTime时间内移动的距离 */
        bulletDistance = 10;
        /**@description 坦克子弹每次移动bulletDistance距离需要的时间*/
        bulletTime = 0.1;
        /**@description 默认是只有一点生命，当受到子弹的攻击就-1 */
        live = 1;
        /**@description 射击间隔时间 */
        shootInterval = { min: 2, max: 5 };
        /**@description AI切换方向间隔时间 */
        changeInterval = { min : 4 , max : 10};
    }

    /**@description 敌人出生点位置 */
    export enum EnemyBornPosition {
        MIN,
        LEFT = MIN,
        MIDDLE,
        RIGHT,
        MAX = RIGHT,
    }

    /**@description 道具类型 */
    export enum PropsType {
        MIN,
        /**@description 添加玩家拥有坦克数量 */
        LIVE = MIN,
        /**@description 加长游戏时间 */
        TIME,
        /**@description 加强子弹威力 */
        STRONG_BULLET,
        /**@description 炸掉当前所有敌人 */
        BOOM_ALL_ENEMY,
        /**@description 添加玩家抗打能力，即玩家当前坦克生命 */
        STRONG_MY_SELF,
        /**@description 添加无敌状态 */
        GOD,
        MAX,
    }

    export enum AUDIO_PATH {
        START = "audio/start",
        MOVE = "audio/move",
        ATTACK = "audio/attack",
        PROP = "audio/prop",
        BULLETCRACK = "audio/bulletCrack",
        PLAYERCRACK = "audio/playerCrack",
        ENEMYCRACK = "audio/tankCrack",
    }

    /**@description 道具的存在时间 */
    export const PROPS_DISAPPEAR = 10;

    /**@description 道具生成间隔时间 */
    export const PROPS_CREATE_INTERVAL = { min: 10, max: 20 };

    export class TankBettleGameData extends GameData {
        private static _instance: TankBettleGameData = null;
        public static Instance() { return this._instance || (this._instance = new TankBettleGameData()); }
        addGameTime() {
            //待处理
        }

        /**@description 子弹预置 */
        public get bulletPrefab() {
            return this.gamePrefabs.getChildByName("bullet");
        }

        public get bundle() {
            return "tankBattle";
        }

        /**@description 游戏地图 */
        public gameMap: TankBattleMap = null;

        /**@description 游戏的各种预置 */
        public gamePrefabs: cc.Node = null;

        /**@description 动画预置 */
        public get animationPrefab() {
            return this.gamePrefabs.getChildByName("tank_animations")
        }

        /**@description 获取玩家的预置 */
        public getPlayerPrefab(isOne: boolean) {
            if (isOne) {
                return this.gamePrefabs.getChildByName("player_1")
            } else {
                return this.gamePrefabs.getChildByName("player_2")
            }
        }

        /**@description 获取敌人的预置 */
        public getEnemyPrefab(type: number) {
            return this.gamePrefabs.getChildByName(`tank_${type}`)
        }

        /**@description 根据当前类型取当道具预置 */
        public getPropsPrefab(type: PropsType) {
            return this.gamePrefabs.getChildByName(`item_${type}`);
        }

        private _isSingle = true;
        /**@description 单人模式 */
        public set isSingle(value: boolean) {
            this._isSingle = value;
            if (value) {
                this.playerOneLive = MAX_PLAYER_LIVE;
                this.playerTwoLive = 0
            } else {
                this.playerOneLive = MAX_PLAYER_LIVE;
                this.playerTwoLive = MAX_PLAYER_LIVE;
            }
            this.curLeftEnemy = MAX_ENEMY;
        }
        public get isSingle() {
            return this._isSingle;
        }

        private _gameStatus: GAME_STATUS = GAME_STATUS.UNKNOWN;
        /**@description 当前游戏状态 */
        public set gameStatus(status) {
            cc.log(`gamestatus : ${this._gameStatus} => ${status}`)
            this._gameStatus = status;
        }
        public get gameStatus() {
            return this._gameStatus;
        }

        public get gameView(): TankBattleGameView {
            return Manager.gameView as TankBattleGameView;
        }

        public isNeedReducePlayerLive = true;
        public reducePlayerLive(isOne: boolean) {
            if (this.isNeedReducePlayerLive) {
                if (isOne) {
                    this.playerOneLive--;
                } else {
                    this.playerTwoLive--;
                }
            }
        }

        public addPlayerLive(isOne: boolean) {
            if (isOne) {
                this.playerOneLive++;
            } else {
                this.playerTwoLive++;
            }
            this.updateGameInfo();
        }

        public clear() {
            //这个地方严谨点的写法，需要调用基类，虽然现在基类没有任何实现，不保证后面基类有公共的数据需要清理
            super.clear();
            this._isSingle = true;
            this.currentLevel = 0;
            this.playerOneLive = 0;
            this.playerTwoLive = 0;
            this.curLeftEnemy = 0;
        }

        getEnemyConfig(type: EnemyType) {
            let config = new TankConfig();
            if (type == EnemyType.STRONG) {
                config.live = 3;
            } else if (type == EnemyType.SPEED) {
                config.distance *= 2;
            }
            return config;
        }

        get playerConfig() {
            let config = new TankConfig();
            config.time = 0.05;
            return config;
        }

        /**@description 当前关卡等级 */
        currentLevel = 0;
        /**@description 当前剩余敌机数量 */
        curLeftEnemy = 0;

        /**@description 玩家1的生命数量 */
        playerOneLive = 0;
        /**@description 玩家2的生命数量 */
        playerTwoLive = 0;

        /**@description 进入游戏 */
        enterGame() {
            this.gameStatus = GAME_STATUS.INIT;
            Manager.uiManager.open({ bundle: this.bundle, type: TankBattleChangeStageView, zIndex: td.ViewZOrder.UI, args: [this.currentLevel] })
        }

        /**@description 进入选人界面 */
        enterStart() {
            this.gameStatus = GAME_STATUS.SELECTED;
            Manager.uiManager.open({ type: TankBattleStartView, bundle: this.bundle, zIndex: td.ViewZOrder.UI });
        }

        /**@description 下一关 */
        public nextLevel() {
            let level = this.currentLevel + 1;
            if (level >= MapLevel.length) {
                level = 0
            }
            this.curLeftEnemy = TankBettle.MAX_ENEMY;
            this.currentLevel = level;
            this.enterGame();
        }

        /**@description 上一关 */
        public prevLevel() {
            let level = this.currentLevel - 1;
            if (level < 0) {
                level = MapLevel.length - 1
            }
            this.currentLevel = level;
            this.curLeftEnemy = TankBettle.MAX_ENEMY;
            this.enterGame();
        }

        /**
         * @description 显示地图
         * @param level 关卡数
         */
        public showMap(level: number) {
            /**@description 当前地图 */
            if( !this.gameMap ){
                cc.error(`地图未初始化`);
                return;
            }
            this.gameMap.setLevel(level);

            if (this.isSingle) {
                this.reducePlayerLive(true);
                this.gameMap.addPlayer(true)
            } else {
                this.reducePlayerLive(true)
                this.reducePlayerLive(false)
                this.gameMap.addPlayer(true);
                this.gameMap.addPlayer(false);
            }
            this.isNeedReducePlayerLive = true;
            this.updateGameInfo();
            this.gameStatus = GAME_STATUS.GAME;
            //生成道具
            this.gameMap.startCreateProps();
        }

        /**@description 游戏结束 */
        public gameOver(){
            if( this.gameStatus == GAME_STATUS.OVER ){
                return;
            }
            this.gameStatus = GAME_STATUS.OVER;
            Manager.uiManager.open({ type: TankBattleGameOver, bundle: this.bundle, zIndex: td.ViewZOrder.UI });
            this.gameMap.gameOver();
        }

        /**@description 更新游戏信息 */
        public updateGameInfo(){
            this.gameView.showGameInfo();
        }

        /**@description 吃道具播放声音 */
        public playPropsAudio(){
            this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.PROP,this.bundle,false);
        }

        /**@description 发射子弹声音 */
        public playAttackAudio(){
            this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.ATTACK,this.bundle,false);
        }

        /**@description 子弹销毁声音 */
        public bulletCrackAudio(){
            this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.BULLETCRACK,this.bundle,false);
        }

        /**@description 玩家销毁声音 */
        public playerCrackAudio(){
            this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.PLAYERCRACK,this.bundle,false);
        }

        /**@description 敌人销毁声音 */
        public enemyCrackAudio(){
            this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.ENEMYCRACK,this.bundle,false);
        }
    }
    export const gameData = getSingleton(TankBettleGameData);
}

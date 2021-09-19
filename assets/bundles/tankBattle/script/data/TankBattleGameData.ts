/**@@description 坦克大战游戏数据 */

import { GameData } from "../../../../scripts/framework/data/GameData";
import { TankBettle } from "./TankBattleConfig";
export class TankBattleGameData extends GameData {
    static bundle = "tankBattle";
    addGameTime() {
        //待处理
    }

    private _isSingle = true;
    /**@description 单人模式 */
    public set isSingle(value: boolean) {
        this._isSingle = value;
        if (value) {
            this.playerOneLive = TankBettle.MAX_PLAYER_LIVE;
            this.playerTwoLive = 0
        } else {
            this.playerOneLive = TankBettle.MAX_PLAYER_LIVE;
            this.playerTwoLive = TankBettle.MAX_PLAYER_LIVE;
        }
        this.curLeftEnemy = TankBettle.MAX_ENEMY;
    }
    public get isSingle() {
        return this._isSingle;
    }

    private _gameStatus: TankBettle.GAME_STATUS = TankBettle.GAME_STATUS.UNKNOWN;
    /**@description 当前游戏状态 */
    public set gameStatus(status) {
        cc.log(`gamestatus : ${this._gameStatus} => ${status}`)
        this._gameStatus = status;
    }
    public get gameStatus() {
        return this._gameStatus;
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

    public clear() {
        //这个地方严谨点的写法，需要调用基类，虽然现在基类没有任何实现，不保证后面基类有公共的数据需要清理
        super.clear();
        this._isSingle = true;
        this.currentLevel = 0;
        this.playerOneLive = 0;
        this.playerTwoLive = 0;
        this.curLeftEnemy = 0;
    }

    getEnemyConfig(type: TankBettle.EnemyType) {
        let config = new TankBettle.TankConfig();
        if (type == TankBettle.EnemyType.STRONG) {
            config.live = 3;
        } else if (type == TankBettle.EnemyType.SPEED) {
            config.distance *= 2;
        }
        return config;
    }

    get playerConfig() {
        let config = new TankBettle.TankConfig();
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
}

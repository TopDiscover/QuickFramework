import GameView from "../../../../scripts/framework/core/ui/GameView";
import { TankBettle } from "../data/TankBattleConfig";
import { TankBattleLogic } from "../logic/TankBattleLogic";
import TankBattleMapCtrl from "../logic/TankBattleMapCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleGameView extends GameView {
    static logicType = TankBattleLogic;

    protected get logic() : TankBattleLogic | null{
        return this._logic as any;
    }

    public static getPrefabUrl() {
        return "prefabs/TankBattleGameView";
    }

    /**敌机总数显示节点 */
    private _enemyTankCount: cc.Node = null;
    private _enemyTankPrefab: cc.Node = null;

    /**@description 玩家1生命指数 */
    private _playerOneLive: cc.Label = null;
    /**@description 玩家2生命指数 */
    private _playerTwoLive: cc.Label = null;
    /**@description 当前游戏关卡等级 */
    private _gameLevel: cc.Label = null;
    private _instructions: cc.Label = null;
    private _playerOneTankLive: cc.Label = null;
    private _playerTwoTankLive: cc.Label = null;

    onLoad() {
        super.onLoad();
        //允许碰撞
        cc.director.getCollisionManager().enabled = true;
        //显示碰撞包围盒
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true
        //碰撞检测系统debug绘制显示
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        this.init()
    }

    private init() {
        let prefabs = cc.find("prefabs", this.node)
        let game = cc.find("Game", this.node)
        let gameInfo = cc.find("Info", this.node);
        this._enemyTankCount = cc.find("enemy_count", gameInfo)
        this._enemyTankPrefab = cc.find("enemy_tank_prefab", gameInfo)

        this._playerOneLive = cc.find("player_count_1", gameInfo).getComponent(cc.Label);
        this._playerTwoLive = cc.find("player_count_2", gameInfo).getComponent(cc.Label);
        this._playerOneTankLive = cc.find("player_live_1", gameInfo).getComponent(cc.Label);
        this._playerTwoTankLive = cc.find("player_live_2", gameInfo).getComponent(cc.Label);

        this._gameLevel = cc.find("level", gameInfo).getComponent(cc.Label);

        this._instructions = cc.find("Instructions", this.node).getComponent(cc.Label);
        this._instructions.language = Manager.makeLanguage("Instructions", this.bundle)
        this.enabledKeyUp = true;
        this.enabledKeyDown = true;
        if(this.logic ){
            this.logic.gamePrefabs = prefabs;
            let mapCtrl = new TankBattleMapCtrl();
            mapCtrl.node = game;
            mapCtrl.setPrefabs(prefabs);
            this.logic.initMap(mapCtrl);
            this.logic.onOpenSlectedView();
        }
    }

    protected onKeyUp(ev: cc.Event.EventKeyboard) {
        if ( this.logic ){
            this.logic.onKeyUp(ev,TankBettle.ViewType.GAME_VIEW);
        }
    }

    protected onKeyDown(ev: cc.Event.EventKeyboard) {
        if ( this.logic ){
            this.logic.onKeyDown(ev,TankBettle.ViewType.GAME_VIEW);
        }
    }

    public showGameInfo( gameInfo : TankBattleGameInfo ) {
        //当前关卡
        this._gameLevel.string = gameInfo.level;
        //玩家的生命
        this._playerOneLive.string = gameInfo.playerOneLive;
        this._playerTwoLive.string = gameInfo.playerTwoLive;
        this._playerOneTankLive.string = gameInfo.playerOneTankLive;
        this._playerTwoTankLive.string = gameInfo.playerTwoTankLive;
        let curLeftEnemy = gameInfo.curLeftEnemy;
        //当前剩余敌人数量 
        let count = this._enemyTankCount.children.length;
        if (count < curLeftEnemy) {
            let addCount = curLeftEnemy - count;
            for (let i = 0; i < addCount; i++) {
                let tank = cc.instantiate(this._enemyTankPrefab);
                this._enemyTankCount.addChild(tank);
            }
        } else if (count > curLeftEnemy) {
            //删除多余出来的
            let delCount = count - curLeftEnemy;
            for (let i = 0; i < delCount; i++) {
                this._enemyTankCount.removeChild(this._enemyTankCount.children[0]);
            }
        }
    }

}

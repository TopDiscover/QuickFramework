import TankBattleStartView from "./TankBattleStartView";
import TankBattleMap from "../model/TankBattleMap";
import { TankBettle } from "../data/TankBattleGameData";
import GameView from "../../../../script/framework/base/GameView";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleGameView extends GameView{
    get data(){
        return TankBettle.gameData;
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

    protected bindingEvents() {
        super.bindingEvents()
        this.registerEvent(TankBettle.EVENT.SHOW_MAP_LEVEL, this.onShowMapLevel)
    }

    onLoad() {
        super.onLoad();
        //允许碰撞
        cc.director.getCollisionManager().enabled = true;
        //显示碰撞包围盒
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true
        //碰撞检测系统debug绘制显示
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        this.init()

        dispatchEnterComplete({ type: td.Logic.Type.GAME, views: [this, TankBattleStartView] });
    }

    onDestroy(){
        this.data.gameMap = null;
        this.data.gamePrefabs = null;
        super.onDestroy();
    }

    private init() {
        this.data.enterStart();

        let prefabs = cc.find("prefabs", this.node)
        this.data.gamePrefabs = prefabs;
        let game = cc.find("Game", this.node)
        this.data.gameMap = game.addComponent(TankBattleMap);
        this.data.gameMap.owner = this;
        this.data.gameMap.setPrefabs(prefabs);
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
        this.setEnabledKeyBack(true);

        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyUp(ev: cc.Event.EventKeyboard) {
        if( this.data.gameMap){
            this.data.gameMap.onKeyUp(ev);
        }
        if (ev.keyCode == cc.macro.KEY.n) {
            //手动下一关，恢复下生命
            this.data.isSingle = this.data.isSingle;
            this.data.nextLevel();
        } else if (ev.keyCode == cc.macro.KEY.p) {
            //手动下一关，恢复下生命
            this.data.isSingle = this.data.isSingle;
            this.data.prevLevel();
        } else if( ev.keyCode == cc.macro.KEY.escape ){
            ev.stopPropagation();
            this.data.gameMap.clear();
            this.data.enterStart();
        }
    }

    onKeyDown(ev: cc.Event.EventKeyboard) {
        if (this.data.gameMap) {
            this.data.gameMap.onKeyDown(ev)
        }
    }

    protected onShowMapLevel(data: any) {
        this.data.showMap(data);
        this.audioHelper.playMusic(TankBettle.AUDIO_PATH.START,this.bundle,false);
    }

    public showGameInfo() {
        //当前关卡
        this._gameLevel.string = (this.data.currentLevel + 1).toString();
        //玩家的生命
        this._playerOneLive.string = (this.data.playerOneLive < 0 ? 0 : this.data.playerOneLive).toString();
        this._playerTwoLive.string = (this.data.playerTwoLive < 0 ? 0 : this.data.playerTwoLive).toString();
        if( this.data.gameMap.playerOne && this.data.gameMap.playerOne.config.live > 0 ){
            this._playerOneTankLive.string = `-${this.data.gameMap.playerOne.config.live}`
        }else{
            this._playerOneTankLive.string = "";
        }
        if( this.data.gameMap.playerTwo && this.data.gameMap.playerTwo.config.live > 0 ){
            this._playerTwoTankLive.string = `-${this.data.gameMap.playerTwo.config.live}`
        }else{
            this._playerTwoTankLive.string = "";
        }

        //当前剩余敌人数量 
        let count = this._enemyTankCount.children.length;
        if (count < this.data.curLeftEnemy) {
            let addCount = this.data.curLeftEnemy - count;
            for (let i = 0; i < addCount; i++) {
                let tank = cc.instantiate(this._enemyTankPrefab);
                this._enemyTankCount.addChild(tank);
            }
        } else if (count > this.data.curLeftEnemy) {
            //删除多余出来的
            let delCount = count - this.data.curLeftEnemy;
            for (let i = 0; i < delCount; i++) {
                this._enemyTankCount.removeChild(this._enemyTankCount.children[0]);
            }
        }
    }

}

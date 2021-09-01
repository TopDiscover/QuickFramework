import TankBattleStartView from "./TankBattleStartView";
import TankBattleMap from "../model/TankBattleMap";
import { TankBettle } from "../data/TankBattleGameData";
import GameView from "../../../../scripts/framework/core/ui/GameView";
import { _decorator,Node, Label, director, PhysicsSystem2D, find, systemEvent, SystemEvent, EventKeyboard, macro, instantiate } from "cc";
import { dispatchEnterComplete, Logic } from "../../../../scripts/framework/core/logic/Logic";


const { ccclass, property } = _decorator;

@ccclass
export default class TankBattleGameView extends GameView{

    private  get data(){
        return TankBettle.gameData;
    }

    public static getPrefabUrl() {
        return "prefabs/TankBattleGameView";
    }

    /**敌机总数显示节点 */
    private _enemyTankCount: Node = null!;
    private _enemyTankPrefab: Node = null!;

    /**@description 玩家1生命指数 */
    private _playerOneLive: Label = null!;
    /**@description 玩家2生命指数 */
    private _playerTwoLive: Label = null!;
    /**@description 当前游戏关卡等级 */
    private _gameLevel: Label = null!;
    private _instructions: Label = null!;
    private _playerOneTankLive: Label = null!;
    private _playerTwoTankLive: Label = null!;

    addEvents() {
        super.addEvents()
        this.addUIEvent(TankBettle.EVENT.SHOW_MAP_LEVEL, this.onShowMapLevel)
    }

    onLoad() {
        super.onLoad();
        //允许碰撞
        PhysicsSystem2D.instance.enable = true;
        //显示碰撞包围盒
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true
        //碰撞检测系统debug绘制显示
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        this.init()

        dispatchEnterComplete({ type: Logic.Type.GAME, views: [this, TankBattleStartView] });
    }

    onDestroy(){
        this.data.gameMap = null;
        this.data.gamePrefabs = null;
        super.onDestroy();
    }

    private init() {
        this.data.enterStart();

        let prefabs = find("prefabs", this.node) as Node;
        this.data.gamePrefabs = prefabs;
        let game = find("Game", this.node) as Node
        this.data.gameMap = game.addComponent(TankBattleMap);
        this.data.gameMap.owner = this;
        this.data.gameMap.setPrefabs(prefabs);
        this.data.initMapRange(game,this.data.getEnemyPrefab(TankBettle.EnemyType.NORMAL));
        let gameInfo = find("Info", this.node) as Node;
        this._enemyTankCount = find("enemy_count", gameInfo) as Node;
        this._enemyTankPrefab = find("enemy_tank_prefab", gameInfo) as Node;

        this._playerOneLive = find("player_count_1", gameInfo)?.getComponent(Label) as Label;
        this._playerTwoLive = find("player_count_2", gameInfo)?.getComponent(Label) as Label;
        this._playerOneTankLive = find("player_live_1", gameInfo)?.getComponent(Label) as Label;
        this._playerTwoTankLive = find("player_live_2", gameInfo)?.getComponent(Label) as Label;

        this._gameLevel = find("level", gameInfo)?.getComponent(Label) as Label;

        this._instructions = find("Instructions", this.node)?.getComponent(Label) as Label;
        this._instructions.language = Manager.makeLanguage("Instructions", this.bundle)
        this.setEnabledKeyBack(true);

        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyUp(ev: EventKeyboard) {
        if( this.data.gameMap){
            this.data.gameMap.onKeyUp(ev);
        }
        if (ev.keyCode == macro.KEY.n) {
            //手动下一关，恢复下生命
            this.data.isSingle = this.data.isSingle;
            this.data.nextLevel();
        } else if (ev.keyCode == macro.KEY.p) {
            //手动下一关，恢复下生命
            this.data.isSingle = this.data.isSingle;
            this.data.prevLevel();
        } else if( ev.keyCode == macro.KEY.escape ){
            ev.propagationStopped = true;
            this.data.gameMap?.clear();
            this.data.enterStart();
        }
    }

    onKeyDown(ev: EventKeyboard) {
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
        if( this.data.gameMap && this.data.gameMap.playerOne && this.data.gameMap.playerOne.config.live > 0 ){
            this._playerOneTankLive.string = `-${this.data.gameMap.playerOne.config.live}`
        }else{
            this._playerOneTankLive.string = "";
        }
        if( this.data.gameMap && this.data.gameMap.playerTwo && this.data.gameMap.playerTwo.config.live > 0 ){
            this._playerTwoTankLive.string = `-${this.data.gameMap.playerTwo.config.live}`
        }else{
            this._playerTwoTankLive.string = "";
        }

        //当前剩余敌人数量 
        let count = this._enemyTankCount.children.length;
        if (count < this.data.curLeftEnemy) {
            let addCount = this.data.curLeftEnemy - count;
            for (let i = 0; i < addCount; i++) {
                let tank = instantiate(this._enemyTankPrefab);
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

import UIView from "../../../../script/framework/ui/UIView";
import { dispatchEnterComplete, LogicType, LogicEvent } from "../../../../script/common/event/LogicEvent";
import TankBattleStartView from "./TankBattleStartView";
import { ViewZOrder } from "../../../../script/common/config/Config";
import { Manager } from "../../../../script/common/manager/Manager";
import TankBattleMap from "../model/TankBattleMap";
import { TankBettle } from "../data/TankBattleGameData";
import TankBattleChangeStageView from "./TankBattleChangeStageView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleGameView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/TankBattleGameView";
    }

    /**敌机总数显示节点 */
    private _enemyTankCount : cc.Node = null;
    private _enemyTankPrefab : cc.Node = null;

    /**@description 玩家1生命指数 */
    private _playerOneLive : cc.Label = null;
    /**@description 玩家2生命指数 */
    private _playerTwoLive : cc.Label = null;
    /**@description 当前游戏关卡等级 */
    private _gameLevel : cc.Label = null;
    private _instructions : cc.Label = null;

    protected bindingEvents(){
        super.bindingEvents()
        this.registerEvent(TankBettle.EVENT.SHOW_MAP_LEVEL,this.onShowMapLevel)
    }

    onLoad(){
        super.onLoad();
        //允许碰撞
        cc.director.getCollisionManager().enabled = true;
        //显示碰撞包围盒
        cc.director.getCollisionManager().enabledDrawBoundingBox = true
        //碰撞检测系统debug绘制显示
        cc.director.getCollisionManager().enabledDebugDraw = true;

        this.init()

        dispatchEnterComplete({type:LogicType.GAME,views:[this,TankBattleStartView]});
    }

    private init(){
        Manager.uiManager.open({type:TankBattleStartView,bundle:this.bundle,zIndex:ViewZOrder.UI});

        let prefabs = cc.find("prefabs",this.node)
        TankBettle.gameData.gamePrefabs = prefabs;
        let game = cc.find("Game",this.node)
        TankBettle.gameData.gameMap = game.addComponent(TankBattleMap);
        TankBettle.gameData.gameMap.owner = this;
        TankBettle.gameData.gameMap.setPrefabs(prefabs);
        let gameInfo = cc.find("Info",this.node);
        this._enemyTankCount = cc.find("enemy_count",gameInfo)
        this._enemyTankPrefab = cc.find("enemy_tank_prefab",gameInfo)

        this._playerOneLive = cc.find("player_count_1",gameInfo).getComponent(cc.Label);
        this._playerTwoLive = cc.find("player_count_2",gameInfo).getComponent(cc.Label);

        this._gameLevel = cc.find("level",gameInfo).getComponent(cc.Label);

        this._instructions = cc.find("Instructions",this.node).getComponent(cc.Label);
        this._instructions.language = Manager.makeLanguage("Instructions",true)
        this.setEnabledKeyBack(true);

        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown,this);
    }


    protected onKeyBack(ev:cc.Event.EventKeyboard){
        super.onKeyBack(ev);
        //在主游戏视图中退出，打开游戏开始菜单
        Manager.uiManager.open({type:TankBattleStartView,bundle:this.bundle,zIndex:ViewZOrder.UI});
    }

    protected onKeyUp(ev: cc.Event.EventKeyboard) {
        super.onKeyUp(ev);
        if (ev.keyCode == cc.macro.KEY.n ) {
            TankBettle.gameData.nextLevel();
            Manager.uiManager.open({type:TankBattleChangeStageView,bundle:this.bundle,zIndex:ViewZOrder.UI,args:[TankBettle.gameData.currentLevel]})
        }else if( ev.keyCode == cc.macro.KEY.p ){
            TankBettle.gameData.prevLevel();
            Manager.uiManager.open({type:TankBattleChangeStageView,bundle:this.bundle,zIndex:ViewZOrder.UI,args:[TankBettle.gameData.currentLevel]})
        }
    }

    protected onKeyDown(ev:cc.Event.EventKeyboard){
        if (TankBettle.gameData.gameMap) {
            TankBettle.gameData.gameMap.onKeyDown(ev)
        }
    }

    protected setMapLevel( level ){
        /**@description 当前地图 */
        TankBettle.gameData.gameMap.setLevel( level );
        this.showGameInfo();
        //添加测试玩家
        TankBettle.gameData.gameMap.addPlayer(true)
        TankBettle.gameData.gameMap.addPlayer(false)
    }

    protected onShowMapLevel( data : any ){
        this.setMapLevel(data)
    }

    public showGameInfo( ){
        //当前关卡
        this._gameLevel.string = TankBettle.gameData.currentLevel.toString();
        //玩家的生命
        this._playerOneLive.string = TankBettle.gameData.playerOneLive.toString();
        this._playerTwoLive.string = TankBettle.gameData.playerTwoLive.toString();
        //当前剩余敌人数量 
        let count = this._enemyTankCount.children.length;
        if( count < TankBettle.gameData.curEnemy ){
            let addCount = TankBettle.gameData.curEnemy - count;
            for( let i = 0 ; i < addCount ; i++ ){
                let tank = cc.instantiate(this._enemyTankPrefab);
                this._enemyTankCount.addChild(tank);
            }
        }else if( count > TankBettle.gameData.curEnemy ){
            //删除多余出来的
            let delCount = count - TankBettle.gameData.curEnemy;
            for( let i = 0 ; i < delCount ; i++ ){
                this._enemyTankCount.removeChild(this._enemyTankCount.children[0]);
            }
        }
    }
}

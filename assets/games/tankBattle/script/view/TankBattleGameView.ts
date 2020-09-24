import UIView from "../../../../script/framework/ui/UIView";
import { dispatchEnterComplete, LogicType, LogicEvent } from "../../../../script/common/event/LogicEvent";
import TankBattleStartView from "./TankBattleStartView";
import { ViewZOrder } from "../../../../script/common/config/Config";
import { Manager } from "../../../../script/common/manager/Manager";
import TankBattleMap from "../model/TankBattleMap";
import { TankBettle } from "../data/TankBattleGameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleGameView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/TankBattleGameView";
    }

    /**@description 地图 */
    private _Map : TankBattleMap  = null;

    /**敌机总数显示节点 */
    private _enemyTankCount : cc.Node = null;
    private _enemyTankPrefab : cc.Node = null;

    /**@description 玩家1生命指数 */
    private _playerOneLive : cc.Label = null;
    /**@description 玩家2生命指数 */
    private _playerTwoLive : cc.Label = null;
    /**@description 当前游戏关卡等级 */
    private _gameLevel : cc.Label = null;

    onLoad(){
        super.onLoad();

        this.init()

        dispatchEnterComplete({type:LogicType.GAME,views:[this,TankBattleStartView]});
    }

    private init(){
        Manager.uiManager.open({type:TankBattleStartView,bundle:this.bundle,zIndex:ViewZOrder.UI});

        let prefabs = cc.find("prefabs",this.node)

        let game = cc.find("Game",this.node)
        this._Map = game.addComponent(TankBattleMap);
        this._Map.setPrefabs(prefabs);
        this._Map.setLevel(TankBettle.gameData.currentLevel);

        let gameInfo = cc.find("Info",this.node);

        this._enemyTankCount = cc.find("enemy_count",gameInfo)
        this._enemyTankPrefab = cc.find("enemy_tank_prefab",gameInfo)

        this._playerOneLive = cc.find("player_count_1",gameInfo).getComponent(cc.Label);
        this._playerTwoLive = cc.find("player_count_2",gameInfo).getComponent(cc.Label);

        this._gameLevel = cc.find("level",gameInfo).getComponent(cc.Label)

        this._gameLevel.string = (TankBettle.gameData.currentLevel + 1).toString();
        this._playerOneLive.string = TankBettle.gameData.playerOneLive.toString();
        this._playerTwoLive.string = TankBettle.gameData.playerTwoLive.toString();

        /**预放置20个敌机的数量显示 */
        for (let index = 0; index < TankBettle.gameData.maxEnemy; index++) {
            let tank = cc.instantiate(this._enemyTankPrefab)
            this._enemyTankCount.addChild(tank)
        }

        this.setEnabledKeyBack(true);
    }


    protected onKeyBack(ev:cc.Event.EventKeyboard){
        super.onKeyBack(ev);
        //在主游戏视图中退出，打开游戏开始菜单
        Manager.uiManager.open({type:TankBattleStartView,bundle:this.bundle,zIndex:ViewZOrder.UI});
    }

    protected onKeyUp(ev: cc.Event.EventKeyboard) {
        super.onKeyUp(ev);
        if (ev.keyCode == cc.macro.KEY.n ) {
            this._Map.setLevel(TankBettle.gameData.nextLevel())
            this._gameLevel.string = (TankBettle.gameData.currentLevel + 1).toString();
        }else if( ev.keyCode == cc.macro.KEY.p ){
            this._Map.setLevel(TankBettle.gameData.prevLevel())
            this._gameLevel.string = (TankBettle.gameData.currentLevel + 1).toString();
        }
    }

}

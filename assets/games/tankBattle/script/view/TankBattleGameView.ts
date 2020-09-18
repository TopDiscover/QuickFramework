import UIView from "../../../../script/framework/ui/UIView";
import { dispatchEnterComplete, LogicType, LogicEvent } from "../../../../script/common/event/LogicEvent";
import TankBattleStartView from "./TankBattleStartView";
import { ViewZOrder } from "../../../../script/common/config/Config";
import { Manager } from "../../../../script/common/manager/Manager";
import TankBattleMap from "../model/TankBattleMap";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleGameView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/TankBattleGameView";
    }

    /**@description 地图 */
    private _Map : TankBattleMap  = null;

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
        this._Map.setLevel(1);

        this.setEnabledKeyBack(true);
    }


    protected onKeyBack(ev:cc.Event.EventKeyboard){
        super.onKeyBack(ev);
        //在主游戏视图中退出，打开游戏开始菜单
        Manager.uiManager.open({type:TankBattleStartView,bundle:this.bundle,zIndex:ViewZOrder.UI});
    }

}

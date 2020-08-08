import UIView from "../../../../script/framework/ui/UIView";
import { dispatchEnterComplete, LogicType, LogicEvent } from "../../../../script/common/event/LogicEvent";
import TankBattleStartView from "./TankBattleStartView";
import { ViewZOrder } from "../../../../script/common/config/Config";
import { Manager } from "../../../../script/common/manager/Manager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleGameView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/TankBattleGameView";
    }

    onLoad(){
        super.onLoad();

        this.init()

        dispatchEnterComplete({type:LogicType.GAME,views:[this,TankBattleStartView]});
    }

    private init(){
        Manager.uiManager.open({type:TankBattleStartView,bundle:this.bundle,zIndex:ViewZOrder.UI});
        this.setEnabledKeyBack(true);
    }


    protected onKeyBack(ev:cc.Event.EventKeyboard){
        super.onKeyBack(ev);
        //在主游戏视图中退出，打开游戏开始菜单
        Manager.uiManager.open({type:TankBattleStartView,bundle:this.bundle,zIndex:ViewZOrder.UI});
    }

}

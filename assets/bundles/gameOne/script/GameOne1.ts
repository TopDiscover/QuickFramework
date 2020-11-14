import UIView from "../../../script/framework/ui/UIView";
import { Manager } from "../../../script/common/manager/Manager";
import GameOne2 from "./GameOne2";
import { ViewZOrder } from "../../../script/common/config/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOne1 extends UIView {

    public static getPrefabUrl(){
        return "prefabs/GameOne1";
    }

    private testNode : cc.Node = null;

    onLoad(){
        super.onLoad();
        let goback = cc.find("goBack",this.node);
        goback.on(cc.Node.EventType.TOUCH_END,()=>{
            this.close();
            Manager.uiManager.open({type:GameOne2,zIndex:ViewZOrder.UI,bundle:this.bundle})
        });
        goback.zIndex = 10;
    }
}

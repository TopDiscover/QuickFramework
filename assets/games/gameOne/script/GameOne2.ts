import UIView from "../../../script/framework/ui/UIView";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../../script/common/event/LogicEvent";
import { BUNDLE_REMOTE, ResourceInfo } from "../../../script/framework/base/Defines";
import { Manager } from "../../../script/framework/Framework";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOne2 extends UIView {

    public static getPrefabUrl(){
        return "prefabs/GameOne2";
    }

    private testNode : cc.Node = null;

    onLoad(){
        super.onLoad();
        let goback = cc.find("goBack",this.node);
        goback.on(cc.Node.EventType.TOUCH_END,()=>{
            this.close();
        });
        goback.zIndex = 10;
    }
}

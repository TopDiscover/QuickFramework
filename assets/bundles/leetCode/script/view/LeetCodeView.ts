import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import UIView from "../../../../script/framework/ui/UIView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LeetCodeView extends UIView {

    static getPrefabUrl(){
        return "prefabs/LeetCodeView";
    }

    onLoad(){
        super.onLoad();
        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(LogicEvent.ENTER_HALL);
        });

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }
}

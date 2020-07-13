import UIView from "../../../script/framework/ui/UIView";
import { GAME } from "../../../script/common/base/ResPath";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../../script/common/event/LogicEvent";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameTwoView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/GameTwoView";
    }

    onLoad(){
        super.onLoad();

        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(LogicEvent.ENTER_HALL);
        });

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }
}

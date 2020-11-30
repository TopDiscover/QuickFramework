
import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import UIView from "../../../../script/framework/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadTestView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/LoadTestView";
    }

    onLoad(){
        super.onLoad();
        cc.find("goback",this.node).on(cc.Node.EventType.TOUCH_END,this.onGoback,this);

        dispatchEnterComplete({ type: LogicType.GAME, views: [this] });
    }

    private onGoback(){
        dispatch(LogicEvent.ENTER_HALL);
    }
}

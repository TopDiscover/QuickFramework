import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import UIView from "../../../../script/framework/ui/UIView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOneView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/GameOneView";
    }

    private testNode : cc.Node = null;

    onLoad(){
        super.onLoad();
        let goback = cc.find("goBack",this.node);
        goback.on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(LogicEvent.ENTER_HALL);
        });
        goback.zIndex = 10;

        this.audioHelper.playMusic("audio/background",this.bundle);

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }
}

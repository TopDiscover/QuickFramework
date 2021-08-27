import { UIView } from "../../../scripts/framework/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameTwoView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/GameTwoView";
    }

    onLoad(){
        super.onLoad();

        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(td.Logic.Event.ENTER_HALL);
        });

        dispatchEnterComplete({type:td.Logic.Type.GAME,views:[this]});
    }
}

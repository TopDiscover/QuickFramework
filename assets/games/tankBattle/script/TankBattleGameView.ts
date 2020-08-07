import UIView from "../../../script/framework/ui/UIView";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../../script/common/event/LogicEvent";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleGameView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/TankBattleGameView";
    }

    private panelStart : cc.Node = null;

    onLoad(){
        super.onLoad();

        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(LogicEvent.ENTER_HALL);
        });

        this.panelStart = cc.find("panel_start",this.node);

        this.updatePanelStart();

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }

    private updatePanelStart(){
        
    }

}

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIView from "../../framework/ui/UIView";
import { GAME } from "../../common/base/ResPath";
import { dispatchEnterComplete, LogicType, LogicEvent } from "../../common/event/LogicEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameTwoView extends UIView {

    public static getPrefabUrl(){
        return GAME("prefabs/GameTwoView");
    }

    onLoad(){
        super.onLoad();

        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(LogicEvent.ENTER_HALL);
        });

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }
}

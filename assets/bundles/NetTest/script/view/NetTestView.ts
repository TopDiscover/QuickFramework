import GameView from "../../../../script/common/base/GameView";
import { dispatchEnterComplete, LogicType } from "../../../../script/common/event/LogicEvent";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NetTestView extends GameView {

    public static getPrefabUrl(){
        return "prefabs/NetTestView";
    }

    onLoad(){
        super.onLoad();

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }
}

import GameView from "../../../../script/common/base/GameView";
import { dispatchEnterComplete, LogicType } from "../../../../script/common/event/LogicEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game2048GameView extends GameView {

    public static getPrefabUrl(){
        return "prefabs/Game2048GameView"
    }

    onLoad(){
        super.onLoad();

        dispatchEnterComplete( {type : LogicType.GAME,views:[this] });
    }
}

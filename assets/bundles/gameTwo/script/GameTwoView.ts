import { Config } from "../../../scripts/common/config/Config";
import GameView from "../../../scripts/framework/core/ui/GameView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameTwoView extends GameView {

    public static getPrefabUrl(){
        return "prefabs/GameTwoView";
    }

    onLoad(){
        super.onLoad();

        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            Manager.entryManager.enterBundle(Config.BUNDLE_HALL);
        });
    }
}

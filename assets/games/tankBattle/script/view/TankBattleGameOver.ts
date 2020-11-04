import UIView from "../../../../script/framework/ui/UIView";
import { Manager } from "../../../../script/common/manager/Manager";
import { TankBettle } from "../data/TankBattleGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleGameOver extends UIView {

    public static getPrefabUrl() {
        return "prefabs/TankBattleGameOver";
    }

    onLoad() {
        super.onLoad();
        this.content = cc.find("content", this.node);
        let title =  cc.find("title", this.content);
        title.getComponent(cc.Label).language = Manager.makeLanguage("gameOver", true);
        let y = 
        cc.tween(title).set({y : this.node.height/2}).to(0.2,{y:0}).start();

        cc.find("bankground",this.node).on(cc.Node.EventType.TOUCH_END,this.onClose,this)
    }

    private onClose(){
        this.close();
        TankBettle.gameData.enterStart();
    }
}

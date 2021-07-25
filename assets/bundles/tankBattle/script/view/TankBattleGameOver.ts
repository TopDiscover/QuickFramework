import UIView from "../../../../scripts/framework/ui/UIView";
import { TankBettle } from "../data/TankBattleGameData";
import { _decorator,Node, find, Label, tween, Vec3, UITransform } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class TankBattleGameOver extends UIView {

    public static getPrefabUrl() {
        return "prefabs/TankBattleGameOver";
    }

    onLoad() {
        super.onLoad();
        this.content = find("content", this.node) as Node;
        let title =  find("title", this.content) as Node;
        let trans = this.node.getComponent(UITransform) as UITransform;
        (title.getComponent(Label) as Label).language = Manager.makeLanguage("gameOver", this.bundle);
        tween(title)
        .set({ position : new Vec3(title.position.x,trans.height/2,title.position.z)})
        .to(1,{ position : new Vec3(title.position.x,0,title.position.z)})
        .delay(2)
        .call(()=>{
            this.close();
            TankBettle.gameData.gameMap?.clear();
            TankBettle.gameData.enterStart();
        })
        .start();
    }
}

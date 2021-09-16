import UIView from "../../../../scripts/framework/core/ui/UIView";
import { _decorator,Node, find, Label, tween, Vec3, UITransform } from "cc";
import { TankBettleGameData } from "../data/TankBattleGameData";

const { ccclass, property } = _decorator;

@ccclass
export default class TankBattleGameOver extends UIView {

    public static getPrefabUrl() {
        return "prefabs/TankBattleGameOver";
    }

    private logic : TankBattleLogic = null!;

    onLoad() {
        super.onLoad();
        if ( this.args ){
            this.logic = this.args[0];
        }
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
            if ( this.logic ){
                this.logic.mapClear();
                this.logic.onOpenSlectedView();
            }
        })
        .start();
    }
}

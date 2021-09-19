import UIView from "../../../../scripts/framework/core/ui/UIView";

const { ccclass, property } = cc._decorator;

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
        this.content = cc.find("content", this.node);
        let title =  cc.find("title", this.content);
        title.getComponent(cc.Label).language = Manager.makeLanguage("gameOver", this.bundle);
        cc.tween(title)
        .set({y : this.node.height/2})
        .to(1,{y:0})
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

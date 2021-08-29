import { UIView } from "../../../../scripts/framework/support/ui/UIView";
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
        title.getComponent(cc.Label).language = Manager.makeLanguage("gameOver", this.bundle);
        cc.tween(title)
        .set({y : this.node.height/2})
        .to(1,{y:0})
        .delay(2)
        .call(()=>{
            this.close();
            TankBettle.gameData.gameMap.clear();
            TankBettle.gameData.enterStart();
        })
        .start();
    }
}

import UIView from "../../../../script/framework/ui/UIView";
import { Manager } from "../../../../script/common/manager/Manager";
import { TankBettle } from "../data/TankBattleGameData";
import { ViewZOrder } from "../../../../script/common/config/Config";
import TankBattleStartView from "./TankBattleStartView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleGameOver extends UIView {

    public static getPrefabUrl() {
        return "prefabs/TankBattleGameOver";
    }

    /**@description 选择模式的小坦克 */
    private selectTank: cc.Node = null;
    /**@description 单人 */
    private singlePlayer: cc.Node = null;
    /**@description 多人 */
    private doublePalyers: cc.Node = null;

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
        TankBettle.gameData.gameStatus = TankBettle.GAME_STATUS.SELECTED;
        Manager.uiManager.open({ type: TankBattleStartView, bundle: this.bundle, zIndex: ViewZOrder.UI });
        this.close();
    }
}

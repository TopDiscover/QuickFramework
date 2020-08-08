import UIView from "../../../../script/framework/ui/UIView";
import { LogicEvent } from "../../../../script/common/event/LogicEvent";
import { Manager } from "../../../../script/common/manager/Manager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleStartView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/TankBattleStartView";
    }

     /**@description 选择模式的小坦克 */
     private selectTank : cc.Node = null;
     /**@description 单人 */
     private singlePlayer : cc.Node = null;
     /**@description 多人 */
     private doublePalyers : cc.Node = null;

    onLoad(){
        super.onLoad();

        this.content = cc.find("content",this.node);

        cc.find("title",this.content).getComponent(cc.Label).language = Manager.makeLanguage("title",true);
        this.singlePlayer = cc.find("player",this.content);
        this.singlePlayer.getComponent(cc.Label).language = Manager.makeLanguage("player",true);
        this.doublePalyers = cc.find("players",this.content);
        this.doublePalyers.getComponent(cc.Label).language = Manager.makeLanguage("players",true);
        cc.find("tips",this.content).getComponent(cc.Label).language = Manager.makeLanguage("tips",true);
        this.selectTank = cc.find("tank",this.content);

        this.setEnabledKeyBack(true);
    }

    protected onKeyBack(ev : cc.Event.EventKeyboard){
        super.onKeyBack(ev);
        dispatch(LogicEvent.ENTER_HALL);
    }
}

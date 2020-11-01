import UIView from "../../../../script/framework/ui/UIView";
import { LogicEvent } from "../../../../script/common/event/LogicEvent";
import { Manager } from "../../../../script/common/manager/Manager";
import { TankBettle } from "../data/TankBattleGameData";
import { TankBattleConfig } from "../protocol/TankBattleProtocal";
import TankBattleChangeStageView from "./TankBattleChangeStageView";
import { ViewZOrder } from "../../../../script/common/config/Config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleStartView extends UIView {

    public static getPrefabUrl() {
        return "prefabs/TankBattleStartView";
    }

    /**@description 选择模式的小坦克 */
    private selectTank: cc.Node = null;
    /**@description 单人 */
    private singlePlayer: cc.Node = null;
    /**@description 多人 */
    private doublePalyers: cc.Node = null;

    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(TankBettle.EVENT.SHOW_MAP_LEVEL,this.onChangeStageFinished)
    }

    onLoad() {
        super.onLoad();

        this.content = cc.find("content", this.node);

        cc.find("title", this.content).getComponent(cc.Label).language = Manager.makeLanguage("title", true);
        this.singlePlayer = cc.find("player", this.content);
        this.singlePlayer.getComponent(cc.Label).language = Manager.makeLanguage("player", true);
        this.doublePalyers = cc.find("players", this.content);
        this.doublePalyers.getComponent(cc.Label).language = Manager.makeLanguage("players", true);
        cc.find("tips", this.content).getComponent(cc.Label).language = Manager.makeLanguage("tips", true);
        this.selectTank = cc.find("tank", this.content);
        this.selectTank.y = this.singlePlayer.y;

        this.setEnabledKeyBack(true);
    }

    protected onKeyBack(ev: cc.Event.EventKeyboard) {
        super.onKeyBack(ev);
        dispatch(LogicEvent.ENTER_HALL);
    }

    protected onKeyUp(ev: cc.Event.EventKeyboard) {
        super.onKeyUp(ev);
        if (ev.keyCode == cc.macro.KEY.down || ev.keyCode == cc.macro.KEY.up ) {
            let isSingle = false;
            if (this.selectTank.y == this.singlePlayer.y) {
                this.selectTank.y = this.doublePalyers.y;
            }else{
                this.selectTank.y = this.singlePlayer.y;
                isSingle = true;
            }
            TankBettle.gameData.isSingle = isSingle;
        }else if( ev.keyCode == cc.macro.KEY.space || ev.keyCode == cc.macro.KEY.enter ){
            //关闭自己界面，显示游戏界面 //也可以使用大厅界面的方式，把网络组件注入到UIView中直接使用
            // TankBettle.netController().send(new TankBattleConfig())
            Manager.uiManager.open({bundle:this.bundle,type:TankBattleChangeStageView,zIndex:ViewZOrder.UI,args:[TankBettle.gameData.currentLevel]})
        }
    }

    protected onChangeStageFinished(){
        this.close();
    }
}

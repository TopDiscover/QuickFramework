import UIView from "../../../script/framework/ui/UIView";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../../script/common/event/LogicEvent";
import { Manager } from "../../../script/common/manager/Manager";
import TankBattleStartView from "./TankBattleStartView";
import { ViewZOrder } from "../../../script/common/config/Config";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleGameView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/TankBattleGameView";
    }

    private panelStart : cc.Node = null;
    private paneGame : cc.Node = null;

    onLoad(){
        super.onLoad();

        this.init()

        dispatchEnterComplete({type:LogicType.GAME,views:[this,TankBattleStartView]});
    }

    private init(){

        Manager.uiManager.open({type:TankBattleStartView,bundle:this.bundle,zIndex:ViewZOrder.UI});
        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            this.goBack();
        });
 
        // this.panelStart = cc.find("panel_start",this.node);

        // cc.find("title",this.panelStart).getComponent(cc.Label).language = Manager.makeLanguage("title",true);
        // this.singlePlayer = cc.find("player",this.panelStart);
        // this.singlePlayer.getComponent(cc.Label).language = Manager.makeLanguage("player",true);
        // this.doublePalyers = cc.find("players",this.panelStart);
        // this.doublePalyers.getComponent(cc.Label).language = Manager.makeLanguage("players",true);
        // this.selectTank = cc.find("tank",this.panelStart);

        // this.paneGame = cc.find("panel_game",this.node);

        
        // this.panelStart.active = true;
        // this.paneGame.active = false;


        // this.setEnabledKeyBack(true);
    }


    protected onKeyUp( ev : cc.Event.EventKeyboard ){
        super.onKeyUp( ev )
        if ( ev.keyCode == cc.macro.KEY.escape ){
            this.goBack();
        }else{
            if ( ev.keyCode == cc.macro.KEY.down ){
                cc.log("down");
            }else if ( ev.keyCode == cc.macro.KEY.up ){
                cc.log("up");
            }
        }
    }

    private goBack(){
        dispatch(LogicEvent.ENTER_HALL);
    }

}

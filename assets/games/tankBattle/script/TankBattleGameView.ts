import UIView from "../../../script/framework/ui/UIView";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../../script/common/event/LogicEvent";
import { Manager } from "../../../script/common/manager/Manager";


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

        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            this.goBack();
        });

        this.panelStart = cc.find("panel_start",this.node);

        cc.find("title",this.panelStart).getComponent(cc.Label).language = Manager.makeLanguage("title",true);
        cc.find("player",this.panelStart).getComponent(cc.Label).language = Manager.makeLanguage("player",true);
        cc.find("players",this.panelStart).getComponent(cc.Label).language = Manager.makeLanguage("players",true);

        this.paneGame = cc.find("panel_game",this.node);

        this.setEnabledKeyBack(true);

        this.initGame();

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }

    private initGame(){

    }


    protected onKeyUp( ev : cc.Event.EventKeyboard ){
        super.onKeyUp( ev )
        if ( ev.keyCode == cc.macro.KEY.escape ){
            this.goBack();
        }else{

        }
    }

    private goBack(){
        dispatch(LogicEvent.ENTER_HALL);
    }
}

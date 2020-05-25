import { Logic } from "../../common/base/Logic";
import { LogicType, LogicEvent } from "../../common/event/LogicEvent";
import { uiManager } from "../../framework/base/UIManager";
import { logicManager } from "../../common/manager/LogicManager";
import { GamePath } from "../../common/base/ResPath";
import GameTwoResPath from "./GameTwoResPath";
import GameTwoView from "./GameTwoView";

class GameTwoLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    gamePahtDelegate = new GameTwoResPath();

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME,this.onEnterGame);
    }

    protected getGameName(){
        return "gameTwo";
    }

    private onEnterGame( data ) {
        if( data == this.getGameName()){
            GamePath.instance.delegate = this.gamePahtDelegate;
            uiManager().open({type:GameTwoView});
        }
    }
}

logicManager().push(GameTwoLogic);
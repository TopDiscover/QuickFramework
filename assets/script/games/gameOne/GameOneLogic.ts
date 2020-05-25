import { Logic } from "../../common/base/Logic";
import { LogicType, LogicEvent } from "../../common/event/LogicEvent";
import { uiManager } from "../../framework/base/UIManager";
import { logicManager } from "../../common/manager/LogicManager";
import GameOneResPath from "./GameOneResPath";
import { GamePath } from "../../common/base/ResPath";
import GameOneView from "./GameOneView";

class GameOneLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    gamePahtDelegate = new GameOneResPath();

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME,this.onEnterGame);
    }

    protected getGameName(){
        return "gameOne";
    }

    private onEnterGame( data ) {
        if( data == this.getGameName()){
            GamePath.instance.delegate = this.gamePahtDelegate;
            uiManager().open({type:GameOneView});
        }
    }
}

logicManager().push(GameOneLogic);
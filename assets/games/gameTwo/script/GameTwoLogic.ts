import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent } from "../../../script/common/event/LogicEvent";
import GameTwoView from "./GameTwoView";
import { logicManager } from "../../../script/common/manager/LogicManager";
import { Manager } from "../../../script/common/manager/Manager";

class GameTwoLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected getGameName() {
        return "gameTwo";
    }

    private onEnterGame(data) {
        if (data == this.getGameName()) {
            Manager.uiManager.open({ type: GameTwoView ,bundle:this.getGameName()});
        }
    }
}

logicManager().push(GameTwoLogic);
import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent } from "../../../script/common/event/LogicEvent";
import GameTwoView from "./GameTwoView";

class GameTwoLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "gameTwo";
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: GameTwoView ,bundle:this.bundle});
        }
    }
}

Manager.logicManager.push(GameTwoLogic);
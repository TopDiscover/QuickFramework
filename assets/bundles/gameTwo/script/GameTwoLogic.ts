import { Logic } from "../../../scripts/framework/support/logic/Logic";
import GameTwoView from "./GameTwoView";

class GameTwoLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(td.Logic.Event.ENTER_GAME, this.onEnterGame);
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
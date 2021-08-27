import { Logic } from "../../../script/framework/base/Logic";
import GameOneView from "./view/GameOneView";

class GameOneLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(td.Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "gameOne";
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: GameOneView, bundle: this.bundle });
        }
    }
}

Manager.logicManager.push(GameOneLogic);
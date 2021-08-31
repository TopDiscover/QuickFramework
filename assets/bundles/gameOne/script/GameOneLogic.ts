import { Logic } from "../../../scripts/framework/core/logic/Logic";
import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import GameOneView from "./view/GameOneView";

class GameOneLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_GAME, this.onEnterGame);
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
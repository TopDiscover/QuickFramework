import { Logic } from "../../../scripts/framework/base/Logic";
import { AimLineData } from "./data/AimLineData";
import AimLineView from "./view/AimLineView";

class AimLineLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(td.Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
       return AimLineData.bundle;
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: AimLineView, bundle: this.bundle });
        }
    }
}

Manager.logicManager.push(AimLineLogic);
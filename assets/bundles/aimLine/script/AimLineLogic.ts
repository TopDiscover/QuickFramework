import { Logic } from "../../../scripts/framework/core/logic/Logic";
import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import { AimLineData } from "./data/AimLineData";
import AimLineView from "./view/AimLineView";

class AimLineLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return AimLineData.bundle;
    }

    private onEnterGame(data:any) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: AimLineView, bundle: this.bundle });
        }
    }
}

Manager.logicManager.push(AimLineLogic);
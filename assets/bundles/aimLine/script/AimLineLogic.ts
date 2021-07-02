import { Logic } from "../../../scripts/common/base/Logic";
import { LogicType, LogicEvent } from "../../../scripts/common/event/LogicEvent";
import { registerTypeManager } from "../../../scripts/framework/base/RegisterTypeManager";
import { Manager } from "../../../scripts/framework/Framework";
import { AimLineData } from "./data/AimLineData";
import AimLineView from "./view/AimLineView";

class AimLineLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
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

registerTypeManager.registerLogicType(AimLineLogic);
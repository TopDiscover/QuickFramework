import { Logic } from "../../../scripts/common/base/Logic";
import { LogicType, LogicEvent } from "../../../scripts/common/event/LogicEvent";
import { registerTypeManager } from "../../../scripts/framework/base/RegisterTypeManager";
import { Manager } from "../../../scripts/framework/Framework";
import NetTestView from "./view/NetTestView";

class NetTestLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "netTest";
    }

    private onEnterGame(data:string) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: NetTestView, bundle: this.bundle });
        }
    }
}

registerTypeManager.registerLogicType(NetTestLogic);
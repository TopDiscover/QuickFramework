import { Logic } from "../../../scripts/common/base/Logic";
import { LogicType, LogicEvent } from "../../../scripts/common/event/LogicEvent";
import { Manager } from "../../../scripts/common/manager/Manager";
import NodePoolView from "./view/NodePoolView";

class NodePoolTestLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "nodePoolTest";
    }

    private onEnterGame(data:string) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: NodePoolView, bundle: this.bundle });
        }
    }
}

Manager.logicManager.push(NodePoolTestLogic);
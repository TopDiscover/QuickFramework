import { Logic } from "../../../scripts/framework/support/logic/Logic";
import NodePoolView from "./view/NodePoolView";

class NodePoolTestLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(td.Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "nodePoolTest";
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: NodePoolView, bundle: this.bundle });
        }
    }
}

Manager.logicManager.push(NodePoolTestLogic);
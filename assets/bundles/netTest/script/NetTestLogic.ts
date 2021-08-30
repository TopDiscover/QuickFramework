import { Logic } from "../../../scripts/framework/core/logic/Logic";
import NetTestView from "./view/NetTestView";

class NetTestLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(td.Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "netTest";
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: NetTestView, bundle: this.bundle });
        }
    }
}

Manager.logicManager.push(NetTestLogic);
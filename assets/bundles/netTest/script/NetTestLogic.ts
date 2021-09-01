import { Logic } from "../../../scripts/framework/core/logic/Logic";
import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import NetTestView from "./view/NetTestView";

class NetTestLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_GAME, this.onEnterGame);
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

Manager.logicManager.push(NetTestLogic);
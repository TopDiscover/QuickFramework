import { Logic } from "../../../scripts/framework/core/logic/Logic";
import ShaderView from "./view/ShaderView";

class ShaderLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(td.Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "shaders";
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: ShaderView, bundle: this.bundle });
        }
    }
}

Manager.logicManager.push(ShaderLogic);
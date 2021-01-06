import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent } from "../../../script/common/event/LogicEvent";
import { Manager } from "../../../script/common/manager/Manager";
import LeetCodeView from "./view/LeetCodeView";

class LeetCodeLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "leetCode";
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: LeetCodeView ,bundle:this.bundle});
        }
    }
}

Manager.logicManager.push(LeetCodeLogic);
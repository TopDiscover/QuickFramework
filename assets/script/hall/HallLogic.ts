import { Logic } from "../common/base/Logic";
import { uiManager } from "../framework/base/UIManager";
import HallView from "./HallView";
import { logicManager } from "../common/manager/LogicManager";
import { LogicType, LogicEvent } from "../common/event/LogicEvent";


class HallLogic extends Logic {

    logicType: LogicType = LogicType.HALL;

    bindingEvents(){
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_HALL,this.onEnterHall);
    }

    onLoad() {
        super.onLoad();
        this.onEnterHall();
    }

    private onEnterHall(){
        uiManager().open({ type: HallView });
    }
}

logicManager().push(HallLogic);

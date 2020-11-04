import { Logic } from "../common/base/Logic";
import { LogicType, LogicEvent } from "../common/event/LogicEvent";
import { BUNDLE_RESOURCES } from "../framework/base/Defines";
import { Manager } from "../common/manager/Manager";
import HallView from "./view/HallView";


class HallLogic extends Logic {

    logicType: LogicType = LogicType.HALL;

    get bundle(){
        return BUNDLE_RESOURCES;
    }

    bindingEvents(){
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_HALL,this.onEnterHall); 
    }

    onLoad() {
        super.onLoad();
        this.onEnterHall();
    }

    private onEnterHall(){
        Manager.uiManager.open({ type: HallView , bundle:BUNDLE_RESOURCES});
    }
}

Manager.logicManager.push(HallLogic);

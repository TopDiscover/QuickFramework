import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent } from "../../../script/common/event/LogicEvent";
import HallView from "./view/HallView";
import { Manager } from "../../../script/common/manager/Manager";
import { HallData } from "./data/HallData";



class HallLogic extends Logic {

    logicType: LogicType = LogicType.HALL;

    get bundle(){
        return HallData.bundle;
    }

    bindingEvents(){
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_HALL,this.onEnterHall); 
    }

    private onEnterHall(){
        this.onLanguageChange();
        Manager.uiManager.open({ type: HallView , bundle:this.bundle});
    }

    protected onLanguageChange(){
        HallData.onLanguageChange();
    }
}

Manager.logicManager.push(HallLogic);

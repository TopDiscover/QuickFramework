import { Logic } from "../../../scripts/common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../../../scripts/common/event/LogicEvent";
import HallView from "./view/HallView";
import { HallData } from "./data/HallData";
import { HallLanguage } from "./data/HallLanguage";
import { Manager } from "../../../scripts/framework/Framework";
import { registerTypeManager } from "../../../scripts/framework/base/RegisterTypeManager";



class HallLogic extends Logic {

    logicType: LogicType = LogicType.HALL;

    language = new HallLanguage;

    get bundle(){
        return HallData.bundle;
    }

    bindingEvents(){
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_HALL,this.onEnterHall); 
        this.registerEvent(LogicEvent.ENTER_COMPLETE,this.onEnterComplete);
    }

    private onEnterHall(){
        Manager.language.addSourceDelegate(this.language);
        //添加大厅网络组件
        Manager.hallNetManager.addNetControllers();
        Manager.uiManager.open({ type: HallView , bundle:this.bundle});
    }

    public onEnterComplete(data: LogicEventData){
        super.onEnterComplete(data);
        if( data.type == LogicType.LOGIN){
            //进入登录界面，移除大厅的网络组件
            Manager.hallNetManager.removeNetControllers();
        }
    }
}

registerTypeManager.registerLogicType(HallLogic);

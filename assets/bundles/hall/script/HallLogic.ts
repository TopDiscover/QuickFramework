import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../../../script/common/event/LogicEvent";
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
        this.registerEvent(LogicEvent.ENTER_COMPLETE,this.onEnterComplete);
    }

    private onEnterHall(){
        this.onLanguageChange();
        //添加大厅网络组件
        Manager.netManager.addNetControllers();
        Manager.uiManager.open({ type: HallView , bundle:this.bundle});
    }

    protected onLanguageChange(){
        HallData.onLanguageChange();
    }

    public onEnterComplete(data: LogicEventData){
        super.onEnterComplete(data);
        if( data.type == LogicType.LOGIN){
            //进入登录界面，移除大厅的网络组件
            Manager.netManager.removeNetControllers();
        }
    }
}

Manager.logicManager.push(HallLogic);

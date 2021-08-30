import { Logic } from "../../../scripts/framework/core/logic/Logic";
import HallView from "./view/HallView";
import { HallData } from "./data/HallData";
import { HallLanguage } from "./data/HallLanguage";



class HallLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.HALL;

    language = new HallLanguage;

    get bundle(){
        return HallData.bundle;
    }

    bindingEvents(){
        super.bindingEvents();
        this.registerEvent(td.Logic.Event.ENTER_HALL,this.onEnterHall); 
        this.registerEvent(td.Logic.Event.ENTER_COMPLETE,this.onEnterComplete);
    }

    private onEnterHall(){
        Manager.language.addSourceDelegate(this.language);
        //添加大厅网络组件
        Manager.hallNetManager.addNetControllers();
        Manager.uiManager.open({ type: HallView , bundle:this.bundle});
    }

    public onEnterComplete(data: td.Logic.EventData){
        super.onEnterComplete(data);
        if( data.type == td.Logic.Type.LOGIN){
            //进入登录界面，移除大厅的网络组件
            Manager.hallNetManager.removeNetControllers();
        }
    }
}

Manager.logicManager.push(HallLogic);

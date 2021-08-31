import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import HallView from "./view/HallView";
import { HallData } from "./data/HallData";
import { HallLanguage } from "./data/HallLanguage";
import { Logic } from "../../../scripts/framework/core/logic/Logic";

class HallLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.HALL;

    language = new HallLanguage;

    get bundle() {
        return HallData.bundle;
    }

    addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_HALL, this.onEnterHall);
        this.addUIEvent(Logic.Event.ENTER_COMPLETE, this.onEnterComplete);
    }

    private onEnterHall() {
        console.log("login hall")
        Manager.language.addSourceDelegate(this.language);
        //添加大厅网络组件
        Manager.hallNetManager.addNetControllers();
        Manager.uiManager.open({ type: HallView, bundle: this.bundle });
    }

    public onEnterComplete(data: Logic.EventData) {
        super.onEnterComplete(data);
        if (data.type == Logic.Type.LOGIN) {
            //进入登录界面，移除大厅的网络组件
            Manager.hallNetManager.removeNetControllers();
        }
    }
}

Manager.logicManager.push(HallLogic);

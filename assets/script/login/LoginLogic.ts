
/**
 * @description 登录流程 , 不用导出
 */

import { Logic } from "../common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../common/event/LogicEvent";
import { ViewZOrder } from "../common/config/Config";
import { Manager } from "../common/manager/Manager";
import LoginView from "./view/LoginView";
import { BUNDLE_RESOURCES } from "../framework/base/Defines";

 class LoginLogic extends Logic {
    
    logicType: LogicType = LogicType.LOGIN;

    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_LOGIN,this.onEnterLogin);
    }

    get bundle(){
        return BUNDLE_RESOURCES;
    }

    onLoad(){
        super.onLoad();
        this.onEnterLogin();
    }

    private onEnterLogin(data?){
        cc.log(`--------------onEnterLogin--------------`);
        Manager.uiManager.open({ type : LoginView, zIndex: ViewZOrder.zero,bundle:this.bundle});
    }

    public onEnterComplete(data : LogicEventData){
        super.onEnterComplete(data);
    }

 }
Manager.logicManager.push(LoginLogic);

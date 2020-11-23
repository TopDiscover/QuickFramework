import UIView from "../../framework/ui/UIView";
import { Manager } from "../../common/manager/Manager";
import { GameConfig } from "../../common/base/HotUpdate";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../common/event/LogicEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginView extends UIView {

    static getPrefabUrl(){
        return "login/prefabs/LoginView"
    }

    private _login : cc.Node = null;

    onLoad(){
        super.onLoad();
        this._login = cc.find("login",this.node);
        this._login.on(cc.Node.EventType.TOUCH_END,()=>{
            Manager.bundleManager.enterBundle(new GameConfig("大厅","hall",0,LogicEvent.ENTER_HALL));
        });
        
        dispatchEnterComplete({type:LogicType.LOGIN,views:[this]})
    }
}

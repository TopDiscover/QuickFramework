import UIView from "../../framework/ui/UIView";
import { BundleConfig } from "../../common/base/HotUpdate";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../common/event/LogicEvent";
import { Config } from "../../common/config/Config";
import DownloadLoading from "../../common/component/DownloadLoading";
import { _decorator,Node, find, SystemEventType } from "cc";

const {ccclass, property} = _decorator;

@ccclass
export default class LoginView extends UIView {

    static getPrefabUrl(){
        return "login/prefabs/LoginView"
    }

    private _login : Node = null!;

    onLoad(){
        super.onLoad();
        this._login = find("login",this.node) as Node;
        this._login.on(SystemEventType.TOUCH_END,()=>{
            Manager.bundleManager.enterBundle(new BundleConfig("大厅",Config.BUNDLE_HALL,0,LogicEvent.ENTER_HALL,true));
        });

        // let version = cc.find("version", this.node).getComponent(cc.Label).string = "版本3";
        
        dispatchEnterComplete({type:LogicType.LOGIN,views:[this,DownloadLoading]})
    }
}

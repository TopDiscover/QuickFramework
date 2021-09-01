import UIView from "../../framework/core/ui/UIView";
import DownloadLoading from "../../common/component/DownloadLoading";
import { _decorator,Node, find, SystemEventType } from "cc";
import { HotUpdate } from "../../framework/core/hotupdate/Hotupdate";
import { Config } from "../../common/config/Config";
import { dispatchEnterComplete, Logic } from "../../framework/core/logic/Logic";

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
            Manager.bundleManager.enterBundle(new HotUpdate.BundleConfig("大厅",Config.BUNDLE_HALL,0,Logic.Event.ENTER_HALL,true));
        });

        // let version = cc.find("version", this.node).getComponent(cc.Label).string = "版本3";
        
        dispatchEnterComplete({type:Logic.Type.LOGIN,views:[this,DownloadLoading]})
    }
}

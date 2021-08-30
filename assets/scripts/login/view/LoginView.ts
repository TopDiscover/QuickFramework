import UIView from "../../framework/core/ui/UIView";
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
            Manager.bundleManager.enterBundle(new td.HotUpdate.BundleConfig("大厅",td.Config.BUNDLE_HALL,0,td.Logic.Event.ENTER_HALL,true));
        });

        // let version = cc.find("version", this.node).getComponent(cc.Label).string = "版本3";
        
        dispatchEnterComplete({type:td.Logic.Type.LOGIN,views:[this,DownloadLoading]})
    }
}

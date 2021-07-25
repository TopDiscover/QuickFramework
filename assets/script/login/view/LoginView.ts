import { UIView } from "../../framework/ui/UIView";
import { BundleConfig } from "../../common/base/HotUpdate";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../common/event/LogicEvent";
import { Config } from "../../common/config/Config";
import DownloadLoading from "../../common/component/DownloadLoading";

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
            Manager.bundleManager.enterBundle(new BundleConfig("大厅",Config.BUNDLE_HALL,0,LogicEvent.ENTER_HALL,true));
        });

        // let version = cc.find("version", this.node).getComponent(cc.Label).string = "版本3";
        
        dispatchEnterComplete({type:LogicType.LOGIN,views:[this,DownloadLoading]})
    }
}

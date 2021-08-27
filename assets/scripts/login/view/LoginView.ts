import { UIView } from "../../framework/ui/UIView";
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
            Manager.bundleManager.enterBundle(new td.HotUpdate.BundleConfig("大厅",td.Config.BUNDLE_HALL,0,td.Logic.Event.ENTER_HALL,true));
        });

        // let version = cc.find("version", this.node).getComponent(cc.Label).string = "版本3";
        
        dispatchEnterComplete({type:td.Logic.Type.LOGIN,views:[this,DownloadLoading]})
    }
}

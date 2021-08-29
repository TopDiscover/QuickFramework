import { UIView } from "../../framework/support/ui/UIView";
import DownloadLoading from "../../common/component/DownloadLoading";
import { NetManager } from "../../framework/support/net/service/NetManager";
import { AssetManager } from "../../framework/support/assetManager/AssetManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends UIView {

    static getPrefabUrl() {
        return "login/prefabs/LoginView"
    }

    private _login: cc.Node = null;

    onLoad() {
        super.onLoad();
        this._login = cc.find("login", this.node);
        this._login.on(cc.Node.EventType.TOUCH_END, () => {
            // console.log()
            // console.log(cc.js.getClassName(this))

            // //@ts-ignore
            // console.log(cc.js.getClassName(NetManager))
            // console.log(cc.js.getClassName(new NetManager("123")))

            // console.log(this.getClassName(AssetManager))
            Manager.bundleManager.enterBundle(new td.HotUpdate.BundleConfig("大厅", td.Config.BUNDLE_HALL, 0, td.Logic.Event.ENTER_HALL, true));
        });

        // let version = cc.find("version", this.node).getComponent(cc.Label).string = "版本3";

        dispatchEnterComplete({ type: td.Logic.Type.LOGIN, views: [this, DownloadLoading] })
    }
    getClassName(cls: Object): string {
        for (let key in cls) {
            return key
        }
    }
}

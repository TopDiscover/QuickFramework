import GameView from "../../framework/core/ui/GameView";
import { Macro } from "../../framework/defines/Macros";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends GameView {

    static getPrefabUrl(){
        return `@LoginView`;
    }

    private _login: cc.Node = null;

    onLoad() {
        super.onLoad();
        this._login = cc.find("login", this.node);
        let version = cc.find("version",this.node)?.getComponent(cc.Label);
        if ( version ){
            version.string = App.updateManager.getVersion(this.bundle);
        }
        this._login.on(cc.Node.EventType.TOUCH_END, () => {
            this.enterBundle(Macro.BUNDLE_HALL);
        });

        // let test = cc.find("test",this.node).getComponent(cc.Label)
        // test.string = Manager.utils.convertValue(-1123456222.8844,4)
    }
}

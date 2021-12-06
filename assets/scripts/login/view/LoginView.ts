import { _decorator,Node, find, Label } from "cc";
import GameView from "../../framework/core/ui/GameView";
import { Macro } from "../../framework/defines/Macros";

const {ccclass, property} = _decorator;

@ccclass
export default class LoginView extends GameView {

    static getPrefabUrl(){
        return "login/prefabs/LoginView"
    }

    private _login : Node = null!;

    onLoad(){
        super.onLoad();
        this._login = find("login", this.node) as Node;
        let version = find("version",this.node)?.getComponent(Label);
        if ( version ){
            version.string = Manager.hotupdate.getVersion(this.bundle,false);
        }
        this._login.on(Node.EventType.TOUCH_END, () => {
            this.enterBundle(Macro.BUNDLE_HALL);
        });
    }
}

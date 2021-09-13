import { _decorator,Node, find } from "cc";
import { Config } from "../../common/config/Config";
import GameView from "../../framework/core/ui/GameView";

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
        this._login.on(Node.EventType.TOUCH_END, () => {
            this.enterBundle(Config.BUNDLE_HALL);
        });
    }
}

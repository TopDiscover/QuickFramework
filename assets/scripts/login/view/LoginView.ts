import { Config } from "../../common/config/Config";
import GameView from "../../framework/core/ui/GameView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends GameView {

    static getPrefabUrl() {
        return "login/prefabs/LoginView"
    }

    private _login: cc.Node = null;

    onLoad() {
        super.onLoad();
        this._login = cc.find("login", this.node);
        this._login.on(cc.Node.EventType.TOUCH_END, () => {
            this.enterBundle(Config.BUNDLE_HALL);
        });
    }
    getClassName(cls: Object): string {
        for (let key in cls) {
            return key
        }
    }
}

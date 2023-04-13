import GameView from "../../framework/core/ui/GameView";
import { inject } from "../../framework/defines/Decorators";
import { Macro } from "../../framework/defines/Macros";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends GameView {

    static getPrefabUrl(){
        return `@LoginView`;
    }

    @inject("login",cc.Node)
    private login: cc.Node = null!;
    @inject("version",cc.Label)
    private version : cc.Label = null!;

    onLoad() {
        super.onLoad();
        this.version.string = App.updateManager.getVersion(this.bundle);
        this.login.on(cc.Node.EventType.TOUCH_END, () => {
            this.enterBundle(Macro.BUNDLE_HALL);
        });
    }
}

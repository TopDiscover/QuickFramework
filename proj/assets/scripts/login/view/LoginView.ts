import { _decorator,Node, find, Label } from "cc";
import GameView from "../../framework/core/ui/GameView";
import { inject } from "../../framework/defines/Decorators";
import { Macro } from "../../framework/defines/Macros";

const {ccclass, property} = _decorator;

@ccclass
export default class LoginView extends GameView {

    static getPrefabUrl(){
        return `@LoginView`;
    }

    @inject("login",Node)
    private login : Node = null!;
    @inject("version",Label)
    private version : Label = null!;
    @inject("md5",Label)
    private md5 : Label = null!;

    onLoad(){
        super.onLoad();
        this.version.string = `${App.updateManager.appVersion}(${App.updateManager.getVersion(this.bundle)})`;
        this.md5.string = `MD5:${App.updateManager.getMd5(this.bundle)}`;
        this.onN(this.login,Node.EventType.TOUCH_END,this.onClick);
    }

    private onClick(){
        this.enterBundle(Macro.BUNDLE_HALL);
    }
}

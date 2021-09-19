import EventComponent from "./scripts/framework/componects/EventComponent";
import { Config } from "./scripts/common/config/Config";
import { HotUpdate } from "./scripts/framework/core/hotupdate/Hotupdate";
import { DebugView } from "./scripts/common/debug/DebugView";
/**
 * @description 主控制器 
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("manager/MainController")
export default class MainController extends EventComponent {

    @property(cc.Asset)
    wssCacert: cc.Asset = null;

    addEvents() {
        super.addEvents();
        this.addUIEvent(HotUpdate.Event.DOWNLOAD_MESSAGE, this.onHotupdateMessage);
    }

    private onHotupdateMessage(data: HotUpdate.MessageData) {
        Manager.onHotupdateMessage(data);
    }

    private debugView : cc.Node | null = null!;

    onLoad() {
        super.onLoad();
        Manager.onLoad(this.node);
        if (this.wssCacert) {
            Manager.wssCacertUrl = this.wssCacert.nativeUrl;
        }
        let debug = cc.find("debug", this.node);
        this.debugView = cc.find("debugView",this.node);
        if (debug&&this.debugView) {
            if ( Config.isShowDebugButton ){
                debug.active = true;
                let view = this.debugView.addComponent(DebugView)
                if ( view ){
                    view.debug = debug;
                }
                this.debugView.active = false;
                debug.on(cc.Node.EventType.TOUCH_END,()=>{
                    if ( debug ) debug.active = false;
                    if ( this.debugView ){
                        this.debugView.active = true;
                    }
                });
            }else{
                debug.destroy();
                this.debugView.destroy();
            }
            
        }
        //游戏事件注册
        cc.game.on(cc.game.EVENT_HIDE, this.onEnterBackground, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onEnterForgeground, this);
    }

    update() {
        Manager.update(this.node);
    }

    onDestroy() {
        //移除键盘事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
        //移除游戏事件注册
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);
        Manager.onDestroy(this.node);
        super.onDestroy();
    }

    private onEnterBackground() {
        Manager.onEnterBackground();
    }

    private onEnterForgeground() {
        Manager.onEnterForgeground();
    }
}

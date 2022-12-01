import { Config } from "./scripts/common/config/Config";
import { DebugView } from "./scripts/common/debug/DebugView";
import EventComponent from "./scripts/framework/componects/EventComponent";
/**
 * @description 主控制器 
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("manager/MainController")
export default class MainController extends EventComponent {

    @property(cc.Asset)
    wssCacert: cc.Asset = null;

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
            let isVisibleDebugInfo = Manager.storage.getItem(Config.SHOW_DEBUG_INFO_KEY,true);
            cc.debug.setDisplayStats(isVisibleDebugInfo);
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
        //内存警告事件//Ts层已经同步，需要自己去导出事件上来
        // cc.game.on(cc.game.EVENT_LOW_MEMORY,this.onLowMemory,this);
    }

    update(dt:number) {
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

    private onLowMemory(){
        Manager.onLowMemory();
    }
}

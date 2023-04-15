import { Asset, find, Game, _decorator , Node, Input, input, profiler } from "cc";
import { Config } from "./scripts/common/config/Config";
import { DebugView } from "./scripts/common/debug/DebugView";
import EventComponent from "./scripts/framework/componects/EventComponent";
/**
 * @description 主控制器 
 */

const { ccclass, property, menu } = _decorator;

@ccclass
@menu("Quick公共组件/MainController")
export default class MainController extends EventComponent {

    @property(Asset)
    wssCacert: Asset = null!;

    private debugView : Node | null = null!;

    onLoad() {
        super.onLoad();
        App.onLoad(this.node);
        if (this.wssCacert) {
            App.wssCacertUrl = this.wssCacert.nativeUrl;
        }
        let debug = find("debug", this.node);
        this.debugView = find("debugView",this.node);
        if (debug&&this.debugView) {
            let isVisibleDebugInfo = App.storage.getItem(Config.SHOW_DEBUG_INFO_KEY,true);
            if ( isVisibleDebugInfo ) {
                profiler.showStats();
            }else{
                profiler.hideStats();
            }
            if ( Config.isShowDebugButton ){
                debug.active = true;
                let view = this.debugView.addComponent(DebugView)
                if ( view ){
                    view.debug = debug;
                }
                this.debugView.active = false;
                this.onN(debug,Input.EventType.TOUCH_END,()=>{
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
        this.onG(Game.EVENT_HIDE, this.onEnterBackground);
        this.onG(Game.EVENT_SHOW, this.onEnterForgeground);
        //内存警告事件
        this.onG(Game.EVENT_LOW_MEMORY,this.onLowMemory);
    }

    update(dt:number) {
        App.update(this.node);
    }

    onDestroy() {
        App.onDestroy(this.node);
        super.onDestroy();
    }

    private onEnterBackground() {
        App.onEnterBackground();
    }

    private onEnterForgeground() {
        App.onEnterForgeground();
    }

    private onLowMemory(){
        App.onLowMemory();
    }
}

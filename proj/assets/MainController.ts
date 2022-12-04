import { Asset, find, Game, game, _decorator , Node, Input, input, profiler } from "cc";
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
        Manager.onLoad(this.node);
        if (this.wssCacert) {
            Manager.wssCacertUrl = this.wssCacert.nativeUrl;
        }
        let debug = find("debug", this.node);
        this.debugView = find("debugView",this.node);
        if (debug&&this.debugView) {
            let isVisibleDebugInfo = Manager.storage.getItem(Config.SHOW_DEBUG_INFO_KEY,true);
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
                debug.on(Input.EventType.TOUCH_END,()=>{
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
        game.on(Game.EVENT_HIDE, this.onEnterBackground, this);
        game.on(Game.EVENT_SHOW, this.onEnterForgeground, this);
        //内存警告事件
        game.on(Game.EVENT_LOW_MEMORY,this.onLowMemory,this);
    }

    update(dt:number) {
        Manager.update(this.node);
    }

    onDestroy() {
        //移除键盘事件
        input.off(Input.EventType.KEY_UP);

        //移除游戏事件注册
        game.off(Game.EVENT_HIDE);
        game.off(Game.EVENT_SHOW);
        game.off(Game.EVENT_LOW_MEMORY);
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

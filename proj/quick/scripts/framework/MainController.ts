import { Asset, find, Game, _decorator, Node, Input, profiler, Vec3, UITransform, EventTouch, Vec2 } from "cc";
import { DebugView } from "./debug/DebugView";
import EventComponent from "./componects/EventComponent";
import { Macro } from "./defines/Macros";
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
            let isVisibleDebugInfo = App.storage.getItem(Macro.SHOW_DEBUG_INFO_KEY,true);
            if ( isVisibleDebugInfo ) {
                profiler.showStats();
            }else{
                profiler.hideStats();
            }
            if ( App.stageData.isShowDebugButton ){
                debug.active = true;
                let view = this.debugView.addComponent(DebugView)
                if ( view ){
                    view.debug = debug;
                }
                this.debugView.active = false;
                this.onN(debug,Input.EventType.TOUCH_END,(ev:EventTouch)=>{
                    let start = ev.getUIStartLocation();
                    let end = ev.getUILocation();
                    if ( Vec2.distance(start,end) > 5 ){
                        return;
                    }

                    if ( debug ) debug.active = false;
                    if ( this.debugView ){
                        this.debugView.active = true;
                    }
                });
                this.onN(debug,Input.EventType.TOUCH_MOVE,(ev:EventTouch)=>{
                    let location = ev.getUILocation();
                    let pos = this.node.getComponent(UITransform)?.convertToNodeSpaceAR( new Vec3( location.x,location.y));
                    debug?.setPosition(pos!);
                })
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

/**
 * @description 启动脚本
 */

import EventComponent from "../../quick/components/EventComponent";
import { DebugView } from "../debug/DebugView";
import { Macro } from "../../quick/defines/Macros";
import { ViewZOrder } from "../common/config/Config";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Quick公共组件/Launch")
export default class Launch extends EventComponent {

    @property(cc.Asset)
    wssCacert: cc.Asset = null!;

    private startPos: cc.Vec3 = null!;

    onLoad() {
        super.onLoad();
        App.onLoad(this.node);
        if (this.wssCacert) {
            App.wssCacertUrl = this.wssCacert.nativeUrl;
        }
        this.initDebug();
        //游戏事件注册
        this.onG(cc.game.EVENT_HIDE, this.onEnterBackground);
        this.onG(cc.game.EVENT_SHOW, this.onEnterForgeground);
        //内存警告事件//TS层已经同步，需要自己去导出事件上来
        // this.onG(cc.game.EVENT_LOW_MEMORY,this.onLowMemory);
    }

    update(dt: number) {
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

    private onLowMemory() {
        App.onLowMemory();
    }

    private initDebug() {
        if (CC_DEBUG) {
            let debug = cc.find("debug", this.node);
            if (debug) {
                let isVisibleDebugInfo = App.storage.getItem(Macro.SHOW_DEBUG_INFO_KEY, true);
                cc.debug.setDisplayStats(isVisibleDebugInfo);
                if (App.stageData.isShowDebugButton) {
                    debug.active = true;
                    this.onN(debug, cc.Node.EventType.TOUCH_START, (ev: cc.Event.EventTouch) => {
                        this.startPos = debug.position;
                    });
                    this.onN(debug, cc.Node.EventType.TOUCH_END, (ev: cc.Event.EventTouch) => {
                        if (cc.Vec3.distance(this.startPos, debug.position) > 5) {
                            return;
                        }
                        if (debug) debug.active = false;
                        App.uiManager.open({
                            type : DebugView,
                            bundle : Macro.BUNDLE_RESOURCES,
                            args : {
                                onClose : () => {
                                    if (debug) debug.active = true;
                                }
                            },
                            zIndex : ViewZOrder.Debug
                        })
                    });
                    this.onN(debug, cc.Node.EventType.TOUCH_MOVE, (ev: cc.Event.EventTouch) => {
                        let pos = this.node.convertToNodeSpaceAR(ev.getLocation())
                        debug.position = cc.v3(pos);
                    })
                } else {
                    debug.destroy();
                }
            }
        }
    }
}

import { Asset, find, Game, game, SystemEvent, systemEvent, _decorator , Node, DebugMode, setDisplayStats } from "cc";
import { Config } from "./scripts/common/config/Config";
import { DebugView } from "./scripts/common/debug/DebugView";
import EventComponent from "./scripts/framework/componects/EventComponent";
import { Update } from "./scripts/framework/core/update/Update";
/**
 * @description 主控制器 
 */

const { ccclass, property, menu } = _decorator;

@ccclass
@menu("manager/MainController")
export default class MainController extends EventComponent {

    @property(Asset)
    wssCacert: Asset = null!;

    protected addEvents() {
        super.addEvents();
        this.addEvent(Update.Event.MAIN_VERSION_IS_TOO_LOW,this.onMainVersionIsTooLow);
    }

    private onMainVersionIsTooLow(code : Update.Code,config:Update.Config){
        Manager.onMainVersionIsTooLow(code,config);
    }

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
            let isVisibleDebugInfo = Manager.localStorage.getItem(Config.SHOW_DEBUG_INFO_KEY,true);
            setDisplayStats(isVisibleDebugInfo);
            if ( Config.isShowDebugButton ){
                debug.active = true;
                let view = this.debugView.addComponent(DebugView)
                if ( view ){
                    view.debug = debug;
                }
                this.debugView.active = false;
                debug.on(SystemEvent.EventType.TOUCH_END,()=>{
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
    }

    update() {
        Manager.update(this.node);
    }

    onDestroy() {
        //移除键盘事件
        systemEvent.off(SystemEvent.EventType.KEY_UP);

        //移除游戏事件注册
        game.off(Game.EVENT_HIDE);
        game.off(Game.EVENT_SHOW);
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

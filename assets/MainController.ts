import { Asset, find, Game, game, SystemEvent, systemEvent, SystemEventType, _decorator } from "cc";
import { Config } from "./scripts/common/config/Config";
import EventComponent from "./scripts/framework/componects/EventComponent";
import { HotUpdate } from "./scripts/framework/core/hotupdate/Hotupdate";
/**
 * @description 主控制器 
 */

const { ccclass, property, menu } = _decorator;

@ccclass
@menu("manager/MainController")
export default class MainController extends EventComponent {

    @property(Asset)
    wssCacert: Asset = null!;

    addEvents() {
        super.addEvents();
        this.addUIEvent(HotUpdate.Event.DOWNLOAD_MESSAGE, this.onHotupdateMessage);
    }

    private onHotupdateMessage(data: HotUpdate.MessageData) {
        Manager.onHotupdateMessage(data);
    }

    onLoad() {
        super.onLoad();
        Manager.onLoad(this.node);
        if (this.wssCacert) {
            Manager.wssCacertUrl = this.wssCacert.nativeUrl;
        }
        let show = find("show", this.node);
        if (show) {
            show.zIndex = 9999;
            //调试按钮事件注册
            let showUI = find("showUI", show);
            let showNode = find("showNode", show);
            let showRes = find("showRes", show);
            let showComp = find("showComponent", show);
            if (showUI && showNode && showRes && showComp) {
                let isShow = false;
                if (Config.isShowDebugButton) {
                    isShow = true;
                    showUI.on(SystemEventType.TOUCH_END, () => {
                        Manager.uiManager.printViews();
                    });
                    showNode.on(SystemEventType.TOUCH_END, () => {
                        Manager.uiManager.printCanvasChildren();
                    });
                    showRes.on(SystemEventType.TOUCH_END, () => {
                        Manager.cacheManager.printCaches();
                    });
                    showComp.on(SystemEventType.TOUCH_END, () => {
                        Manager.uiManager.printComponent();
                    });
                }
                showUI.active = isShow;
                showNode.active = isShow;
                showRes.active = isShow;
                showComp.active = isShow;
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

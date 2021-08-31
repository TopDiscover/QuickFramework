import EventComponent from "./scripts/framework/componects/EventComponent";
import { Config } from "./scripts/common/config/Config";
import { HotUpdate } from "./scripts/framework/core/hotupdate/Hotupdate";
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

    onLoad() {
        super.onLoad();
        Manager.onLoad(this.node);
        if (this.wssCacert) {
            Manager.wssCacertUrl = this.wssCacert.nativeUrl;
        }
        //调试按钮事件注册
        let showUI = cc.find("showUI", this.node);
        let showNode = cc.find("showNode", this.node);
        let showRes = cc.find("showRes", this.node);
        let showComp = cc.find("showComponent", this.node);
        if (showUI && showNode && showRes && showComp) {
            showUI.zIndex = 9999;
            showNode.zIndex = 9999;
            showRes.zIndex = 9999;
            showComp.zIndex = 9999;
            let isShow = false;
            if (Config.isShowDebugButton) {
                isShow = true;
                showUI.on(cc.Node.EventType.TOUCH_END, () => {
                    Manager.uiManager.printViews();
                });
                showNode.on(cc.Node.EventType.TOUCH_END, () => {
                    Manager.uiManager.printCanvasChildren();
                });
                showRes.on(cc.Node.EventType.TOUCH_END, () => {
                    Manager.cacheManager.printCaches();
                });
                showComp.on(cc.Node.EventType.TOUCH_END, () => {
                    Manager.uiManager.printComponent();
                });
            }
            showUI.active = isShow;
            showNode.active = isShow;
            showRes.active = isShow;
            showComp.active = isShow;
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

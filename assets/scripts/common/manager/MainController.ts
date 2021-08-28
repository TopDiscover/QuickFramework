import { Asset, find, Game, game, SystemEvent, systemEvent, SystemEventType, _decorator } from "cc";
import EventComponent from "../../framework/base/EventComponent";
import DownloadLoading from "../component/DownloadLoading";
import { Reconnect } from "../net/Reconnect";
/**
 * @description 主控制器 
 */

const { ccclass, property, menu } = _decorator;

@ccclass
@menu("manager/MainController")
export default class MainController extends EventComponent {
    
    /**@description 进入后台的时间 */
    private _enterBackgroundTime = 0;

    @property(Asset)
    wssCacert: Asset = null!;

    bindingEvents(){
        super.bindingEvents();
        this.registerEvent(td.HotUpdate.Event.DOWNLOAD_MESSAGE,this.onHotupdateMessage);
    }

    private onHotupdateMessage( data : td.HotUpdate.MessageData ){
        if ( data.isOk ){
            Manager.uiManager.open({type : DownloadLoading,zIndex:td.ViewZOrder.Loading,args:[data.state,data.name,data.bundle]});
        }else{
            game.end();
        }
    }

    onLoad () {
        super.onLoad();
        if( this.wssCacert ){
            Manager.wssCacertUrl = this.wssCacert.nativeUrl;
        }

        Manager.resolutionHelper.onLoad(this.node);

        //全局网络管理器onLoad
        Manager.netManager.onLoad(this.node);
        //大厅
        Manager.hallNetManager.onLoad(this.node);

        //预先加载下loading预置体
        Manager.tips.preloadPrefab();
        Manager.uiLoading.preloadPrefab();
        Manager.loading.preloadPrefab();
        Manager.alert.preloadPrefab();
        Reconnect.preloadPrefab();


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
                if (td.Config.isShowDebugButton) {
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

        //Service onLoad
        Manager.serviceManager.onLoad();

        //逻辑管理器
        Manager.logicManager.onLoad(this.node);
    }

    update() {

        //Service 网络调试
        Manager.serviceManager.update();

        //远程资源下载任务调度
        Manager.assetManager.remote.update();
    }

    onDestroy() {

        Manager.resolutionHelper.onDestroy();

        //网络管理器onDestroy
        Manager.netManager.onDestroy(this.node);
        Manager.hallNetManager.onDestroy(this.node);
        //移除键盘事件
        systemEvent.off(SystemEvent.EventType.KEY_UP);

        //移除游戏事件注册
        game.off(Game.EVENT_HIDE);
        game.off(Game.EVENT_SHOW);

        Manager.serviceManager.onDestroy();

        //逻辑管理器
        Manager.logicManager.onDestroy(this.node);
        super.onDestroy();
    }

    private onEnterBackground() {
        this._enterBackgroundTime = Date.timeNow();
        log(`[MainController]`, `onEnterBackground ${this._enterBackgroundTime}`);
        Manager.globalAudio.onEnterBackground();
        Manager.serviceManager.onEnterBackground();
    }

    private onEnterForgeground() {
        let now = Date.timeNow();
        let inBackgroundTime = now - this._enterBackgroundTime;
        log(`[MainController]`, `onEnterForgeground ${now} background total time : ${inBackgroundTime}`);
        Manager.globalAudio.onEnterForgeground(inBackgroundTime);
        Manager.serviceManager.onEnterForgeground(inBackgroundTime);
    }
}

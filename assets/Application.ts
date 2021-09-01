import { game , Node } from "cc";
import Alert from "./scripts/common/component/Alert";
import DownloadLoading from "./scripts/common/component/DownloadLoading";
import GlobalAudio from "./scripts/common/component/GlobalAudio";
import Loading from "./scripts/common/component/Loading";
import Tips from "./scripts/common/component/Tips";
import UILoading from "./scripts/common/component/UILoading";
import { Config, ViewZOrder } from "./scripts/common/config/Config";
import { CommonLanguage } from "./scripts/common/language/CommonLanguage";
import { ServiceManager } from "./scripts/common/manager/ServiceManager";
import { Reconnect } from "./scripts/common/net/Reconnect";
import { HotUpdate } from "./scripts/framework/core/hotupdate/Hotupdate";
import { Log } from "./scripts/framework/core/log/Log";
import { LogLevel } from "./scripts/framework/defines/Enums";
import { Framewok } from "./scripts/framework/Framework";

/**@description 游戏所有运行单例的管理 */
class _Manager extends Framewok implements GameEventInterface {

    /**@description 进入后台的时间 */
    private _enterBackgroundTime = 0;

    /**@description 网络Service管理器 */
    get serviceManager() {
        return getSingleton(ServiceManager);
    }

    /**@description 小提示 */
    get tips() {
        return getSingleton(Tips);
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading(): UILoading {
        return getSingleton(UILoading);
    }

    /**@description 弹出提示框,带一到两个按钮 */
    get alert() {
        return getSingleton(Alert);
    }

    /**@description 公共loading */
    get loading() {
        return getSingleton(Loading);
    }

    private _wssCacertUrl = "";
    /**@description websocket wss 证书url地址 */
    set wssCacertUrl(value) {
        this._wssCacertUrl = value;
    }
    get wssCacertUrl() {
        return this._wssCacertUrl;
    }

    /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
    private _globalAudio: GlobalAudio = null!;
    get globalAudio() {
        if (this._globalAudio) {
            return this._globalAudio;
        }
        this._globalAudio = this.uiManager.getCanvas().getComponent(GlobalAudio) as GlobalAudio;
        return this._globalAudio;
    }

    init() {
        super.init();
        this.hotupdate.commonHotUpdateUrl = Config.TEST_HOT_UPDATE_URL_ROOT;
        this.hotupdate.isSkipCheckUpdate = Config.isSkipCheckUpdate;
        this.bundleManager.bundleHall = Config.BUNDLE_HALL;
        //语言包初始化
        //cc.log("language init");
        this.language.addSourceDelegate(new CommonLanguage);
    }

    onLoad(node: Node) {
        Manager.adaptor.onLoad(node);
        //全局网络管理器onLoad
        Manager.netManager.onLoad(node);
        //大厅
        Manager.hallNetManager.onLoad(node);
        //预先加载下loading预置体
        Manager.tips.preloadPrefab();
        Manager.uiLoading.preloadPrefab();
        Manager.loading.preloadPrefab();
        Manager.alert.preloadPrefab();
        Reconnect.preloadPrefab();
        //Service onLoad
        Manager.serviceManager.onLoad();
        //逻辑管理器
        Manager.logicManager.onLoad(node);
    }

    update(node: Node) {
        //Service 网络调试
        Manager.serviceManager.update();

        //远程资源下载任务调度
        Manager.assetManager.remote.update();
    }

    onDestroy(node: Node) {
        Manager.adaptor.onDestroy();
        //网络管理器onDestroy
        Manager.netManager.onDestroy(node);
        Manager.hallNetManager.onDestroy(node);
        Manager.serviceManager.onDestroy();

        //逻辑管理器
        Manager.logicManager.onDestroy(node);

    }

    onEnterBackground(): void {
        this._enterBackgroundTime = Date.timeNow();
        log(`[MainController]`, `onEnterBackground ${this._enterBackgroundTime}`);
        Manager.globalAudio.onEnterBackground();
        Manager.serviceManager.onEnterBackground();
    }
    onEnterForgeground(): void {
        let now = Date.timeNow();
        let inBackgroundTime = now - this._enterBackgroundTime;
        log(`[MainController]`, `onEnterForgeground ${now} background total time : ${inBackgroundTime}`);
        Manager.globalAudio.onEnterForgeground(inBackgroundTime);
        Manager.serviceManager.onEnterForgeground(inBackgroundTime);
    }

    onHotupdateMessage(data: HotUpdate.MessageData){
        if (data.isOk) {
            Manager.uiManager.open({ type: DownloadLoading, zIndex: ViewZOrder.Loading, args: [data.state, data.name, data.bundle] });
        } else {
            game.end();
        }
    }
}

Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN | LogLevel.DUMP;
let mgr = new _Manager();
(<any>window)["Manager"] = mgr;
mgr.init();
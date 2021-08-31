import Alert from "./scripts/common/component/Alert";
import GlobalAudio from "./scripts/common/component/GlobalAudio";
import Loading from "./scripts/common/component/Loading";
import Tips from "./scripts/common/component/Tips";
import UILoading from "./scripts/common/component/UILoading";
import { Config } from "./scripts/common/config/Config";
import { CommonLanguage } from "./scripts/common/language/CommonLanguage";
import { ServiceManager } from "./scripts/common/manager/ServiceManager";
import { Log } from "./scripts/framework/core/log/Log";
import { LogLevel } from "./scripts/framework/defines/Enums";
import { Framewok } from "./scripts/framework/Framework";

/**@description 游戏所有运行单例的管理 */
class _Manager extends Framewok {

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
    private _globalAudio: GlobalAudio = null;
    get globalAudio() {
        if (this._globalAudio) {
            return this._globalAudio;
        }
        this._globalAudio = this.uiManager.getCanvas().getComponent(GlobalAudio);
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
}

Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN | LogLevel.DUMP;
let mgr = new _Manager();
window["Manager"] = mgr;
mgr.init();
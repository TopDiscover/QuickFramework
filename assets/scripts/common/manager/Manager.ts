/**@description 管理器 */
import { Framewok } from "../../framework/Framework";
import { commonConfigInit, Config } from "../config/Config";
commonConfigInit();
import { Log } from "../../framework/core/log/Log";
import GlobalAudio from "../component/GlobalAudio";
import Tips from "../component/Tips";
import UILoading from "../component/UILoading";
import Alert from "../component/Alert";
import Loading from "../component/Loading";
import { ServiceManager } from "./ServiceManager";
import { CommonLanguage } from "../language/CommonLanguage";
import { LogLevel } from "../../framework/defines/Enums";



/**@description 游戏所有运行单例的管理 */
class _Manager extends Framewok {

    /**@description 网络Service管理器 */
    get serviceManager() {
        return getSingleton(ServiceManager);
    }

    /**@description 小提示 */
    get tips(){
        return getSingleton(Tips);
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading():UILoading{
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

    private _wssCacertUrl ="";
    /**@description websocket wss 证书url地址 */
    set wssCacertUrl(value) {
        this._wssCacertUrl = value;
    }
    get wssCacertUrl(){
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

export function applicationInit() {
    //日志
    Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN | LogLevel.DUMP;
    let mgr = new _Manager();
    window["Manager"] = mgr;
    mgr.init();
}

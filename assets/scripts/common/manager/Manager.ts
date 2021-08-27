/**@description 管理器 */
import { Framewok } from "../../framework/Framework";
import { commonConfigInit } from "../config/Config";
commonConfigInit();
import { Log } from "../../framework/log/Log";
import { NetManager } from "./NetManager";
import { LogicManager } from "../../framework/base/LogicManager";
import GlobalAudio from "../component/GlobalAudio";
import { CocosExtentionInit } from "../../framework/extentions/CocosExtention";
import GameView from "../../framework/base/GameView";
import { GameData } from "../../framework/base/GameData";
import { BundleManager } from "./BundleManager";
import Tips from "../component/Tips";
import UILoading from "../component/UILoading";
import Alert from "../component/Alert";
import Loading from "../component/Loading";
import { ServiceManager } from "./ServiceManager";
import { CommonLanguage } from "../language/CommonLanguage";



/**@description 游戏所有运行单例的管理 */
class _Manager extends Framewok {
    private _netManager: NetManager = null;
    /**@description 全局常驻网络组件管理器,注册到该管理器的网络组件会跟游戏的生命周期一致 */
    get netManager() {
        if (!this._netManager) {
            this._netManager = new NetManager("netManager");
        }
        return this._netManager;
    }

    private _hallNetManager: NetManager = null;
    /**@description 大厅的网络控制器组件管理器，注册到该管理器的网络组件，除登录界面外，都会被移除掉*/
    get hallNetManager() {
        if (!this._hallNetManager) {
            this._hallNetManager = new NetManager("hallNetManager");
        }
        return this._hallNetManager;
    }

    /**@description 网络Service管理器 */
    get serviceManager() {
        return getSingleton(ServiceManager);
    }

    /**@description 逻辑控制器管理器 */
    get logicManager() {
        return getSingleton(LogicManager);
    }

    /**@description bundle管理器 */
    get bundleManager() {
        return getSingleton(BundleManager);
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

    /**@description 当前游戏GameView, GameView进入onLoad赋值 */
    gameView: GameView = null;

    /**@description 游戏数据 */
    gameData: GameData = null;

    /**@description 游戏控制器，在自己的模块内写函数有类型化读取,此值在Logic.addNetComponent赋值
     * @example 
     * export function netController() : TankBattleNetController{
     * return Manager.gameController;
     * }
     * 
     */
    gameController: any = null;

    init() {
        //适配
        this.resolutionHelper.initBrowserAdaptor();
        //引擎扩展初始化
        CocosExtentionInit();
        //语言包初始化
        //cc.log("language init");
        this.language.addSourceDelegate(new CommonLanguage);
    }
}

export function applicationInit() {
    //日志
    Log.logLevel = td.Log.Level.ERROR | td.Log.Level.LOG | td.Log.Level.WARN | td.Log.Level.DUMP;
    let mgr = new _Manager();
    window["Manager"] = mgr;
    mgr.init();
}

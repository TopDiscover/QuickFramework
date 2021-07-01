/**@description 管理器 */

import * as Framework from "../../framework/Framework";
import { NetManager } from "./NetManager";
import { LogicManager } from "./LogicManager";
import GlobalAudio from "../component/GlobalAudio";
import { Log, LogLevel } from "../../framework/log/Log";
import { extentionsInit } from "../../framework/extentions/Extentions";
import { CocosExtentionInit } from "../../framework/extentions/CocosExtention";
import { getSingleton } from "../../framework/base/Singleton";
import { USING_LAN_KEY, BUNDLE_TYPE, BUNDLE_RESOURCES } from "../../framework/base/Defines";
import GameView from "../base/GameView";
import { GameData } from "../base/GameData";
import { BundleManager } from "./BundleManager";
import Tips from "../component/Tips";
import UILoading from "../component/UILoading";
import Alert from "../component/Alert";
import Loading from "../component/Loading";
import { ServiceManager } from "./ServiceManager";
import { CommonLanguage } from "../language/CommonLanguage";

/**@description 游戏所有运行单例的管理 */
class _Manager extends Framework._FramewokManager {
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

    /**@description 弹出提示框,带一到两个按钮 */
    get alert() {
        return getSingleton(Alert);
    }

    /**@description 公共loading */
    get loading() {
        return getSingleton(Loading);
    }

    /**@description websocket wss 证书url地址 */
    set wssCacertUrl(value) {
        this._wssCacertUrl = value;
        Framework.Manager.wssCacertUrl = value;
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

    /**
     * @description 把语言包转换成i18n.xxx形式
     * @param param 语言包配置
     * @param bundle bundle
     * @example
     * export let TANK_LAN_ZH = {
     * language: cc.sys.LANGUAGE_CHINESE,
     * data: {
     * title: `坦克大战`,
     * player: '单人模式 ',
     * palyers: '双人模式',
     * }
     * }
     * //以上是坦克大战的语言包,assetBundle为tankBattle
     * Manager.makeLanguage("title","tankBattle"); //=> i18n.tankBattle.title 指向游戏特定的语言包
     * Manager.makeLanguage("title"); //=> i18n.title 指向的大厅的公共语言包
     */
    makeLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE = BUNDLE_RESOURCES): (string | number)[] | string {
        if (typeof param == "string") {
            if (bundle) {
                return `${USING_LAN_KEY}${bundle}.${param}`;
            }
            return `${USING_LAN_KEY}${param}`;
        }
        if (typeof param[0] == "string" && param instanceof Array) {
            if (bundle) {
                param[0] = `${USING_LAN_KEY}${bundle}.${param[0]}`;
            } else {
                param[0] = `${USING_LAN_KEY}${param[0]}`;
            }
        }
        return param;
    }

    /**@description 获取语言包 
     * 
     */
    getLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE = null): string {
        let key = "";
        if (typeof param == "string") {
            if (bundle) {
                key = `${USING_LAN_KEY}${bundle}.${param}`;
            } else {
                key = `${USING_LAN_KEY}${param}`;
            }
            return this.language.get([key]);
        }
        if (typeof param[0] == "string" && param instanceof Array) {
            if (bundle) {
                param[0] = `${USING_LAN_KEY}${bundle}.${param[0]}`;
            } else {
                param[0] = `${USING_LAN_KEY}${param[0]}`;
            }
            return this.language.get(param);
        }
        cc.error(`传入参数有误`);
        return "";
    }

    init() {
        //日志
        Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN | LogLevel.DUMP;

        /**@description 初始化框架层使用的提示组件 */
        Framework.Manager.tips = getSingleton(Tips);
        /**@description 应用层的tips初始化 */
        this.tips = Framework.Manager.tips;

        /**@description 初始框架层使用的UILoading */
        Framework.Manager.uiLoading = getSingleton(UILoading);
        this.uiLoading = Framework.Manager.uiLoading;

        //适配
        this.resolutionHelper.initBrowserAdaptor();
        //扩展
        extentionsInit();
        //引擎扩展初始化
        CocosExtentionInit();
        //语言包初始化
        //cc.log("language init");
        this.language.addSourceDelegate(new CommonLanguage);
    }
}

export const Manager = new _Manager();
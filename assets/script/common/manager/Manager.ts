/**@description 管理器 */

import { _FramewokManager } from "../../framework/Framework";
import { NetManager } from "./NetManager";
import { LogicManager } from "./LogicManager";
import GlobalAudio from "../component/GlobalAudio";
import { Log, LogLevel } from "../../framework/log/Log";
import { extentionsInit } from "../../framework/extentions/Extentions";
import { CocosExtentionInit } from "../../framework/extentions/CocosExtention";
import { LanguageImpl } from "../language/LanguageImpl";
import { getSingleton } from "../../framework/base/Singleton";
import { USING_LAN_KEY } from "../../framework/base/Defines";

class _Manager extends _FramewokManager {

    /**@description 网络组件管理器 */
    get netManager() {
        return getSingleton(NetManager);
    }

    /**@description 逻辑控制器管理器 */
    get logicManager() {
        return getSingleton(LogicManager);
    }

    /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
    private _globalAudio : GlobalAudio = null;
    get globalAudio() {
        if ( this._globalAudio ){
            return this._globalAudio;
        }
        this._globalAudio = this.uiManager.getCanvas().getComponent(GlobalAudio);
        return this._globalAudio;
    }

    /**@description 当前游戏Bundle名 */
    currentGameBundle : string = null;

    /**
     * @description 把语言包转换成i18n.xxx形式
     * @param param 语言包配置
     * @param isUsingAssetBundle 是否使用currentGameBundle进行转换如在某游戏内，需要获取某游戏的语言包路径
     * @example
     * export let TANK_LAN_ZH = {
     * language: "zh",
     * data: {
     * title: `坦克大战`,
     * player: '单人模式 ',
     * palyers: '双人模式',
     * }
     * }
     * //以上是坦克大战的语言包,assetBundle为tankBattle
     * Manager.makeLanguage("title",true); //=> i18n.tankBattle.title 指向游戏特定的语言包
     * Manager.makeLanguage("title"); //=> i18n.title 指向的大厅的公共语言包
     */
    makeLanguage( param : string | (string | number)[] , isUsingAssetBundle : boolean = false ) : (string | number )[] | string {
        if ( typeof param == "string" ){
            if ( isUsingAssetBundle && !!this.currentGameBundle){
                return `${USING_LAN_KEY}${this.currentGameBundle}${param}`;
            }
            return `${USING_LAN_KEY}${param}`;
        }
        if( typeof param[0] == "string" && param instanceof Array ){
            if ( isUsingAssetBundle && !!this.currentGameBundle ){
                param[0] = `${USING_LAN_KEY}${this.currentGameBundle}${param[0]}`;
            }else{
                param[0] = `${USING_LAN_KEY}${param[0]}`;
            }
        }
        return param;
    }

    init() {
        //日志
        Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN | LogLevel.DUMP;
        //适配
        this.resolutionHelper.initBrowserAdaptor();
        //扩展
        extentionsInit();
        //引擎扩展初始化
        CocosExtentionInit();
        //语言包初始化
        //cc.log("language init");
        this.language.delegate = getSingleton(LanguageImpl)
    }
}

export const Manager = new _Manager();
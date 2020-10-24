/**@description 管理器 */

import * as Framework from "../../framework/Framework";
import { NetManager } from "./NetManager";
import { LogicManager } from "./LogicManager";
import GlobalAudio from "../component/GlobalAudio";
import { Log, LogLevel } from "../../framework/log/Log";
import { extentionsInit } from "../../framework/extentions/Extentions";
import { CocosExtentionInit } from "../../framework/extentions/CocosExtention";
import { LanguageImpl } from "../language/LanguageImpl";
import { getSingleton } from "../../framework/base/Singleton";
import { USING_LAN_KEY } from "../../framework/base/Defines";
import GameView from "../base/GameView";
import { GameData } from "../base/GameData";
import { GameManager } from "./GameManager";
import Tips from "../component/Tips";

class _Manager extends Framework._FramewokManager {

    /**@description 全局常驻网络组件管理器 */
    get netManager() {
        return getSingleton(NetManager);
    }

    /**@description 逻辑控制器管理器 */
    get logicManager() {
        return getSingleton(LogicManager);
    }

    get gameManager() {
        return getSingleton(GameManager);
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

    /**@description 当前游戏GameView, GameView进入onLoad赋值 */
    gameView : GameView = null;

    /**@description 游戏数据 */
    gameData : GameData = null;

    /**@description 游戏控制器，在自己的模块内写函数有类型化读取,此值在Logic.addNetComponent赋值
     * @example 
     * export function netController() : TankBattleNetController{
     * return Manager.gameController;
     * }
     * 
     */
    gameController : any = null;

    /**
     * @description 把语言包转换成i18n.xxx形式
     * @param param 语言包配置
     * @param isUsingAssetBundle 是否使用currentGameBundle进行转换如在某游戏内，需要获取某游戏的语言包路径
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
     * Manager.makeLanguage("title",true); //=> i18n.tankBattle.title 指向游戏特定的语言包
     * Manager.makeLanguage("title"); //=> i18n.title 指向的大厅的公共语言包
     */
    makeLanguage( param : string | (string | number)[] , isUsingAssetBundle : boolean = false ) : (string | number )[] | string {
        if ( typeof param == "string" ){
            if ( isUsingAssetBundle && this.gameData){
                return `${USING_LAN_KEY}${this.gameData.bundle}.${param}`;
            }
            return `${USING_LAN_KEY}${param}`;
        }
        if( typeof param[0] == "string" && param instanceof Array ){
            if ( isUsingAssetBundle && this.gameData ){
                param[0] = `${USING_LAN_KEY}${this.gameData.bundle}.${param[0]}`;
            }else{
                param[0] = `${USING_LAN_KEY}${param[0]}`;
            }
        }
        return param;
    }

    init() {
        //日志
        Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN | LogLevel.DUMP;

        /**@description 初始化框架层使用的提示组件 */
        Framework.Manager.tips = getSingleton(Tips)
        /**@description 应用层的tips初始化 */
        this.tips = Framework.Manager.tips;

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
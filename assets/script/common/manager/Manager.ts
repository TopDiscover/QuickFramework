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
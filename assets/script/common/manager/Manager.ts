/**@description 管理器 */

import { _FramewokManager } from "../../framework/Framework";
import { netManager } from "./NetManager";
import { logicManager } from "./LogicManager";
import GlobalAudio from "../component/GlobalAudio";
import { Log, LogLevel } from "../../framework/log/Log";
import { extentionsInit } from "../../framework/extentions/Extentions";
import { CocosExtentionInit } from "../../framework/extentions/CocosExtention";
import { LanguageImpl } from "../language/LanguageImpl";
import { getSingleton } from "../../framework/base/Singleton";

class _Manager extends _FramewokManager {

    /**@description 网络组件管理器 */
    get netManager() {
        return netManager();
    }

    /**@description 逻辑控制器管理器 */
    get logicManager() {
        return logicManager();
    }

    get globalAudio() {
        return Manager.uiManager.getCanvas().getComponent(GlobalAudio);
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
window["Manager"] = Manager;
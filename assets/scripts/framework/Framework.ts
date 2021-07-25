import { NodePoolManager } from "./base/NodePoolManager";
import { Language } from "./base/Language";
import { EventDispatcher } from "./event/EventDispatcher";
import { UIManager } from "./base/UIManager";
import { LocalStorage } from "./base/LocalStorage";
import { _AssetManager } from "./assetManager/AssetManager";
import { CacheManager } from "./assetManager/CacheManager";
import { ResolutionHelper } from "./adaptor/ResolutionHelper";
import { BUNDLE_RESOURCES, USING_LAN_KEY } from "./base/Global";

/**@description 框架层使用的各管理器单例的管理 */
export class Framewok {

    /**@description 常驻资源指定的模拟view */
    get retainMemory() { return this.uiManager.retainMemory; }

    /**@description 语言包 */
    get language() {
        return getSingleton(Language);
    }

    /**@description 事件派发器 */
    get eventDispatcher() {
        return getSingleton(EventDispatcher);
    }

    /**@description 界面管理器 */
    get uiManager() {
        return getSingleton(UIManager);
    }

    /**@description 本地仓库 */
    get localStorage() {
        return getSingleton(LocalStorage);
    }

    /**@description 资源管理器 */
    get assetManager() {
        return getSingleton(_AssetManager);
    }

    /**@description 资源缓存管理器 */
    get cacheManager() {
        return getSingleton(CacheManager);
    }

    /**@description 屏幕适配 */
    get resolutionHelper() {
        return getSingleton(ResolutionHelper);
    }

    /**@description 对象池管理器 */
    get nodePoolManager() {
        return getSingleton(NodePoolManager);
    }

    /**@description 小提示 */
    get tips():Tips {
        return <any>null;
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading():UILoading {
        return <any>null;
    }

    /**@description websocket wss 证书url地址 */
    get wssCacertUrl() {
        return "";
    }

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
    getLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE | null = null): any {
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
        error(`传入参数有误`);
        return "";
    }
}

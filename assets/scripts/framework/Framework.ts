import AudioComponent from "./base/AudioComponent";
import { BUNDLE_TYPE, USING_LAN_KEY } from "./base/Defines";
import { IAlert } from "./interface/IAlert";
import { IAssetManager } from "./interface/IAssetManager";
import { IBundleManager } from "./interface/IBundleManager";
import { ICacheManager } from "./interface/ICacheManager";
import { IEventDispatcher } from "./interface/IEventDispatcher";
import { IGameData } from "./interface/IGameData";
import { IGlobalAudio } from "./interface/IGlobalAudio";
import { ILanguage } from "./interface/ILanguage";
import { Iloading } from "./interface/Iloading";
import { ILocalStorage } from "./interface/ILocalStorage";
import { ILogicManager } from "./interface/ILogicManager";
import { IManager } from "./interface/IManager";
import { INetManager } from "./interface/INetManager";
import { INodePoolManager } from "./interface/INodePoolManager";
import { IResolutionHelper } from "./interface/IResolutionHelper";
import { IServiceManager } from "./interface/IServiceManager";
import { ISingleManager } from "./interface/ISingleManager";
import { IUIManager, ViewDynamicLoadData } from "./interface/IUIManager";
import TipsDelegate from "./ui/TipsDelegate";
import UILoadingDelegate from "./ui/UILoadingDelegate";
import UIView from "./ui/UIView";
import { Node } from "cc"

/**@description 框架层使用的各管理器单例的管理 */
class FramewokManager implements IManager , ISingleManager{

    onLoad(node: Node): void{
        // 把所有管理器进入onLoad
        this.resolutionHelper.onLoad(node);
        this.logicManager.onLoad(node);
        this.language.onLoad(node);
        this.netManager.onLoad(node);
        this.hallNetManager.onLoad(node);
        
        this.eventDispatcher.onLoad(node);
        this.uiManager.onLoad(node);
        this.localStorage.onLoad(node);
        this.assetManager.onLoad(node);
        this.cacheManager.onLoad(node);
        this.nodePoolManager.onLoad(node);
        this.uiLoading.onLoad(node);
        this.serviceManager.onLoad(node);
        this.alert.onLoad(node);
        this.loading.onLoad(node);
    }
    
    onDestroy(node:Node): void{
        this.resolutionHelper.onDestroy(node);
        this.logicManager.onDestroy(node);
        this.language.onDestroy(node);
        this.netManager.onDestroy(node);
        this.hallNetManager.onDestroy(node);
        
        this.eventDispatcher.onDestroy(node);
        this.uiManager.onDestroy(node);
        this.localStorage.onDestroy(node);
        this.assetManager.onDestroy(node);
        this.cacheManager.onDestroy(node);
        this.nodePoolManager.onDestroy(node);
        this.uiLoading.onDestroy(node);
        this.serviceManager.onDestroy(node);
        this.alert.onDestroy(node);
        this.loading.onDestroy(node);
    }
    
    /**@description 需要常驻资源的指定模拟UIView管理资源 */
    retainMemory: ViewDynamicLoadData = null!;

    /**@description 语言包 */
    language: ILanguage = null!;

    /**@description 事件派发器 */
    eventDispatcher: IEventDispatcher = null!;

    /**@description 界面管理器 */
    uiManager: IUIManager = null!;

    /**@description 本地储存仓库 */
    localStorage: ILocalStorage = null!;

    /**@description 资源管理器 */
    assetManager: IAssetManager = null!;

    /**@description 资源缓存管理器 */
    cacheManager: ICacheManager = null!;

    /**@description 屏幕适配 */
    resolutionHelper: IResolutionHelper = null!;

    /**@description 对象池管理器 */
    nodePoolManager: INodePoolManager = null!;

    /**@description 小提示 */
    tips: TipsDelegate = null!;

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    uiLoading: UILoadingDelegate = null!;

    /**@description websocket wss 证书url地址 */
    wssCacertUrl: string = "";

    /**@description 全局常驻网络组件管理器,注册到该管理器的网络组件会跟游戏的生命周期一致 */
    netManager: INetManager = null!;

    /**@description 大厅的网络控制器组件管理器，注册到该管理器的网络组件，除登录界面外，都会被移除掉*/
    hallNetManager: INetManager = null!;

    /**@description 网络Service管理器 */
    serviceManager: IServiceManager = null!;

    /**@description 逻辑控制器管理器 */
    logicManager: ILogicManager = null!;

    /**@description bundle管理器 */
    bundleManager: IBundleManager = null!;

    /**@description 弹出提示框,带一到两个按钮 */
    alert: IAlert = null!;

    /**@description 公共loading */
    loading: Iloading = null!;

    /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
    globalAudio: AudioComponent & IGlobalAudio = null!;

    /**@description 当前游戏GameView, GameView进入onLoad赋值 */
    gameView: UIView | null = null;

    /**@description 游戏数据 */
    gameData: IGameData | null = null;

    /**@description 游戏控制器，在自己的模块内写函数有类型化读取,此值在Logic.addNetComponent赋值
     * 控制器继承 Controller<ServiceType>
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
    makeLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE): (string | number)[] | string {
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

    /**
    * @description 获取语言包 
    * @param bundle 默认为BUNDLE_RESOURCES
    */
    getLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE | null): any {
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

export const Manager = new FramewokManager();
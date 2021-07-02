import AudioComponent from "../base/AudioComponent";
import { BUNDLE_TYPE } from "../base/Defines";
import TipsDelegate from "../ui/TipsDelegate";
import UILoadingDelegate from "../ui/UILoadingDelegate";
import UIView from "../ui/UIView";
import { IAlert } from "./IAlert";
import { IAssetManager } from "./IAssetManager";
import { IBundleManager } from "./IBundleManager";
import { ICacheManager } from "./ICacheManager";
import { IEventDispatcher } from "./IEventDispatcher";
import { IGameData } from "./IGameData";
import { IGlobalAudio } from "./IGlobalAudio";
import { ILanguage } from "./ILanguage";
import { Iloading } from "./Iloading";
import { ILocalStorage } from "./ILocalStorage";
import { ILogicManager } from "./ILogicManager";
import { INetManager } from "./INetManager";
import { INodePoolManager } from "./INodePoolManager";
import { IResolutionHelper } from "./IResolutionHelper";
import { IServiceManager } from "./IServiceManager";
import { IUIManager, ViewDynamicLoadData } from "./IUIManager";

export interface IManager {

    /**@description 需要常驻资源的指定模拟UIView管理资源 */
    readonly retainMemory: ViewDynamicLoadData;

    /**@description 语言包 */
    readonly language: ILanguage;

    /**@description 事件派发器 */
    readonly eventDispatcher: IEventDispatcher;

    /**@description 界面管理器 */
    readonly uiManager: IUIManager;

    /**@description 本地储存仓库 */
    readonly localStorage: ILocalStorage;

    /**@description 资源管理器 */
    readonly assetManager: IAssetManager;

    /**@description 资源缓存管理器 */
    readonly cacheManager: ICacheManager;

    /**@description 屏幕适配 */
    readonly resolutionHelper: IResolutionHelper;

    /**@description 对象池管理器 */
    readonly nodePoolManager: INodePoolManager;

    /**@description 小提示 */
    tips: TipsDelegate;

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    uiLoading: UILoadingDelegate;

    /**@description websocket wss 证书url地址 */
    wssCacertUrl: string;

    /**@description 全局常驻网络组件管理器,注册到该管理器的网络组件会跟游戏的生命周期一致 */
    netManager : INetManager;

    /**@description 大厅的网络控制器组件管理器，注册到该管理器的网络组件，除登录界面外，都会被移除掉*/
    hallNetManager : INetManager;

    /**@description 网络Service管理器 */
    serviceManager : IServiceManager;

    /**@description 逻辑控制器管理器 */
    logicManager : ILogicManager;

    /**@description bundle管理器 */
    bundleManager:IBundleManager;

    /**@description 弹出提示框,带一到两个按钮 */
    alert:IAlert;

    /**@description 公共loading */
    loading:Iloading;

    /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
    globalAudio : AudioComponent & IGlobalAudio;

    /**@description 当前游戏GameView, GameView进入onLoad赋值 */
    gameView : UIView | null;

    /**@description 游戏数据 */
    gameData: IGameData | null;

    /**@description 游戏控制器，在自己的模块内写函数有类型化读取,此值在Logic.addNetComponent赋值
     * 控制器继承 Controller<ServiceType>
     * @example 
     * export function netController() : TankBattleNetController{
     * return Manager.gameController;
     * }
     * 
     */
     gameController: any;
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
     makeLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE): (string | number)[] | string;

     /**
     * @description 获取语言包 
     * @param bundle 默认为BUNDLE_RESOURCES
     */
    getLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE | null): any;

}
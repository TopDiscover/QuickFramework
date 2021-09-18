import { EventDispatcher } from "./core/event/EventDispatcher";
import { UIManager } from "./core/ui/UIManager";
import { LocalStorage } from "./core/storage/LocalStorage";
import { _AssetManager } from "./core/asset/AssetManager";
import { CacheManager } from "./core/asset/CacheManager";
import { NodePoolManager } from "./core/nodePool/NodePoolManager";
import { HotupdateManager } from "./core/hotupdate/HotupdateManager";
import { NetManager } from "./core/net/service/NetManager";
import { BundleManager } from "./core/asset/BundleManager";
import { CocosExtentionInit } from "./plugin/CocosExtention";
import { Language } from "./core/language/Language";
import { Macro } from "./defines/Macros";
import { Adaptor } from "./core/adaptor/Adaptor";
import { ProtoManager } from "./core/net/service/ProtoManager";
import { EntryManager } from "./core/entry/EntryManager";
import { DataCenter } from "./data/DataCenter";
import { LogicManager } from "./core/logic/LogicManager";
import { LoggerImpl } from "./core/log/Logger";

/**@description 框架层使用的各管理器单例的管理 */
export class Framewok {

    /**@description 日志 */
    get logger(){
        return getSingleton(LoggerImpl);
    }

    /**@description 逻辑管理器 */
    get logicManager(){
        return getSingleton(LogicManager);
    }

    /**@description 数据中心 */
    get dataCenter(){
        return getSingleton(DataCenter);
    }

    /**@description 入口管理器 */
    get entryManager(){
        return getSingleton(EntryManager);
    }

    /**@description protobuf类型管理 */
    get protoManager(){
        return getSingleton(ProtoManager);
    }

    /**@description bundle管理器 */
    get bundleManager() {
        return getSingleton(BundleManager);
    }

    private _hallNetManager: NetManager = null!;
    /**@description 大厅的网络控制器组件管理器，注册到该管理器的网络组件，除登录界面外，都会被移除掉*/
    get hallNetManager() {
        if (!this._hallNetManager) {
            this._hallNetManager = new NetManager("hallNetManager");
        }
        return this._hallNetManager;
    }

    private _netManager: NetManager = null!;
    /**@description 全局常驻网络组件管理器,注册到该管理器的网络组件会跟游戏的生命周期一致 */
    get netManager() {
        if (!this._netManager) {
            this._netManager = new NetManager("netManager");
        }
        return this._netManager;
    }

    /**@description 热更新管理器 */
    get hotupdate() { return getSingleton(HotupdateManager) }

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
    get adaptor() {
        return getSingleton(Adaptor);
    }

    /**@description 对象池管理器 */
    get nodePoolManager() {
        return getSingleton(NodePoolManager);
    }

    /**@description 小提示 */
    get tips() : any{
        return null;
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading():any {
        return null;
    }

    /**@description websocket wss 证书url地址 */
    get wssCacertUrl() {
        return "";
    }

    /**@description 当前游戏GameView, GameView进入onLoad赋值 */
    gameView: GameView | null = null;

    getGameView<T extends GameView>(){
        return <T>this.gameView;
    }

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
    makeLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE = Macro.BUNDLE_RESOURCES): (string | number)[] | string {
        if (typeof param == "string") {
            if (bundle) {
                return `${Macro.USING_LAN_KEY}${bundle}.${param}`;
            }
            return `${Macro.USING_LAN_KEY}${param}`;
        }
        if (typeof param[0] == "string" && param instanceof Array) {
            if (bundle) {
                param[0] = `${Macro.USING_LAN_KEY}${bundle}.${param[0]}`;
            } else {
                param[0] = `${Macro.USING_LAN_KEY}${param[0]}`;
            }
        }
        return param;
    }

    /**
     * @description 获取语言包 
     * 
     */
    getLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE | null = null): any {
        let key = "";
        if (typeof param == "string") {
            if (bundle) {
                key = `${Macro.USING_LAN_KEY}${bundle}.${param}`;
            } else {
                key = `${Macro.USING_LAN_KEY}${param}`;
            }
            return this.language.get([key]);
        }
        if (typeof param[0] == "string" && param instanceof Array) {
            if (bundle) {
                param[0] = `${Macro.USING_LAN_KEY}${bundle}.${param[0]}`;
            } else {
                param[0] = `${Macro.USING_LAN_KEY}${param[0]}`;
            }
            return this.language.get(param);
        }
        Log.e(`传入参数有误`);
        return "";
    }

    init(){
        //适配
        this.adaptor.initBrowserAdaptor();
        //引擎扩展初始化
        CocosExtentionInit();
    }
}

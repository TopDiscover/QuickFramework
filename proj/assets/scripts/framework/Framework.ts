import { Dispatcher } from "./core/event/Dispatcher";
import { UIManager } from "./core/ui/UIManager";
import { LocalStorage } from "./core/storage/LocalStorage";
import { AssetManager } from "./core/asset/AssetManager";
import { CacheManager } from "./core/asset/CacheManager";
import { NodePoolManager } from "./core/nodePool/NodePoolManager";
import { UpdateManager } from "./core/update/UpdateManager";
import { BundleManager } from "./core/asset/BundleManager";
import { CocosExtentionInit } from "./plugin/CocosExtention";
import { Language } from "./core/language/Language";
import { Macro } from "./defines/Macros";
import { ProtoManager } from "./core/net/service/ProtoManager";
import { EntryManager } from "./core/entry/EntryManager";
import { DataCenter } from "./data/DataCenter";
import { LogicManager } from "./core/logic/LogicManager";
import { LoggerImpl } from "./core/log/Logger";
import NetHelper from "./core/net/service/NetHelper";
import { ServiceManager } from "./core/net/service/ServiceManager";
import { ReleaseManager } from "./core/asset/ReleaseManager";
import { HttpClient } from "./core/net/http/HttpClient";
import { Singleton } from "./utils/Singleton";
import { LayoutManager } from "./core/layout/LayoutManager";

/**@description 框架层使用的各管理器单例的管理 */
export class Framewok {

    /**@description 资源是否懒释放，true时，只有收到平台的内存警告才会释放资源，还有在更新时才分释放,否则不会释放资源 */
    get isLazyRelease(){
        return false;
    }

    /**@description 资源释放管理 */
    get releaseManger(){
        return Singleton.instance.get(ReleaseManager) as ReleaseManager;
    }

    /**@description 网络Service管理器 */
    get serviceManager() {
        return Singleton.instance.get(ServiceManager) as ServiceManager;
    }
    
    /**@description 网络辅助类 */
    get netHelper(){
        return Singleton.instance.get(NetHelper) as NetHelper;
    }

    /**@description 日志 */
    get logger(){
        return Singleton.instance.get(LoggerImpl) as LoggerImpl;
    }

    /**@description 逻辑管理器 */
    get logicManager(){
        return Singleton.instance.get(LogicManager) as LogicManager;
    }

    /**@description 数据中心 */
    get dataCenter(){
        return Singleton.instance.get(DataCenter) as DataCenter;
    }

    /**@description 入口管理器 */
    get entryManager(){
        return Singleton.instance.get(EntryManager) as EntryManager;
    }

    /**@description protobuf类型管理 */
    get protoManager(){
        return Singleton.instance.get(ProtoManager) as ProtoManager;
    }

    /**@description bundle管理器 */
    get bundleManager() {
        return Singleton.instance.get(BundleManager) as BundleManager;
    }

    /**@description 热更新管理器 */
    get updateManager() { 
        return Singleton.instance.get(UpdateManager) as UpdateManager;
    }

    /**@description 常驻资源指定的模拟view */
    get retainMemory() : any { 
        return this.uiManager.retainMemory; 
    }

    /**@description 语言包 */
    get language() {
        return Singleton.instance.get(Language) as Language;
    }

    /**@description 事件派发器 */
    get dispatcher() {
        return Singleton.instance.get(Dispatcher) as Dispatcher;
    }

    /**@description 界面管理器 */
    get uiManager() {
        return Singleton.instance.get(UIManager) as UIManager;
    }

    /**
     * @description 本地仓库 
     * @deprecated 该接口已经弃用，请用使用storage替换
     * */
    get localStorage() {
        return this.storage;
    }

    /**@description 本地仓库 */
    get storage() {
        return Singleton.instance.get(LocalStorage) as LocalStorage;
    }

    /**
     * @description 资源管理器 
     * @deprecated 该接口已经弃用，请用使用asset替换
     * */
    get assetManager() {
        return this.asset;
    }

    /**@description 资源管理器 */
    get asset() {
        return Singleton.instance.get(AssetManager) as AssetManager;
    }

    /**
     * @description 资源缓存管理器
     * @deprecated 该接口已经弃用，请用使用cache替换
     * */
    get cacheManager() {
        return this.cache;
    }

    /**@description 资源缓存管理器 */
    get cache() {
        return Singleton.instance.get(CacheManager) as CacheManager;
    }

    /**
     * @description 对象池管理器 
     * @deprecated 该接口已经弃用，请用使用pool替换
     * */
    get nodePoolManager() {
        return this.pool;
    }

    /**@description 对象池管理器 */
    get pool(){
        return Singleton.instance.get(NodePoolManager) as NodePoolManager;
    }

    get http(){
        return Singleton.instance.get(HttpClient) as HttpClient;
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

    get layout(){
        return Singleton.instance.get(LayoutManager) as LayoutManager;
    }

    /**@description 当前游戏GameView, GameView进入onLoad赋值 */
    gameView: GameView | null = null;

    getGameView<T extends GameView>(){
        return <T>this.gameView;
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
        if ( !bundle ){
            bundle = Macro.BUNDLE_RESOURCES;
        }
        let key = "";
        if (typeof param == "string") {
            key = `${Macro.USING_LAN_KEY}${bundle}.${param}`;
            return this.language.get([key]);
        }
        if (typeof param[0] == "string" && param instanceof Array) {
            param[0] = `${Macro.USING_LAN_KEY}${bundle}.${param[0]}`;
            return this.language.get(param);
        }
        Log.e(`传入参数有误`);
        return "";
    }

    init(){
        //引擎扩展初始化
        CocosExtentionInit();
    }

    onLowMemory(){
        this.releaseManger.onLowMemory();
    }
}

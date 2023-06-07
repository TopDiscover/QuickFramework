import { Dispatcher } from "./core/event/Dispatcher";
import { UIManager } from "./core/ui/UIManager";
import { LocalStorage } from "./core/storage/LocalStorage";
import { _AssetManager } from "./core/asset/AssetManager";
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
import { ServiceManager } from "./core/net/service/ServiceManager";
import { ReleaseManager } from "./core/asset/ReleaseManager";
import { HttpClient } from "./core/net/http/HttpClient";
import { Singleton } from "./utils/Singleton";
import { LayoutManager } from "./core/layout/LayoutManager";
import { SenderManager } from "./core/net/service/SenderManager";
import { HandlerManager } from "./core/net/service/HandlerManager";
import { Utils } from "./utils/Utils";
import { CanvasHelper } from "./utils/CanvasHelper";
import { Platform } from "./platform/Platform";

/**@description 框架层使用的各管理器单例的管理 */
export class Framewok {

    /**@description 资源是否懒释放，true时，只有收到平台的内存警告才会释放资源，还有在更新时才分释放,否则不会释放资源 */
    get isLazyRelease() {
        return false;
    }

    /**@description 资源释放管理 */
    get releaseManger() {
        return Singleton.get(ReleaseManager)!;
    }

    /**@description 网络Service管理器 */
    get serviceManager() {
        return Singleton.get(ServiceManager)!;
    }

    /**@description 网络消息发送管理器 */
    get senderManager() {
        return Singleton.get(SenderManager)!;
    }

    /**@description 网络消息处理管理器 */
    get handlerManager() {
        return Singleton.get(HandlerManager)!;
    }

    /**@description 日志 */
    get logger() {
        return Singleton.get(LoggerImpl)!;
    }

    /**@description 逻辑管理器 */
    get logicManager() {
        return Singleton.get(LogicManager)!;
    }

    /**@description 数据中心 */
    get dataCenter() {
        return Singleton.get(DataCenter)!;
    }

    /**@description 入口管理器 */
    get entryManager() {
        return Singleton.get(EntryManager)!;
    }

    get utils() {
        return Singleton.get(Utils)!;
    }

    /**@description protobuf类型管理 */
    get protoManager() {
        return Singleton.get(ProtoManager)!;
    }

    /**@description bundle管理器 */
    get bundleManager() {
        return Singleton.get(BundleManager)!;
    }

    /**@description 热更新管理器 */
    get updateManager() {
        return Singleton.get(UpdateManager)!;
    }

    /**@description 常驻资源指定的模拟view */
    get retainMemory(): any {
        return this.uiManager.retainMemory;
    }

    /**@description 语言包 */
    get language() {
        return Singleton.get(Language)!;
    }

    /**@description 事件派发器 */
    get dispatcher() {
        return Singleton.get(Dispatcher)!;
    }

    /**@description 界面管理器 */
    get uiManager() {
        return Singleton.get(UIManager)!;
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
        return Singleton.get(LocalStorage)!;
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
        return Singleton.get(_AssetManager)!;
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
        return Singleton.get(CacheManager)!;
    }

    /**
     * @description 对象池管理器 
     * @deprecated 该接口已经弃用，请用使用pool替换
     * */
    get nodePoolManager() {
        return this.pool;
    }

    /**@description 对象池管理器 */
    get pool() {
        return Singleton.get(NodePoolManager)!;
    }

    get http() {
        return Singleton.get(HttpClient)!;
    }

    /**@description 小提示 */
    get tips(): any {
        return null;
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading(): any {
        return null;
    }

    /**@description websocket wss 证书url地址 */
    get wssCacertUrl() {
        return "";
    }

    get layout() {
        return Singleton.get(LayoutManager)!;
    }

    get canvasHelper() {
        return Singleton.get(CanvasHelper)!;
    }

    /**
     * @description 区分平台相关处理
     */
    get platform() {
        return Singleton.get(Platform)!;
    }
    /**@description 当前游戏GameView, GameView进入onLoad赋值 */
    gameView: GameView | null = null;

    getGameView<T extends GameView>() {
        return <T>this.gameView;
    }

    /**
     * @description 获取语言包 
     * 
     */
    getLanguage<K extends string & keyof LanguageData["data"]>(key: K, params: (string | number)[] = [], bundle: BUNDLE_TYPE | null = null): LanguageData["data"][K] {
        if (!bundle) {
            bundle = Macro.BUNDLE_RESOURCES;
        }
        let configs: (string | number)[] = [];
        configs.push(`${Macro.USING_LAN_KEY}${bundle}.${key}`);
        configs.push(...params);
        return this.language.get(configs);
    }

    init() {
        //引擎扩展初始化
        CocosExtentionInit();
    }

    onLowMemory() {
        this.releaseManger.onLowMemory();
    }
}

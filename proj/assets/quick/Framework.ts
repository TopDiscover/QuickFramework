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
import { StageData } from "./data/StageData";
import { IAlert } from "./interface/IAlert";
import { ILoading } from "./interface/ILoading";
import { IUILoading } from "./interface/IUILoading";
import { ITips } from "./interface/ITips";
import { EntryImpl } from "./update/EntryImpl";
import AudioComponent from "./components/AudioComponent";

/**@description 框架层使用的各管理器单例的管理 */
export class Framewok implements GameEventInterface {

    /**@description 全局的默认值 是否允许缓存UI 资源,即 UIView 界面元素，需要开启 isLazyRelease 才有效  */
    get isCacheUI() {
        return true;
    }

    get Bundles() {
        return this.stageData.bundles;
    }

    /**@description 获取Stage数据 */
    get stageData() {
        return Singleton.get(StageData)!;
    }

    /**@description 是否采用全屏适配方案 */
    get isFullScreenAdaption() {
        return true;
    }

    /**@description 资源是否懒释放，true时，只有收到平台的内存警告才会释放资源，还有在更新时才分释放,否则不会释放资源 */
    get isLazyRelease() {
        if (!this.isAutoReleaseUnuseResources) {
            Log.w(`需要使用都自己导出cc.game.EVENT_LOW_MEMORY事件`);
        }
        return true;
    }

    /**@description 是否开启自动释放长时间未使用资源 */
    get isAutoReleaseUnuseResources() {
        return true;
    }

    /**@description 当isLazyRelease 为true时有效，当资源长时间未使用时自动释放 */
    get autoReleaseUnuseResourcesTimeout() {
        return 5 * 60;
        // return 10;
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
        return Singleton.get(AssetManager)!;
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

    protected _wssCacertUrl = "";
    /**@description websocket wss 证书url地址 */
    set wssCacertUrl(value) {
        this._wssCacertUrl = value;
    }
    get wssCacertUrl() {
        return this._wssCacertUrl;
    }

    /**@description 小提示 */
    get tips() {
        return Singleton.get(ITips)!;
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading() {
        return Singleton.get(IUILoading)!;
    }

    /**@description 弹出提示框,带一到两个按钮 */
    get alert() {
        return Singleton.get(IAlert)!;
    }

    /**@description 公共loading */
    get loading() {
        return Singleton.get(ILoading)!;
    }

    /**@description 更新专用 loading */
    get updateLoading() {
        return Singleton.get(ILoading)!;
    }

    /**@description 重连专用提示UI部分 */
    get uiReconnect() {
        return Singleton.get(ILoading)!;
    }

    private _gAudio: AudioComponent = null!;
    /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
    get gAudio() {
        if (this._gAudio) {
            return this._gAudio;
        }
        this._gAudio = this.uiManager.addComponent(AudioComponent);
        this._gAudio.isGlobal = true;
        return this._gAudio;
    }

    /**
     * @description 当前Bundle的音频组件
     */
    get audio(): AudioComponent {
        const where = this.stageData.where;
        if (where) {
            const root = this.uiManager.viewRoot;
            if (root) {
                for (const child of root.children) {
                    const view = child.getComponent("UIView") as UIView;
                    if (view && view.bundle == where) {
                        return view.audioHelper;
                    }
                }
            }
        }
        return null!;
    }

    /**
     * @description 获取语言 
     * @param key 语言key
     * @param params 语言参数
     * @returns 语言值
     * @example
     * ```ts
     * export let LANG = {
     *     language: "BR",
     *     data: {
     *         test: "测试语言包",
     *         mul : {
     *             test : "测试多语言",
     *             gggg : ["测试多语言嵌套"]
     *         }
     *     }
     * }
     * export default class TestData extends GameData<typeof LANG["data"]> {
     *     static module = "TestData";
     *     init(): void {
     *         this.getLanguage("test")
     *         this.getLanguage("mul.test")
     *         this.getLanguage("mul.gggg" as any)// 如何需要取出对象，key需要转换成any
     *     }
     * }
     * ```
     * */
    getLanguage<K extends DotNestedKeys<LanguageData>>(key: K, params: (string | number)[] = [], bundle: BUNDLE_TYPE | null = null): any {
        if (!bundle) {
            bundle = Macro.BUNDLE_RESOURCES;
        }
        let configs: (string | number)[] = [];
        configs.push(`${Macro.USING_LAN_KEY}${bundle}.${key}`);
        configs.push(...params);
        return this.language.get(configs);
    }

    init() {
        //初始化自定主entry代理
        this.entryManager.delegate = new EntryImpl();
        //引擎扩展初始化
        CocosExtentionInit();
    }

    onLowMemory() {
        this.releaseManger.onLowMemory();
    }

    onStart(node: cc.Node) {
    }

    onLoad(node: cc.Node) {
        //预先加载下loading预置体
        App.uiManager.onLoad(node);
        //Service onLoad
        App.serviceManager.onLoad();
        //入口管理器
        App.entryManager.onLoad(node);
        //释放管理器
        App.releaseManger.onLoad(node);
    }

    update(node: cc.Node) {
        //Service 网络调试
        App.serviceManager.update();

        //远程资源下载任务调度
        App.asset.remote.update();
    }

    onDestroy(node: cc.Node) {
        App.serviceManager.onDestroy();
        //入口管理器
        App.entryManager.onDestroy(node);
        //释放管理器
        App.releaseManger.onDestroy(node);
        //ui管理器
        App.uiManager.onDestroy(node);
    }

    /**@description 进入后台的时间 */
    protected _enterBackgroundTime = 0;

    onEnterBackground(): void {
        this._enterBackgroundTime = Date.timeNow();
        Log.d(`[MainController]`, `onEnterBackground ${this._enterBackgroundTime}`);
        App.gAudio.onEnterBackground();
        App.serviceManager.onEnterBackground();
    }
    onEnterForgeground(): void {
        let now = Date.timeNow();
        let inBackgroundTime = now - this._enterBackgroundTime;
        Log.d(`[MainController]`, `onEnterForgeground ${now} background total time : ${inBackgroundTime}`);
        App.gAudio.onEnterForgeground(inBackgroundTime);
        App.serviceManager.onEnterForgeground(inBackgroundTime);
    }

}

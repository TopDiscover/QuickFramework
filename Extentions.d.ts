/**
         * @description 发事件 参考framework/extentions/extentions dispatch 方法
         * @param name 
         * @param data 
         */
declare function dispatch(name: string, data?: any): void;

declare interface Date {
    /**
     * @description 格式当前时间 
     * @example 
     * let now = new Date();
     * let str = now.format("yyyy:MM:dd hh:mm:ss"); //2019:11:07 10:19:51
     * str = now.format("yyyy/MM/dd");//2019/11/07
     * str = now.format("hh:mm:ss");//10:19:51
     * */
    format(format: string): string;
}

declare interface DateConstructor {
    /**
     * @description 返回当前时间的秒数
     * @example 
     * Date.timeNow()
     *  */
    timeNow(): number;
    /**
     * @description 返回当前时间的毫秒数 
     * @example 
     * Date.timeNowMillisecons()
     * */
    timeNowMillisecons(): number;
}

declare interface StringConstructor {
    /**
     * @description 格式化字符串
     * @example
     * String.format("{0}-->{1}-->{2}","one","two","three") | String.format("{0}-->{1}-->{2}",["one","two","three"])
     * => "one-->two-->three"
     * */
    format(...args: any[]): string;
}

declare function md5(data: any): any;

/**@description 调试 */
declare function log(...args: any[]): void;
declare function error(...args: any[]): void;
declare function warn(...args: any[]): void;
/**
 * @description 界面当前value的值信息
 * @param value 值 
 * @param name 名字
 * @param level 打印对象深度，不传入，如果有对象嵌套对象，默认只打印10层
 */
declare function dump(value: any, name?: string, level?: number): void;

declare type BUNDLE_TYPE = string | import("cc").AssetManager.Bundle;

declare type WebSocketType = "ws" | "wss";

declare interface Singleton<T> {
    new(): T;
    /**
     *@description 单例统一实现 
     */
    Instance(): T;
}

/**@description 获取根据类型获取单列 */
declare function getSingleton<T>(SingletonClass: Singleton<T>): T;

declare interface LanguageData {
    language: string;
}

/**
 * @description 数据代理
 * 如果是公共总合，name使用 COMMON_LANGUAGE_NAME
 */
declare interface LanguageDataSourceDelegate {
    name: string;
    data(language: string): LanguageData;
}

/**@description 提示代理 */
declare interface Tips {
    /**
     * @description tips提示
     * @param msg 提示内容
     */
    show(msg: string): void;
    /**@description 预加载预置体 */
    preloadPrefab(): void;
    finishShowItem(node: import("cc").Node): void;
}

/**@description 界面加载动画，web端在下载界面时，如果超过了一定时间，需要弹出动画，告诉用户当前加载界面的进度 */
declare interface UILoading {
    /**
     * @description 显示全屏幕加载动画
     * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
     */
    show(delay: number, name: string): void;
    /**
     * @description 更新进度，0-100
     * @param progress 0-100
     */
    updateProgress(progress: number): void;
    hide(): void;
    /**@description 预加载预置体 */
    preloadPrefab(): void;
}

declare interface IFullScreenAdapt {
    /**@description 全屏幕适配 调用 */
    onFullScreenAdapt(): void;
}

/**@description 提示弹出框配置 */
declare interface AlertConfig {
    /**@description 用来标识弹出框，后面可指定tag进行关闭所有相同tag的弹出框 */
    tag?: string | number,
    /**@description 提示内容 richText只能二先1 */
    text?: string,
    /**@description 标题,默认为 : 温馨提示 */
    title?: string,
    /**@description 确定按钮文字 默认为 : 确定*/
    confirmString?: string,
    /**@description 取消按钮文字 默认为 : 取消*/
    cancelString?: string,
    /**@description 确定按钮回调 有回调则显示按钮，无回调则不显示*/
    confirmCb?: (isOK: boolean) => void,
    /**@description 取消按钮回调 有回调则显示按钮，无回调则不显示*/
    cancelCb?: (isOK: boolean) => void,
    /**@description 富文件显示内容 跟text只能二选1 */
    richText?: string,
    /**@description true 回调后在关闭弹出 false 关闭弹出框在回调 默认为 : false */
    immediatelyCallback?: boolean,
    /**@description 是否允许该tag的弹出框重复弹出，默认为true 会弹出同类型的多个 */
    isRepeat?: boolean,
    /**@description 用户自定义数据 */
    userData?: any,
}

/**
 * @description 处理游戏事件接口声明
 *      cc.game.EVENT_ENGINE_INITED
        cc.game.EVENT_GAME_INITED
        cc.game.EVENT_HIDE
        cc.game.EVENT_RESTART
        cc.game.EVENT_SHOW
 */

declare interface GameEventInterface {

    /**@description 进入后台 cc.game.EVENT_HIDE*/
    onEnterBackground(): void;

    /**
     * @description 进入前台 cc.game.EVENT_SHOW
     * @param inBackgroundTime 在后台运行的总时间，单位秒
     */
    onEnterForgeground(inBackgroundTime: number): void;
}

declare namespace td {
    export class EventComponent extends import("cc").Component {
        /**
          * @description 注册网络事件 ，在onLoad中注册，在onDestroy自动移除
          * @param manCmd 
          * @param subCmd 
          * @param func 处理函数
          * @param handleType 消息解析类型
          * @param isQueue 是否加入队列
          */
        registerEvent(manCmd: number, subCmd: number, func: (data: any) => void, handleType?: any, isQueue?: boolean): void;
        /**
         * 注册事件 ，在onLoad中注册，在onDestroy自动移除
         * @param eventName 
         * @param func 
         */
        registerEvent(eventName: string, func: (data: any) => void): void;
        /**
          * @description 注册网络事件 ，在onLoad中注册，在onDestroy自动移除
          * @param manCmd 
          * @param subCmd 
          * @param func 处理函数
          * @param handleType 消息解析类型 如果不注册类型，返回的是服务器未进行解析的源数据，需要自己进行解包处理
          * @param isQueue 是否加入队列
          */
        addEvent(manCmd: number, subCmd: number, func: (data: any) => void, handleType?: any, isQueue?: boolean): void;
        /**
         * 注册事件 ，在onLoad中注册，在onDestroy自动移除
         * @param eventName 
         * @param func 
         */
        addEvent(eventName: string, func: (data: any) => void): void;
        /**
          * @description 删除注册网络事件
          * @param manCmd 主cmd
          * @param subCmd 子cmd
          */
        removeEvent(manCmd: number, subCmd: number): void;
        /**
         * @description 删除普通事件
         * @param eventName 事件名
         */
        removeEvent(eventName: string): void;
        // protected bindingEvents(): void;
        onLoad(): void;
        onDestroy(): void;
    }

    export class AudioComponent extends EventComponent {
        /**@description 音频控件资源拥有者，该对象由UIManager打开的界面 */
        owner: UIView | null;
        /**@description 背景音乐音量 */
        musicVolume: number;
        /**@description 音效音量 */
        effectVolume: number;
        /**@description 音效开关 */
        isEffectOn: boolean;
        /**@description 背景音乐开关 */
        isMusicOn: boolean;
        /**@description 停止 */
        stopEffect(url: string, bundle: BUNDLE_TYPE):void;
        stopAllEffects():void;
        stopMusic():void;
        playMusic(url: string, bundle: BUNDLE_TYPE, loop?: boolean): Promise<boolean>;
        playEffect(url: string, bundle: BUNDLE_TYPE, loop?: boolean): Promise<boolean>;
        onEnterBackground(): void;
        onEnterForgeground(inBackgroundTime: number): void;
        onDestroy():void;
    }

    export class UIView extends EventComponent implements IFullScreenAdapt {
        static getPrefabUrl(): string;
        /**@description 全屏幕适配 调用 */
        onFullScreenAdapt(): void;
        /**@description 当前传入参数，即通过UI管理器打开时的传入参数 */
        get args(): any[] | undefined;
        /**指向当前View打开时的bundle */
        bundle: BUNDLE_TYPE;
        close(): void;
        /**@description args为open代入的参数 */
        show(args: any[]): void;
        hide(): void;
        /**@description 动画显示界面 
          *@param isOverrideShow 是否是重写show调用的,如果是重写show调用了,必将此参数设置为true,否则会产生死循环递归调用 
          *@param completeCallback 完成回调
          *@example 
          *  示例： 通常在init/onLoad函数中调用 showWithAction,
          *  但如果需要界面通过hide隐藏，而不是关闭界面时，下一次显示时
          *  管理器直接调用了show,没有执行界面的打开动画，如果还需要界面打开动画
          *  需要按如下方式重写show方法
          *  show( args : any[] ){
          *      super.show(args);
          *      this.showWithAction(true);
          *      //to do => 
          *  }
          */
        showWithAction(isOverrideShow?: boolean, completeCallback?: () => void): void;
        /**@description 动画隐藏界面 
          *@param isOverrideHide 是否是重写hide调用的,如果是重写hide调用了,必将此参数设置为true,否则会产生死循环递归调用 
          *@param completeCallback 完成回调
          */
        hideWithAction(completeCallback?: () => void): void;
        /**@description 动画关闭界面 
          *@param completeCallback 完成回调
          */
        closeWithAction(completeCallback?: () => void): void;
        /**
          * @description 启用物理返回键按钮
          * @param isEnabled true 启用，
          * @example 重写onKeyBack方法
          */
        setEnabledKeyBack(isEnabled: boolean): void;
        isEnabledKeyBack(): boolean;
        onKeyUp(ev: import("cc").EventKeyboard): void;
        onKeyBack(ev: import("cc").EventKeyboard): void;
        audioHelper: AudioComponent;
        enableFrontAndBackgroundSwitch: boolean;
        onEnterForgeground(inBackgroundTime: number): void;
        onEnterBackground(): void;
    }

    export class Language {
        /**@description 添加数据代理 */
        addSourceDelegate(delegate: LanguageDataSourceDelegate): void;
        /**@description 删除数据代理 */
        removeSourceDelegate(delegate: LanguageDataSourceDelegate): void;
        /**
           * @description 改变语言包
           * @param language 语言包类型
           */
        change(language: string): void;
        get(args: (string | number)[]): any;
        /**@description 获取语言包名 */
        getLanguage(): string;
    }
    export class EventDispatcher {
        /**
           * @description 添加事件
           * @param type 事件类型
           * @param callback 事件回调
           * @param target target
           */
        addEventListener(type: string, callback: ((data: any) => void) | string, target: any): void;
        /**
           * @description 移除事件
           * @param type 事件类型
           * @param target 
           */
        removeEventListener(type: string, target: any): void;
        /**
           * @description 派发事件
           * @param type 事件类型
           * @param data 事件数据
           */
        dispatchEvent(type: string, data?: any): void;
    }

    export class ViewDynamicLoadData {
        name: string;
        constructor(name?: string);
        /**@description 添加动态加载的本地资源 */
        addLocal(info: ResourceInfo, className?: string): void;
        /**@description 添加动态加载的远程资源 */
        addRemote(info: ResourceInfo, className?: string): void;
        /**@description 清除远程加载资源 */
        clear(): void;
    }

    export interface UIClass<T extends UIView> {
        new(): T;
        /**
         *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer 
         */
        getPrefabUrl(): string;
    }

    export class UIManager {
        /**@description 无主资源 */
        garbage: ViewDynamicLoadData;
        /**@description 驻留内存资源 */
        retainMemory: ViewDynamicLoadData;

        preload<T extends UIView>(uiClass: UIClass<T>, bundle: BUNDLE_TYPE): Promise<T>
        /**
         * @description open<T extends UIView>(config: { type: UIClass<T>, zIndex?: number, args?: any[] , delay?: number}) : Promise<T>
         * @param config 配置信息 
         * @param config.type UIView
         * @param config.zIndex 节点层级，默认为0
         * @param config.args 传入的参数列表
         * @param config.delay 
         * delay > 0 时间未加载界面完成显示加载动画，
         * delay = 0 则不显示加载动画，但仍然会显示UILoading,在加载界面时阻挡玩家的触摸事件
         * delay 其它情况以UILoading的默认显示时间为准
         * @param config.name 界面名字，如 商城 首充
         * @example 示例
         * Manager.uiManager.open({type:GameLayer});
         * Manager.uiManager.open({type:GameLayer,delay:ViewDelay.delay});
         * Manager.uiManager.open({type:GameLayer,delay:ViewDelay.delay,zIndex:ViewZOrder.zero});
         * Manager.uiManager.open({type:GameLayer,delay:ViewDelay.delay,zIndex:ViewZOrder.zero,args:["aa","bb"]});
         * 
         * @description 弃用接口 open<T extends UIView>(uiClass: UIClass<T>, zIndex?: number, ...args: any[]): Promise<T>
         * @param uiClass UIView
         * @param zIndex 节点层级 
         * @param args 传入参数列表
         */
        open<T extends UIView>(config: { type: UIClass<T>, bundle?: BUNDLE_TYPE, zIndex?: number, args?: any[], delay?: number, name?: string }): Promise<T>;
        getCanvas(): import("cc").Node;
        addChild(node: import("cc").Node, zOrder: number, adpater?: IFullScreenAdapt): void;
        /**@description 添加动态加载的本地资源 */
        addLocal(info: ResourceInfo, className: string): void;
        /**@description 添加动态加载的远程资源 */
        addRemote(info: ResourceInfo, className: string): void;
        close<T extends UIView>(uiClass: UIClass<T>): void;
        close(className: string): void;
        /**@description 关闭除传入参数以外的所有其它界面,不传入，关闭所有界面 */
        closeExcept(views: (UIClass<UIView> | string | UIView)[]): void;
        hide(className: string): void;
        hide<T extends UIView>(uiClass: UIClass<T>): void;
        getView(className: string): Promise<any>;
        getView<T extends UIView>(uiClass: UIClass<T>): Promise<T>;
        checkView(url: string, className: string|null): void;
        isShow(className: string): boolean;
        isShow<T extends UIView>(uiClass: UIClass<T>): boolean;
        fullScreenAdapt(): void;
        /*获取当前canvas的组件 */
        getCanvasComponent(): import("cc").Component;
        addComponent<T extends import("cc").Component>(type: { new(): T }): T;
        addComponent(className: string): any;
        removeComponent(component: string | import("cc").Component): void;
        printViews(): void;
        printCanvasChildren(): void;
        printComponent(): void;
    }
    export class LocalStorage {
        key: string;
        getItem(key: string, defaultValue?: any): any;
        setItem(key: string, value: string | number | boolean | object): void;
        removeItem(key: string): void;
    }

    export class RemoteLoader {
        loadImage(url: string, isNeedCache: boolean): Promise<import("cc").SpriteFrame>;
        loadSkeleton(path: string, name: string, isNeedCache: boolean): Promise<import("cc").sp.SkeletonData>;
        /**@description 由主游戏控制器驱动，在下载远程资源时，设置一个上限下载任务数据，以免同一时间任务数量过大 */
        update(): void;
    }
    export class AssetManager {
        get remote(): RemoteLoader;
        getBundleName( bundle : BUNDLE_TYPE ) : string | null;
        getBundle(bundle: BUNDLE_TYPE): import("cc").AssetManager.Bundle;
        /**@description 加载bundle */
        loadBundle(nameOrUrl: string, onComplete: (err: Error, bundle: import("cc").AssetManager.Bundle) => void): void;
        /**@description 移除bundle */
        removeBundle(bundle: BUNDLE_TYPE): void;
        load(
            bundle: BUNDLE_TYPE,
            path: string,
            type: typeof import("cc").Asset,
            onProgress: (finish: number, total: number, item: import("cc").AssetManager.RequestItem) => void,
            onComplete: (data: ResourceCacheData) => void): void;
        loadDir(
            bundle: BUNDLE_TYPE,
            path: string,
            type: typeof import("cc").Asset,
            onProgress: (finish: number, total: number, item: import("cc").AssetManager.RequestItem) => void,
            onComplete: (data: ResourceCacheData) => void): void;
        /**
         * @description 释放资源
         * @param info 资源信息
         */
        releaseAsset(info: ResourceInfo): void;
        /**
         * @description 资源引用计数加1
         * @param info 资源信息
         */
        retainAsset(info: ResourceInfo): void;
        /**
         * @description 添加常驻资源
         * @param url 
         * @param data 
         * @param bundle 
         */
        addPersistAsset(url: string, data: import("cc").Asset, bundle: BUNDLE_TYPE): void;
    }
    /**
       * @description 资源加载缓存数据 
       */
    export enum ResourceCacheStatus {
        /**@description 无状态 */
        NONE = 0,
        /**@description 等待释放 */
        WAITTING_FOR_RELEASE = 1,
    }

    /**@description 资源类型 */
    export enum ResourceType {
        /**@description 本地 */
        Local = 0,
        /**@description 远程资源 */
        Remote = 1,
    }

    /**@description 资源信息 */
    export class ResourceInfo {
        url: string;
        type: typeof import("cc").Asset;
        data: import("cc").Asset | import("cc").Asset[];
        /**@description 是否常驻内存，远程加载资源有效 */
        retain: boolean;
        bundle: BUNDLE_TYPE;
        /**@description 默认为本地资源 */
        resourceType: ResourceType;
    }
    export class ResourceCacheData {
        /**@description 是否已经加载完成 */
        isLoaded: boolean;
        /**@description 加载完成数据 
         * cc.Prefab 
         * cc.SpriteAtlas 
         * cc.SpriteFrame 
         * cc.AudioClip 
         * cc.Font 
         * sp.SkeletonData 
         * cc.ParticleAsset 
         * cc.Texture2D
         * cc.JsonAsset
         * */
        data: import("cc").Asset | import("cc").Asset[] | null;

        info: ResourceInfo;

        status: ResourceCacheStatus;

        /**@description 在加载过程中有地方获取,加载完成后再回调 */
        getCb: ((data: any) => void)[];

        /**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
        finishCb: ((data: any) => void)[];

        public doGet(data: any): void;

        public doFinish(data: any): void;

        public get isInvalid(): boolean;
    }
    export class RemoteCaches {
        /**
         * @description 获取远程缓存数据
         * @param type 远程奖状类型
         * @param url 远程地址
         */
        public get(url: string): ResourceCacheData;
        public getSpriteFrame(url: string): ResourceCacheData;
        public setSpriteFrame(url: string, data: any): import("cc").SpriteFrame;
        set(url: string, data: ResourceCacheData): void;
        retainAsset(info: ResourceInfo): void;
        releaseAsset(info: ResourceInfo): void;
        remove(url: string): void;
        showCaches(): void;
    }
    export class CacheManager {
        /**@description 远程资源缓存管理器 */
        public get remoteCaches(): RemoteCaches;
        getBundleName(bundle: BUNDLE_TYPE): string;
        get(bundle: BUNDLE_TYPE, path: string, isCheck?: boolean): ResourceCacheData;
        set(bundle: BUNDLE_TYPE, path: string, data: ResourceCacheData): void;
        /**
         * @description 
         * @param bundle bundle
         * @param path path
         */
        remove(bundle: BUNDLE_TYPE, path: string): boolean;
        removeWithInfo(info: ResourceInfo): boolean;
        removeBundle(bundle: BUNDLE_TYPE): void;
        /**
          * @description 如果资源正在加载中，会等待资源加载完成后返回，否则直接返回null
          * @param url 
          * @param type 资源类型
          * @param bundle
          */
        getCache<T extends import("cc").Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<T>;
        /**
          * @description 异步获取资源，如果资源未加载，会加载完成后返回
          * @param url 
          * @param type 
          * @param bundle 
          */
        getCacheByAsync<T extends import("cc").Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<T>;
        getSpriteFrameByAsync(urls: string[], key: string, view: UIView, addExtraLoadResource: (view: UIView, info: ResourceInfo) => void, bundle: BUNDLE_TYPE): Promise<{
            url: string;
            spriteFrame: import("cc").SpriteFrame;
            isTryReload?: boolean;
        }>;
        /**@description 打印当前缓存资源 */
        printCaches(): void;
    }
    export class ResolutionHelper {
        isShowKeyboard: boolean;
        /**@description 全屏适配 */
        public fullScreenAdapt(node: import("cc").Node, adapter?: IFullScreenAdapt): void;
        /**@description 是否需要做适配操作，当分辨率发生变化，只要ScreenAdaptType 不是None的情况 */
        public get isNeedAdapt(): boolean;
        public onLoad(node: import("cc").Node): void;
        public onDestroy(): void;
        /**@description 浏览器适配初始化 */
        public initBrowserAdaptor(): void;
        get isBrowser(): boolean;
    }
    export class NodePool {
        constructor(name: string);
        name: string;
        /**
           * @description 用来克隆的节点，在get时，如果发现对象池中不存在，会直接用此节点进行克隆
           * 注意，设置的克隆对象会从父节点移除，但不会进行cleanup操作
           * 在clear时，对该克隆节点进行释放操作
           * */
        cloneNode: import("cc").Node|null;
        /**@description 当前对象池数据大小 */
        get size(): number;
        /**@description 销毁对象池中缓存的所有节点 */
        clear(): void;
        /**
           * @description 向缓冲池中存入一个不需要的节点对象
           * 这个函数会自动将目标节点从父节点移除，但不会进行 cleanup 操作
           * 
           */
        put(obj: import("cc").Node): void;
        /**
           * @description 从对象池中取缓冲节点
           * */
        get(): import("cc").Node|null;
    }
    /**
       * 对象池管理器
       */
    export class NodePoolManager {
        /**
           * @description 创建对象池
           * @param type 对象池类型
           */
        createPool(type: string): NodePool|null;
        /**
           * @description 删除对象池 
           * @param type 对象池类型
           * */
        deletePool(type: string | NodePool|null): void;
        /**
           * @description 获取对象池
           * @param type 对象池类型 
           * @param isCreate 当找不到该对象池时，会默认创建一个对象池
           * */
        getPool(type: string, isCreate?: boolean): NodePool|null;
    }

    export class Alert {
        preloadPrefab(): void;
        show(config: AlertConfig): boolean;
        /**
        * @description 关闭当前显示的 
        * @param tag 可不传，关闭当前的弹出框，否则关闭指定tag的弹出框
        */
        close(tag?: string | number): void;
        /**@description 当前显示的弹出框是否是tag */
        isCurrentShow(tag: string | number): boolean;
        /**@description 获取当前显示弹出的配置 */
        currentShow(tag?: string | number): AlertConfig;
        /**@description 是否有该类型的弹出框 */
        isRepeat(tag: string | number): boolean;
        closeAll(): void;
        finishAlert(): void;
    }

    export class Loading {
        /**@description 显示超时回调 */
        timeOutCb: () => void;
        preloadPrefab(): void;
        /**
          * @description 显示Loading
          * @param content 提示内容
          * @param timeOutCb 超时回调
          * @param timeout 显示超时时间
          */
        show(content: string | string[], timeOutCb?: () => void, timeout?: number): this;
        hide(): void;
    }

    export class LogicManager {
        push(logicType: any): void;
        onLoad(node: import("cc").Node): void;
        onDestroy(node: import("cc").Node): void;
    }

    /**@description 游戏内数据的公共基类 */
    export class GameData {

        /**@description 当前的asset bundle name */
        get bundle(): string;

        /**@description 清除数据 */
        clear(): void;

        /**@description 游戏类型 */
        gameType(): number;
    }

    export class GameView extends UIView {

    }

    export class GlobalAudio extends AudioComponent {
        playDialogOpen(): void;
        playButtonClick(): void;
    }

    export class BundleConfig {
        /**@description Bundle名 如:hall*/
        bundle: string;
        /**@description Bundle名 如:大厅  */
        name: string;
        index: number;
        /**@description 加载bundle完成后，发出的bundle事件 */
        event: string;
        /**@description 是否需要提示弹出框提示升级 */
        isNeedPrompt: boolean;
        /**
         * 
         * @param name bundle名 如：大厅
         * @param bundle Bundle名 如:hall
         * @param index 游戏index,可根据自己需要决定需不需要
         * @param event 加载bundle完成后，派发事件
         * @param isNeedPrompt 是否需要弹出提示升级的弹出框
         */
        constructor(name: string, bundle: string, index: number, event?: string, isNeedPrompt?: boolean);
    }

    export class BundleManager {
        /**@description 删除已经加载的bundle */
        removeLoadedBundle(): void;
        /**@description 删除所有加载子游戏的bundle */
        removeLoadedGamesBundle(): void;
        /**
        * 外部接口 进入Bundle
        * @param config 配置
        */
        enterBundle(config: BundleConfig): void;
    }

    export class Reconnect {
        static preloadPrefab(): void;
        /**@description 是否启用 */
        enabled: boolean;
        constructor(service: CommonService);
        show(content?: string): void;
        hide(): void;
        hideNode(): void;
        showNode(content: string): void;
    }

    export class CommonService implements GameEventInterface {
        /**@description 进入后台 cc.game.EVENT_HIDE*/
        onEnterBackground(): void;

        /**
         * @description 进入前台 cc.game.EVENT_SHOW
         * @param inBackgroundTime 在后台运行的总时间，单位秒
         */
        onEnterForgeground(inBackgroundTime: number): void;
        /**@description 进入后台的最大允许时间，超过了最大值，则进入网络重连 */
        maxEnterBackgroundTime: number;
        /**
        * @description 连接网络
        */
        connect(): void;
        /**@description 网络重连 */
        reconnect: Reconnect;
    }

    export class ServiceManager implements GameEventInterface {
        /**
          * @description 如果自己项目有多个网络Service，
          * 可直接在这里添加，由ServiceManager统一处理 
          * */
        onLoad(): void;
        /**@description 网络事件调度 */
        update(): void;
        /**@description 主场景销毁,关闭所有连接 */
        onDestroy(): void;
        /**@description 关闭当前所有连接 */
        close(): void;
        /**@description 尝试重连 */
        tryReconnect(service: CommonService, isShowTips?: boolean): void;
        /**@description 重连成功 */
        onReconnectSuccess(service: CommonService): void;
        /**@description 进入后台 cc.game.EVENT_HIDE*/
        onEnterBackground(): void;

        /**
         * @description 进入前台 cc.game.EVENT_SHOW
         * @param inBackgroundTime 在后台运行的总时间，单位秒
         */
        onEnterForgeground(inBackgroundTime: number): void;
    }

    export class NetManager {
        constructor(name: string);
        onLoad(node: import("cc").Node): void;
        onDestroy(node: import("cc").Node): void;
        /**@description 网络控制器注册 Controller<T>的子类 */
        register(controllerType: any): void;
        /**@description 添加网络控制组件 */
        addNetControllers(): void;
        /**@description 移除网络控制组件 */
        removeNetControllers(): void;
    }

    export class FramewokManager {
        /**@description 常驻资源指定的模拟view */
        readonly retainMemory: ViewDynamicLoadData;
        /**@description 语言包 */
        readonly language: Language;
        /**@description 事件派发器 */
        readonly eventDispatcher: EventDispatcher;
        /**@description 界面管理器 */
        readonly uiManager: UIManager;
        /**@description 本地仓库 */
        readonly localStorage: LocalStorage;
        /**@description 资源管理器 */
        readonly assetManager: AssetManager;
        /**@description 资源缓存管理器 */
        readonly cacheManager: CacheManager;
        /**@description 屏幕适配 */
        readonly resolutionHelper: ResolutionHelper;
        /**@description 对象池管理器 */
        readonly nodePoolManager: NodePoolManager;
        /**@description 小提示 */
        readonly tips: Tips;
        /**@description 界面加载时的全屏Loading,显示加载进度 */
        readonly uiLoading: UILoading;
        /**@description websocket wss 证书url地址 */
        wssCacertUrl: string;
        /**@description 全局常驻网络组件管理器,注册到该管理器的网络组件会跟游戏的生命周期一致 */
        readonly netManager: NetManager;
        /**@description 大厅的网络控制器组件管理器，注册到该管理器的网络组件，除登录界面外，都会被移除掉*/
        readonly hallNetManager: NetManager;
        /**@description 网络Service管理器 */
        readonly serviceManager: ServiceManager;
        /**@description 逻辑控制器管理器 */
        readonly logicManager: LogicManager;
        /**@description bundle管理器 */
        readonly bundleManager: BundleManager;
        /**@description 弹出提示框,带一到两个按钮 */
        readonly alert: Alert;
        /**@description 公共loading */
        readonly loading: Loading;
        /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
        readonly globalAudio: GlobalAudio;
        /**@description 当前游戏GameView, GameView进入onLoad赋值 */
        gameView: GameView|null;
        /**@description 游戏数据 */
        gameData: GameData|null;
        /**
         * @description 游戏控制器，在自己的模块内写函数有类型化读取,此值在Logic.addNetComponent赋值
         * @example 
         * export function netController() : TankBattleNetController{
         * return Manager.gameController;
         * }
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
        makeLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE): (string | number)[] | string;
        /**
         * @description 获取语言包 
         */
        getLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE | null): any
    }
}

declare let Manager: td.FramewokManager;

import { Component, Node } from "cc";
import { DEBUG } from "cc/env";
import { BUNDLE_TYPE, ResourceInfo, ViewStatus } from "../base/Defines";
import { Manager } from "../Framework";
import { IFullScreenAdapt } from "../ui/IFullScreenAdapter";
import UIView, { UIClass } from "../ui/UIView";
import { ISingleManager } from "./ISingleManager";
/**@description 动态加载垃圾数据名 */
export const DYNAMIC_LOAD_GARBAGE = "DYNAMIC_LOAD_GARBAGE";
/**@description 动画加载全局数据名 */
export const DYNAMIC_LOAD_RETAIN_MEMORY = "DYNAMIC_LOAD_RETAIN_MEMORY";
export class ViewDynamicLoadData {
    private local = new Map<string, ResourceInfo>();
    private remote = new Map<string, ResourceInfo>();
    public name: string | null;

    constructor(name: string | null = null) {
        this.name = name;
    }

    /**@description 添加动态加载的本地资源 */
    public addLocal(info: ResourceInfo, className: string | null = null) {
        if (info && info.url) {
            if (this.name == DYNAMIC_LOAD_GARBAGE) {
                error(`找不到资源持有者: ${info.url}`);
            }
            if (DEBUG) Manager.uiManager.checkView(info.url, className);
            if (!this.local.has(info.url)) {
                Manager.assetManager.retainAsset(info);
                this.local.set(info.url, info);
            }
        }
    }

    /**@description 添加动态加载的远程资源 */
    public addRemote(info: ResourceInfo, className: string | null = null) {
        if (info && info.data && !this.remote.has(info.url)) {
            if (this.name == DYNAMIC_LOAD_GARBAGE) {
                error(`找不到资源持有者 : ${info.url}`);
            }
            if (DEBUG) Manager.uiManager.checkView(info.url, className);
            Manager.cacheManager.remoteCaches.retainAsset(info);
            this.remote.set(info.url, info);
        }
    }

    /**@description 清除远程加载资源 */
    public clear() {
        if (this.name == DYNAMIC_LOAD_GARBAGE) {
            //先输出
            let isShow = this.local.size > 0 || this.remote.size > 0;
            if (isShow) {
                error(`当前未能释放资源如下:`);
            }
            if (this.local && this.local.size > 0) {
                error("-----------local-----------");
                if (this.local) {
                    this.local.forEach((info) => {
                        error(info.url);
                    });
                }
            }
            if (this.remote && this.remote.size > 0) {
                error("-----------remote-----------");
                if (this.remote) {
                    this.remote.forEach((info, url) => {
                        error(info.url);
                    });
                }
            }

        } else {
            //先清除当前资源的引用关系
            if (this.local) {
                this.local.forEach((info) => {
                    Manager.assetManager.releaseAsset(info);
                });
                this.local.clear();
            }
            if (this.remote) {
                this.remote.forEach((info, url) => {
                    Manager.cacheManager.remoteCaches.releaseAsset(info);
                });
                this.remote.clear();
            }
        }

    }
}

/**@description 界面数据，这里需要处理一个问题，当一个界面打开，收到另一个人的关闭，此时如果界面未加载完成
 * 可能导致另一个人关闭无效，等界面加载完成后，又显示出来
 */
export class ViewData {
    /**@description 界面是否已经加载 */
    isLoaded: boolean = false;
    /**@description 界面当前等待操作状态 */
    status: ViewStatus = ViewStatus.WAITTING_NONE;
    /**@description 实际显示界面 */
    view: UIView = null!;
    /**@description 等待加载完成回调 */
    finishCb: ((view: any) => void)[] = [];
    /**@description 等待获取界面回调 */
    getViewCb: ((view: any) => void)[] = [];
    /**是否预加载,不显示出来，但会加到当前场景上 */
    isPreload: boolean = false;
    /**@description 资源信息 */
    info: ResourceInfo = null!;

    /**@description 界面动态加载的数据 */
    loadData: ViewDynamicLoadData = new ViewDynamicLoadData();

    node: Node = null!;

    private doGet(view: UIView | null, className: string, msg: string) {
        for (let i = 0; i < this.getViewCb.length; i++) {
            let cb = this.getViewCb[i];
            if (cb) {
                cb(view);
                if (DEBUG) warn(`ViewData do get view : ${className} msg : ${msg}`);
            }
        }

        this.getViewCb = [];
    }

    private doFinish(view: UIView | null, className: string, msg: string) {
        for (let i = 0; i < this.finishCb.length; i++) {
            let cb = this.finishCb[i];
            if (cb) {
                cb(view);
                if (DEBUG) warn(`ViewData do finish view : ${className} msg : ${msg}`);
            }
        }
        this.finishCb = [];
    }

    doCallback(view: UIView | null, className: string, msg: string) {
        this.doFinish(view, className, msg);
        this.doGet(view, className, msg);
    }
}

export interface IUIManager extends ISingleManager {

    /**@description 无主资源 */
    garbage: ViewDynamicLoadData;
    /**@description 驻留内存资源 */
    retainMemory: ViewDynamicLoadData;
    /**@description 预加载界面 */
    preload<T extends UIView>(uiClass: UIClass<T>, bundle: BUNDLE_TYPE): Promise<T>;
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
    /**@description 获取当前的Canvas节点 */
    getCanvas(): Node;
    /**
     * @description 向Canvas节点上增加子节点
     * @param node 需要增加的node
     * @param zOrder 添加的渲染层级
     * @param adpater 全屏适配接口 
     * */
    addChild(node: Node, zOrder: number, adpater?: IFullScreenAdapt): void;
    /**@description 添加动态加载的本地资源 */
    addLocal(info: ResourceInfo, className: string): void;
    /**@description 添加动态加载的远程资源 */
    addRemote(info: ResourceInfo, className: string): void;
    /**@description 通过界面的类型关闭界面 */
    close<T extends UIView>(uiClass: UIClass<T>): void;
    /**@description 通过界面的类型名关闭界面 */
    close(className: string): void
    /**@description 关闭除传入参数以外的所有其它界面,不传入，关闭所有界面 */
    closeExcept(views: (UIClass<UIView> | string | UIView)[]): void;
    /**@description 隐藏界面，界面不会销毁 */
    hide(className: string): void;
    /**@description 隐藏界面，界面不会销毁 */
    hide<T extends UIView>(uiClass: UIClass<T>): void;
    /**@description 通过类型名拿界面 */
    getView(className: string): Promise<UIView>;
    /**@description 通过类型拿界面 */
    getView<T extends UIView>(uiClass: UIClass<T>): Promise<T>;
    /**@description 检测是否是一个视图，UIManager内部使用 */
    checkView(url: string, className: string | null): void;
    /**@description 获取界面是否显示 */
    isShow(className: string): boolean;
    /**@description 获取界面是否显示 */
    isShow<T extends UIView>(uiClass: UIClass<T>): boolean;
    /**@description 通知所有视图全屏幕适配 */
    fullScreenAdapt(): void;
    /*获取当前Canvas 上组件 默认获取 MainController的组件 */
    getComponent(type ?: typeof Component | string): Component | null;
    /**@description 向当前的Canvas节点上添加自定义组件 */
    addComponent<T extends Component>(type: { new(): T }): T;
    /**@description 向当前的Canvas节点上添加自定义组件 */
    addComponent(className: string): any;
    /**@description 移除当前的Canvas节点上添加自定义组件 */
    removeComponent(component: string | Component): void;
    /**@description 打印当前所有界面信息 */
    printViews(): void;
    /**@description 打印当前Canvas上所有节点信息 */
    printCanvasChildren(): void;
    /**@description 打印当前Canvas上所有组件信息 */
    printComponent(): void;
}
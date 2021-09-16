import { isValid, js, Node, Prefab, Widget, instantiate, director, Component } from "cc";
import { DEBUG } from "cc/env";
import { ViewStatus } from "../../defines/Enums";
import { Macro } from "../../defines/Macros";
import { Resource } from "../asset/Resource";
import UIView from "./UIView";

/**@description 动态加载垃圾数据名 */
const DYNAMIC_LOAD_GARBAGE = "DYNAMIC_LOAD_GARBAGE";
/**@description 动画加载全局数据名 */
const DYNAMIC_LOAD_RETAIN_MEMORY = "DYNAMIC_LOAD_RETAIN_MEMORY";
export class ViewDynamicLoadData {
    private local = new Map<string, Resource.Info>();
    private remote = new Map<string, Resource.Info>();
    public name: string | null;

    constructor(name: string | null = null) {
        this.name = name;
    }

    /**@description 添加动态加载的本地资源 */
    public addLocal(info: Resource.Info, className: string | null = null) {
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
    public addRemote(info: Resource.Info, className: string | null = null) {
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
class ViewData {
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
    info: Resource.Info = null!;
    /**@description 界面的类型 */
    viewType : UIClass<UIView> = null!;
    /**@description bundle */
    bundle : BUNDLE_TYPE = null!;

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

export class UIManager {

    private static _instance: UIManager = null!;
    public static Instance() { return this._instance || (this._instance = new UIManager()); }
    public _logTag = `[UIManager]`;
    /**@description 视图 */
    private _viewDatas: Map<string, ViewData> = new Map<string, ViewData>();
    private getViewData(className: string): ViewData;
    private getViewData<T extends UIView>(uiClass: UIClass<T>): ViewData;
    private getViewData(data: any): ViewData | undefined {
        let className = this.getClassName(data);
        if (!className) return undefined;
        let viewData = this._viewDatas.has(className) ? this._viewDatas.get(className) : undefined;
        return viewData;
    }

    /**
     * @description 通过当前视图，获取视图的类型
     * @param view 
     * @returns 
     */
    public getViewType<T extends UIView>( view : UIView ):GameViewClass<T>{
        if ( !isValid(view) ){
            return null as any;
        }
        
        let className = view.className;
        if (!className) return null as any;
        let viewData = this._viewDatas.get(className);
        if ( viewData ){
            return viewData.viewType as any;
        }else{
            return null as any;
        }
    }

    private getClassName(className: string): string;
    private getClassName<T extends UIView>(uiClass: UIClass<T>): string;
    private getClassName(data: any): string | undefined {
        if (!data) return undefined;
        let className = undefined;
        if (typeof data == "string") {
            className = data;
        }
        else {
            className = js.getClassName(data);
        }
        return className;
    }

    /**@description 无主资源 */
    public garbage = new ViewDynamicLoadData(DYNAMIC_LOAD_GARBAGE);
    /**@description 驻留内存资源 */
    public retainMemory = new ViewDynamicLoadData(DYNAMIC_LOAD_RETAIN_MEMORY);

    public preload<T extends UIView>(uiClass: UIClass<T>, bundle: BUNDLE_TYPE) {
        return this._open(uiClass, bundle, 0, true, undefined, undefined);
    }

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
    public open<T extends UIView>(config: { type: UIClass<T>, bundle?: BUNDLE_TYPE, zIndex?: number, args?: any[], delay?: number, name?: string }): Promise<T> {
        return this._open(config.type, config.bundle as BUNDLE_TYPE, config.zIndex ? config.zIndex : 0, false, config.args, config.delay, config.name);
    }

    private _open<T extends UIView>(
        uiClass: UIClass<T>,
        bundle: BUNDLE_TYPE,
        zOrder: number = 0,
        isPreload: boolean,
        args?: any[],
        delay?: number,
        name?: string) {
        return new Promise<T>((reslove, reject) => {
            if (!uiClass) {
                if (DEBUG) log(`${this._logTag}open ui class error`);
                reslove(<any>null);
                return;
            }
            let className = js.getClassName(uiClass);

            let canvas = this.getCanvas();
            if (!canvas) {
                if (DEBUG) error(`${this._logTag}找不到场景的Canvas节点`);
                reslove(<any>null);
                return;
            }
            let viewData = this.getViewData(uiClass);
            if (viewData) {
                viewData.isPreload = isPreload;
                //已经加载
                if (viewData.isLoaded) {
                    viewData.status = ViewStatus.WAITTING_NONE;
                    if (!isPreload) {
                        if (viewData.view && isValid(viewData.node)) {
                            viewData.node.zIndex = zOrder;
                            if (!viewData.node.parent) {
                                this.addChild(viewData.node, zOrder);
                            }
                            viewData.view.show(args);
                        }
                    }
                    reslove(<T>viewData.view);
                    return;
                }
                else {
                    viewData.status = ViewStatus.WAITTING_NONE;
                    if (!isPreload) {
                        Manager.uiLoading.show(delay as number, name as string);
                    }
                    //正在加载中
                    if (DEBUG) warn(`${this._logTag}${className} 正在加载中...`);
                    viewData.finishCb.push(reslove);
                    return;
                }
            }
            else {
                viewData = new ViewData();
                viewData.loadData.name = className;
                let prefabUrl = uiClass.getPrefabUrl();
                viewData.isPreload = isPreload;
                viewData.viewType = uiClass;
                viewData.bundle = bundle;
                this._viewDatas.set(className, viewData);

                let progressCallback: (completedCount: number, totalCount: number, item: any) => void = null!;

                if (!isPreload) {
                    Manager.uiLoading.show(delay as number, name as string);
                    //预加载界面不显示进度
                    progressCallback = (completedCount: number, totalCount: number, item: any) => {
                        let progress = Math.ceil((completedCount / totalCount) * 100);
                        Manager.uiLoading.updateProgress(progress);
                    };
                }
                this.loadPrefab(bundle, prefabUrl, progressCallback)
                    .then((prefab) => {
                        viewData.info = new Resource.Info;
                        viewData.info.url = prefabUrl;
                        viewData.info.type = Prefab;
                        viewData.info.data = prefab;
                        viewData.info.bundle = bundle;
                        Manager.assetManager.retainAsset(viewData.info);
                        this.createNode(className, uiClass, reslove, prefab, args, zOrder, bundle);
                        Manager.uiLoading.hide();
                    }).catch((reason) => {
                        viewData.isLoaded = true;
                        error(reason);
                        this.close(uiClass);
                        viewData.doCallback(null, className, "打开界面异常");
                        reslove(<any>null);
                        let uiName = "";
                        if (DEBUG) {
                            uiName = className;
                        }
                        if (name) {
                            uiName = name;
                        }
                        Manager.tips.show(`加载界面${uiName}失败，请重试`);
                        Manager.uiLoading.hide();
                    });
            }
        });
    }

    private _addComponent<T extends UIView>(
        uiNode: Node,
        uiClass: UIClass<T>,
        viewData: ViewData,
        className: string,
        zOrder: number,
        args: any[] | undefined,
        bundle: BUNDLE_TYPE): UIView | null {
        if (uiNode) {
            //挂载脚本
            let view = uiNode.getComponent(uiClass) as UIView;
            if (!view) {
                view = uiNode.addComponent(uiClass);
                if (!view) {
                    if (DEBUG) error(`${this._logTag}挂载脚本失败 : ${className}`);
                    return null;
                }
                else {
                    if (DEBUG) log(`${this._logTag}挂载脚本 : ${className}`);
                }
            }

            view.className = className;
            view.bundle = bundle
            viewData.view = view;
            view.args = args;

            //界面显示在屏幕中间
            let widget = view.getComponent(Widget);
            if (widget) {
                if (DEBUG) warn(`${this._logTag}你已经添加了cc.Widget组件，将会更改成居中模块`);
                widget.isAlignHorizontalCenter = true;
                widget.horizontalCenter = 0;
                widget.isAlignVerticalCenter = true;
                widget.verticalCenter = 0;
            }
            else {
                widget = view.addComponent(Widget);
                if (widget) {
                    widget.isAlignHorizontalCenter = true;
                    widget.horizontalCenter = 0;
                    widget.isAlignVerticalCenter = true;
                    widget.verticalCenter = 0;
                }
            }

            if (!viewData.isPreload) {
                this.addChild(uiNode, zOrder);
            }
            return view;
        }
        else {
            return null;
        }
    }

    private createNode<T extends UIView>(
        className: string,
        uiClass: UIClass<T>,
        reslove: any,
        data: Prefab,
        args: any[] | undefined,
        zOrder: number,
        bundle: BUNDLE_TYPE) {
        let viewData = this._viewDatas.get(className);
        if (!viewData) return;
        viewData.isLoaded = true;
        if (viewData.status == ViewStatus.WAITTING_CLOSE) {
            //加载过程中有人关闭了界面
            reslove(null);
            if (DEBUG) warn(`${this._logTag}${className}正等待关闭`);
            //如果此时有地方正在获取界面，直接返回空
            viewData.doCallback(null, className, "获取界内已经关闭");
            return;
        }

        let uiNode = instantiate(data);
        viewData.node = uiNode;
        let view = this._addComponent(uiNode, uiClass, viewData, className, zOrder, args, bundle);
        if (!view) {
            reslove(null);
            return;
        }

        if (viewData.status == ViewStatus.WATITING_HIDE) {
            //加载过程中有人隐藏了界面
            view.hide();
            if (DEBUG) warn(`${this._logTag}加载过程隐藏了界面${className}`);
            reslove(view);
            viewData.doCallback(view, className, "加载完成，但加载过程中被隐藏");
        }
        else {
            if (DEBUG) log(`${this._logTag}open view : ${className}`)

            if (!viewData.isPreload) {
                view.show(args);
            }
            reslove(view)
            viewData.doCallback(view, className, "加载完成，回调之前加载中的界面");
        }
    }

    private loadPrefab(bundle: BUNDLE_TYPE | undefined, url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void) {
        return new Promise<Prefab>((resolove, reject) => {
            if (bundle == undefined || bundle == "" || bundle == null) {
                bundle = Macro.BUNDLE_RESOURCES;
            }
            Manager.assetManager.load(bundle, url, Prefab, progressCallback, (data) => {
                if (data && data.data && data.data instanceof Prefab) {
                    resolove(data.data);
                }
                else {
                    reject(`加载prefab : ${url} 失败`)
                }
            });
        });
    }

    public getCanvas(): Node {
        let rootScene = director.getScene();
        if (!rootScene) {
            if (DEBUG) error(`${this._logTag}当前场景为空`);
            return <any>null;
        }

        let root: any = rootScene.getChildByName("Canvas");
        if (!root) {
            if (DEBUG) error(`${this._logTag}当前场景上找不到 Canvas 节点`);
            return <any>null;
        }
        return root;
    }

    public addChild(node: Node, zOrder: number, adpater?: IFullScreenAdapt) {
        this.getCanvas().addChild(node);
        node.zIndex = zOrder;
        (<any>window)["cc"].updateZIndex(this.getCanvas());
        Manager.adaptor.fullScreenAdapt(node, adpater);
    }

    /**@description 添加动态加载的本地资源 */
    public addLocal(info: Resource.Info, className: string) {
        if (info) {
            let viewData = this.getViewData(className);
            if (viewData) {
                viewData.loadData.addLocal(info, className);
            }
        }
    }

    /**@description 添加动态加载的远程资源 */
    public addRemote(info: Resource.Info, className: string) {
        if (info) {
            let viewData = this.getViewData(className);
            if (viewData) {
                viewData.loadData.addRemote(info, className);
            }
        }
    }

    public close<T extends UIView>(uiClass: UIClass<T>): void;
    public close(className: string): void;
    public close(data: any): void {
        //当前所有界面都已经加载完成
        let viewData = this.getViewData(data);
        if (viewData) {
            viewData.status = ViewStatus.WAITTING_CLOSE;
            if (viewData.view && isValid(viewData.node)) {
                viewData.node.removeFromParent();
                viewData.node.destroy();
            }
            viewData.loadData.clear();
            let className = this.getClassName(data);
            Manager.assetManager.releaseAsset(viewData.info);
            this._viewDatas.delete(className);
            log(`${this._logTag} close view : ${className}`);
        }
    }

    /**@description 关闭除传入参数以外的所有其它界面,不传入，关闭所有界面 */
    public closeExcept(views: (UIClass<UIView> | string | UIView)[]) {
        let self = this;
        if (views == undefined || views == null || views.length == 0) {
            //关闭所有界面
            if (DEBUG) error(`请检查参数，至少需要保留一个界面，不然就黑屏了，大兄弟`);
            this._viewDatas.forEach((viewData: ViewData, key: string) => {
                self.close(key);
            });
            return;
        }

        let viewClassNames = new Set<string>();

        for (let i = 0; i < views.length; i++) {
            viewClassNames.add(this.getClassName(views[i] as any));
        }

        this._viewDatas.forEach((viewData: ViewData, key: string) => {
            if (viewClassNames.has(key)) {
                //如果包含，不做处理，是排除项
                return;
            }
            self.close(key);
        });

        this.printViews();
    }

    /**@description 关闭指定bundle的视图 */
    public closeBundleView( bundle : BUNDLE_TYPE ){
        let self = this;
        this._viewDatas.forEach((viewData,key)=>{
            if ( viewData.bundle == bundle ){
                self.close(key);
            }
        });
    }
    public hide(className: string): void;
    public hide<T extends UIView>(uiClass: UIClass<T>): void;
    public hide(data: any): void {
        let viewData = this.getViewData(data);
        if (viewData) {
            if (viewData.isLoaded) {
                //已经加载完成，说明已经是直实存在的界面，按照正常游戏进行删除
                if (viewData.view && isValid(viewData.view.node)) {
                    viewData.view.hide();
                }
                if (DEBUG) log(`${this._logTag}hide view : ${viewData.loadData.name}`);
            }
            else {
                //没有加载写成，正常加载中
                viewData.status = ViewStatus.WATITING_HIDE;
            }
        }
    }

    public getView(className: string): Promise<any>;
    public getView<T extends UIView>(uiClass: UIClass<T>): Promise<T>;
    public getView(data: any): any {
        return new Promise<any>((resolove, reject) => {
            if (data == undefined || data == null) {
                resolove(null);
                return;
            }
            let viewData = this.getViewData(data);
            if (viewData) {
                if (viewData.isPreload) {
                    //如果只是预加载，返回空，让使用者用open的方式打开
                    resolove(null);
                } else {
                    if (viewData.isLoaded) {
                        resolove(viewData.view);
                    }
                    else {
                        //加载中
                        viewData.getViewCb.push(resolove);
                    }
                }
            }
            else {
                resolove(null);
            }
        });
    }

    public checkView(url: string, className: string | null) {
        if (DEBUG && className) {
            this.getView(className).then((view) => {
                if (!view) {
                    let viewData = this.getViewData(className);
                    if (viewData) {
                        //预置加载返回的view是空
                        //排除掉这种方式的
                        if (!viewData.isPreload) {
                            error(`资源 : ${url} 的持有者必须由UIManager.open方式打开`);
                        }
                    } else {
                        error(`资源 : ${url} 的持有者必须由UIManager.open方式打开`);
                    }
                }
            });
        }
    }

    public isShow(className: string): boolean;
    public isShow<T extends UIView>(uiClass: UIClass<T>): boolean;
    public isShow(data: any) {
        let viewData = this.getViewData(data);
        if (!viewData) {
            return false;
        }
        if (viewData.isLoaded && viewData.status == ViewStatus.WAITTING_NONE) {
            if (viewData.view) return viewData.view.node.active;
        }
        return false;
    }

    public fullScreenAdapt() {
        this._viewDatas.forEach((data) => {
            if (data.isLoaded && data.view) {
                Manager.adaptor.fullScreenAdapt(data.view.node, data.view);
            }
        });
    }

    /*获取当前canvas的组件 */
    public getCanvasComponent(): Component | null {
        let canvas = this.getCanvas();
        if (canvas) {
            return canvas.getComponent("MainController");
        }
        return null;
    }

    public addComponent<T extends Component>(type: { new(): T }): T;
    public addComponent(className: string): any;
    public addComponent(data: any) {
        let canvas = this.getCanvas();
        if (canvas) {
            let component = canvas.getComponent(data);
            if (component) {
                if (typeof data == "string") {
                    if (DEBUG) warn(`${this._logTag}已经存在 Component ${component}`)
                }
                else {
                    if (DEBUG) warn(`${this._logTag}已经存在 Component ${js.getClassName(data)}`);
                }
                return component;
            }
            else {
                return canvas.addComponent(data);
            }
        }
        return null;
    }

    public removeComponent(component: string | Component) {
        let canvas = this.getCanvas();
        if (canvas) {
            let comp = canvas.getComponent(component as any);
            if (comp) {
                comp.destroy();
            }
        }
    }

    public printViews() {
        log(`${this._logTag}---------views----start-----`);
        this._viewDatas.forEach((value: ViewData, key: string) => {
            log(`[${key}] isLoaded : ${value.isLoaded} status : ${value.status} view : ${this.getClassName(value.view as any)} active : ${value.view && value.view.node ? value.view.node.active : false}`);
        });
        log(`${this._logTag}---------views----end-----`);
    }

    public printCanvasChildren() {
        log(`${this._logTag}-----------printCanvasChildren--start-----------`);
        let canvas = this.getCanvas();
        if (canvas) {
            let children = canvas.children;
            for (let i = 0; i < children.length; i++) {
                log(`${children[i].name} active : ${children[i].active}`);
            }
        }
        log(`${this._logTag}-----------printCanvasChildren--end-----------`);
    }

    public printComponent() {
        let canvas: any = this.getCanvas();
        if (canvas) {
            let comps: any[] = canvas._components;
            log(`${this._logTag} -------------- print component start --------------`);
            for (let i = 0; i < comps.length; i++) {
                log(js.getClassName(comps[i]));
            }
            log(`${this._logTag} -------------- print component end --------------`);
        }
    }
}
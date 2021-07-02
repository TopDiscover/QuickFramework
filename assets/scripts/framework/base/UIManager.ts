import UIView, {UIClass } from "../ui/UIView";
import { ResourceInfo, ResourceCacheData, ViewStatus, BUNDLE_TYPE, BUNDLE_RESOURCES } from "./Defines";
import { Manager } from "../Framework";
import { isValid, js, Node, Prefab, Widget, instantiate, director, Component } from "cc";
import { DEBUG } from "cc/env";
import { IFullScreenAdapt } from "../ui/IFullScreenAdapter";
import { DYNAMIC_LOAD_GARBAGE, DYNAMIC_LOAD_RETAIN_MEMORY, IUIManager, ViewData, ViewDynamicLoadData } from "../interface/IUIManager";

class UIManager implements IUIManager{
    onLoad(node: Node): void {
        
    }
    onDestroy(node: Node): void {
        
    }

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
                                this.addChild(viewData.node,zOrder);
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
                        Manager.uiLoading.show(delay, name);
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
                this._viewDatas.set(className, viewData);

                let progressCallback: (completedCount: number, totalCount: number, item: any) => void = null!;

                if (!isPreload) {
                    Manager.uiLoading.show(delay, name);
                    //预加载界面不显示进度
                    progressCallback = (completedCount: number, totalCount: number, item: any) => {
                        let progress = Math.ceil((completedCount / totalCount) * 100);
                        Manager.uiLoading.updateProgress(progress);
                    };
                }
                this.loadPrefab(bundle, prefabUrl, progressCallback)
                    .then((prefab) => {
                        viewData.info = new ResourceInfo;
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
                this.addChild(uiNode,zOrder);
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
                bundle = BUNDLE_RESOURCES;
            }
            Manager.assetManager.load(bundle, url, Prefab, progressCallback, (data: ResourceCacheData) => {
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

    public addChild( node : Node , zOrder : number , adpater ?: IFullScreenAdapt ){
        this.getCanvas().addChild(node);
        node.zIndex = zOrder;
        (<any>window)["cc"].updateZIndex(this.getCanvas());
        Manager.resolutionHelper.fullScreenAdapt(node,adpater);
    }

    /**@description 添加动态加载的本地资源 */
    public addLocal(info: ResourceInfo, className: string) {
        if (info) {
            let viewData = this.getViewData(className);
            if (viewData) {
                viewData.loadData.addLocal(info, className);
            }
        }
    }

    /**@description 添加动态加载的远程资源 */
    public addRemote(info: ResourceInfo, className: string) {
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
                Manager.resolutionHelper.fullScreenAdapt(data.view.node,data.view);
            }
        });
    }

    /*获取当前canvas的组件 */
    public getComponent(type ?: typeof Component | string): Component | null {
        let canvas = this.getCanvas();
        if (canvas) {
            if( type ){
                if( typeof type == "string"){
                    return canvas.getComponent(type);
                }else{
                    return canvas.getComponent(type);
                }
            }else{
                return canvas.getComponent("MainController");
            }
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

export function uiManagerInit() {
    log("界面管理器初始化")
    Manager.uiManager = UIManager.Instance();
}
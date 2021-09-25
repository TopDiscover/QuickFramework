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
                Log.e(`找不到资源持有者: ${info.url}`);
            }
            if (CC_DEBUG) Manager.uiManager.checkView(info.url, className);
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
                Log.e(`找不到资源持有者 : ${info.url}`);
            }
            if (CC_DEBUG) Manager.uiManager.checkView(info.url, className);
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
                Log.e(`当前未能释放资源如下:`);
            }
            if (this.local && this.local.size > 0) {
                Log.e("-----------local-----------");
                if (this.local) {
                    this.local.forEach((info) => {
                        Log.e(info.url);
                    });
                }
            }
            if (this.remote && this.remote.size > 0) {
                Log.e("-----------remote-----------");
                if (this.remote) {
                    this.remote.forEach((info, url) => {
                        Log.e(info.url);
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

    node: cc.Node = null;

    private doGet(view: UIView | null, className: string, msg: string) {
        for (let i = 0; i < this.getViewCb.length; i++) {
            let cb = this.getViewCb[i];
            if (cb) {
                cb(view);
                if (CC_DEBUG) Log.w(`ViewData do get view : ${className} msg : ${msg}`);
            }
        }

        this.getViewCb = [];
    }

    private doFinish(view: UIView | null, className: string, msg: string) {
        for (let i = 0; i < this.finishCb.length; i++) {
            let cb = this.finishCb[i];
            if (cb) {
                cb(view);
                if (CC_DEBUG) Log.w(`ViewData do finish view : ${className} msg : ${msg}`);
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
        if ( !cc.isValid(view) ){
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
            className = cc.js.getClassName(data);
        }
        return className;
    }

    /**@description 无主资源 */
    public garbage = new ViewDynamicLoadData(DYNAMIC_LOAD_GARBAGE);
    /**@description 驻留内存资源 */
    public retainMemory = new ViewDynamicLoadData(DYNAMIC_LOAD_RETAIN_MEMORY);

    private defaultOpenOption(options : OpenOption ) {
        let out : DefaultOpenOption = {
            bundle : Macro.BUNDLE_RESOURCES,
            delay : options.delay,
            name : options.name,
            zIndex : 0,
            preload : false,
            type : options.type,
            args : options.args,
        };
        if ( options.bundle != undefined ){
            out.bundle = options.bundle;
        }
        if ( options.zIndex != undefined ){
            out.zIndex = options.zIndex;
        }
        if ( options.preload != undefined ){
            out.preload = options.preload;
        }
        return out;
    }

    /**
     * @description 预加载视图
     * @param uiClass 
     * @param bundle 
     * @returns 
     */
    public preload<T extends UIView>(uiClass: UIClass<T>, bundle: BUNDLE_TYPE) {
        return this.open({ type : uiClass,preload:true,bundle:bundle});
    }

    /**
     * @description 打开视图
     * @param type UIView视图类型
     * @param OpenOption 打开设置
     * @param viewOption 视图显示设置参数，即UIView.show参数
     * @returns 
     */
    public open<T extends UIView>( openOption: OpenOption): Promise<T> {
        let _OpenOption = this.defaultOpenOption(openOption);
        return this._open(_OpenOption);
    }

    private _open<T extends UIView>(openOption : DefaultOpenOption) {
        return new Promise<T>((reslove, reject) => {
            if (!openOption.type) {
                if (CC_DEBUG) Log.d(`${this._logTag}open ui class error`);
                reslove(<any>null);
                return;
            }
            let className = cc.js.getClassName(openOption.type);

            let root = this.viewRoot;
            if (!root) {
                if (CC_DEBUG) Log.e(`${this._logTag}找不到场景的Canvas节点`);
                reslove(<any>null);
                return;
            }
            let viewData = this.getViewData(openOption.type);
            if (viewData) {
                viewData.isPreload = openOption.preload;
                //已经加载
                if (viewData.isLoaded) {
                    viewData.status = ViewStatus.WAITTING_NONE;
                    if (!openOption.preload) {
                        if (viewData.view && cc.isValid(viewData.node)) {
                            viewData.node.zIndex = openOption.zIndex;
                            if (!viewData.node.parent) {
                                this.addView(viewData.node, openOption.zIndex,viewData.view);
                            }
                            viewData.view.show(openOption.args);
                        }
                    }
                    reslove(<T>viewData.view);
                    return;
                }
                else {
                    viewData.status = ViewStatus.WAITTING_NONE;
                    if (!openOption.preload) {
                        Manager.uiLoading.show(openOption.delay,openOption.name);
                    }
                    //正在加载中
                    if (CC_DEBUG) Log.w(`${this._logTag}${className} 正在加载中...`);
                    viewData.finishCb.push(reslove);
                    return;
                }
            }
            else {
                viewData = new ViewData();
                viewData.loadData.name = className;
                let prefabUrl = openOption.type.getPrefabUrl();
                viewData.isPreload = openOption.preload;
                viewData.viewType = openOption.type;
                viewData.bundle = openOption.bundle;
                this._viewDatas.set(className, viewData);

                let progressCallback: (completedCount: number, totalCount: number, item: any) => void = null!;

                if (!openOption.preload) {
                    Manager.uiLoading.show(openOption.delay,openOption.name);
                    //预加载界面不显示进度
                    progressCallback = (completedCount: number, totalCount: number, item: any) => {
                        let progress = Math.ceil((completedCount / totalCount) * 100);
                        Manager.uiLoading.updateProgress(progress);
                    };
                }
                this.loadPrefab(openOption.bundle, prefabUrl, progressCallback)
                    .then((prefab) => {
                        viewData.info = new Resource.Info;
                        viewData.info.url = prefabUrl;
                        viewData.info.type = cc.Prefab;
                        viewData.info.data = prefab;
                        viewData.info.bundle = openOption.bundle;
                        Manager.assetManager.retainAsset(viewData.info);
                        this.createNode(viewData,reslove,openOption);
                        Manager.uiLoading.hide();
                    }).catch((reason) => {
                        viewData.isLoaded = true;
                        Log.e(reason);
                        this.close(openOption.type);
                        viewData.doCallback(null, className, "打开界面异常");
                        reslove(<any>null);
                        let uiName = "";
                        if ( CC_DEBUG ){
                            uiName = className;
                        }
                        if (openOption.name) {
                            uiName = openOption.name;
                        }
                        Manager.tips.show(`加载界面${uiName}失败，请重试`);
                        Manager.uiLoading.hide();
                    });
            }
        });
    }

    private _addComponent(uiNode: cc.Node,viewData: ViewData,openOption : DefaultOpenOption ): UIView | null {
        if (uiNode) {
            let className = this.getClassName(viewData.viewType);
            //挂载脚本
            let view = uiNode.getComponent(viewData.viewType);
            if (!view) {
                view = uiNode.addComponent(viewData.viewType);
                if (!view) {
                    if (CC_DEBUG) Log.e(`${this._logTag}挂载脚本失败 : ${className}`);
                    return null;
                }
                else {
                    if (CC_DEBUG) Log.d(`${this._logTag}挂载脚本 : ${className}`);
                }
            }

            view.className = className;
            view.bundle = openOption.bundle;
            viewData.view = view;
            view.args = openOption.args;

            //界面显示在屏幕中间
            let widget = view.getComponent(cc.Widget);
            if (widget) {
                if (CC_DEBUG) Log.w(`${this._logTag}你已经添加了cc.Widget组件，将会更改成居中模块`);
                widget.isAlignHorizontalCenter = true;
                widget.horizontalCenter = 0;
                widget.isAlignVerticalCenter = true;
                widget.verticalCenter = 0;
            }
            else {
                widget = view.addComponent(cc.Widget);
                if (widget) {
                    widget.isAlignHorizontalCenter = true;
                    widget.horizontalCenter = 0;
                    widget.isAlignVerticalCenter = true;
                    widget.verticalCenter = 0;
                }
            }

            if (!viewData.isPreload) {
                this.addView(uiNode, openOption.zIndex,view);
            }
            return view;
        }
        else {
            return null;
        }
    }

    private createNode(viewData : ViewData,reslove: any,openOptions : DefaultOpenOption) {
        viewData.isLoaded = true;
        let className = this.getClassName(viewData.viewType);
        if (viewData.status == ViewStatus.WAITTING_CLOSE) {
            //加载过程中有人关闭了界面
            reslove(null);
            if (CC_DEBUG) Log.w(`${this._logTag}${className}正等待关闭`);
            //如果此时有地方正在获取界面，直接返回空
            viewData.doCallback(null, className, "获取界内已经关闭");
            return;
        }

        let uiNode = cc.instantiate(viewData.info.data as cc.Prefab);
        viewData.node = uiNode;
        let view = this._addComponent(uiNode,viewData,openOptions);
        if (!view) {
            reslove(null);
            return;
        }

        if (viewData.status == ViewStatus.WATITING_HIDE) {
            //加载过程中有人隐藏了界面
            view.hide();
            if (CC_DEBUG) Log.w(`${this._logTag}加载过程隐藏了界面${className}`);
            reslove(view);
            viewData.doCallback(view, className, "加载完成，但加载过程中被隐藏");
        }
        else {
            if (CC_DEBUG) Log.d(`${this._logTag}open view : ${className}`)

            if (!viewData.isPreload) {
                view.show(openOptions.args);
            }
            reslove(view)
            viewData.doCallback(view, className, "加载完成，回调之前加载中的界面");
        }
    }

    private loadPrefab(bundle: BUNDLE_TYPE, url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void) {
        return new Promise<cc.Prefab>((resolove, reject) => {
            Manager.assetManager.load(bundle, url, cc.Prefab, progressCallback, (data) => {
                if (data && data.data && data.data instanceof cc.Prefab) {
                    resolove(data.data);
                }
                else {
                    reject(`加载prefab : ${url} 失败`)
                }
            });
        });
    }

    private get canvas(): cc.Node {
        let rootScene = cc.director.getScene();
        if (!rootScene) {
            if (CC_DEBUG) Log.e(`${this._logTag}当前场景为空`);
            return <any>null;
        }

        let root: any = rootScene.getChildByName("Canvas");
        if (!root) {
            if (CC_DEBUG) Log.e(`${this._logTag}当前场景上找不到 Canvas 节点`);
            return <any>null;
        }
        return root;
    }

    public addView(node: cc.Node, zOrder: number, adpater?: IFullScreenAdapt) {
        this.viewRoot.addChild(node);
        node.zIndex = zOrder;
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

    private _viewRoot : cc.Node = null!;
    private get viewRoot(){
        if ( !this._viewRoot ){
            this._viewRoot = cc.find("viewRoot",this.canvas);
        }
        return this._viewRoot;
    }

    private _componentRoot : cc.Node = null!;
    private get componentRoot(){
        if ( !this._componentRoot ){
            this._componentRoot = cc.find("componentRoot",this.canvas);
        }
        return this._componentRoot;
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
            if (viewData.view && cc.isValid(viewData.node)) {
                viewData.node.removeFromParent();
                viewData.node.destroy();
            }
            viewData.loadData.clear();
            let className = this.getClassName(data);
            Manager.assetManager.releaseAsset(viewData.info);
            this._viewDatas.delete(className);
            Log.d(`${this._logTag} close view : ${className}`);
        }
    }

    /**@description 关闭除传入参数以外的所有其它界面,不传入，关闭所有界面 */
    public closeExcept(views: (UIClass<UIView> | string | UIView)[]) {
        let self = this;
        if (views == undefined || views == null || views.length == 0) {
            //关闭所有界面
            if (CC_DEBUG) Log.e(`请检查参数，至少需要保留一个界面，不然就黑屏了，大兄弟`);
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
                if (viewData.view && cc.isValid(viewData.view.node)) {
                    viewData.view.hide();
                }
                if (CC_DEBUG) Log.d(`${this._logTag}hide view : ${viewData.loadData.name}`);
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
        if (CC_DEBUG && className) {
            this.getView(className).then((view) => {
                if (!view) {
                    let viewData = this.getViewData(className);
                    if (viewData) {
                        //预置加载返回的view是空
                        //排除掉这种方式的
                        if (!viewData.isPreload) {
                            Log.e(`资源 : ${url} 的持有者必须由UIManager.open方式打开`);
                        }
                    } else {
                        Log.e(`资源 : ${url} 的持有者必须由UIManager.open方式打开`);
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
    public getMainController(): cc.Component | null {
        let canvas = this.canvas;
        if (canvas) {
            return canvas.getComponent("MainController");
        }
        return null;
    }

    public addComponent<T extends cc.Component>(type: { new(): T }): T;
    public addComponent(className: string): any;
    public addComponent(data: any) {
        let root = this.componentRoot;
        if (root) {
            let component = root.getComponent(data);
            if (component) {
                if (typeof data == "string") {
                    if (CC_DEBUG) Log.w(`${this._logTag}已经存在 Component ${component}`)
                }
                else {
                    if (CC_DEBUG) Log.w(`${this._logTag}已经存在 Component ${cc.js.getClassName(data)}`);
                }
                return component;
            }
            else {
                return root.addComponent(data);
            }
        }
        return null;
    }

    public removeComponent(component: string | cc.Component) {
        let root = this.componentRoot;
        if (root) {
            let comp = root.getComponent(component as any);
            if (comp) {
                comp.destroy();
            }
        }
    }

    print( delegate : UIManagerPrintDelegate<ViewData,cc.Node,cc.Component>){
        if ( delegate ){
            if ( delegate.printViews ){
                this._viewDatas.forEach((data,key)=>{
                    if ( delegate.printViews ){
                        delegate.printViews(data,key);
                    }
                });
            }

            if ( delegate.printChildren ){
                let root = this.viewRoot;
                if ( root ){
                    let children = root.children;
                    for ( let i = 0 ; i < children.length ; i++){
                        delegate.printChildren(children[i]);
                    }
                }
            }
            
            if (delegate.printComp) {
                let root: any = this.componentRoot;
                if (root) {
                    let comps: any[] = root._components;
                    for (let i = 0; i < comps.length; i++) {
                        delegate.printComp(comps[i]);
                    }
                }
            }
        }
    }
}
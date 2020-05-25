import UIView, { UIClass } from "../ui/UIView";
import { resolutionHelper } from "../adaptor/ResolutionHelper";
import { ResourceInfo, ResourceCacheData, ViewStatus } from "./Defines";
import { getSingleton } from "./Singleton";
import { loader } from "../loader/Loader";
import { remoteCaches } from "../cache/ResCaches";
import UILoadingDelegate from "../ui/UILoadingDelegate";
import ToastDelegate from "../ui/ToastDelegate";

export function uiManager() {
    return getSingleton(UIManager);
}

/**@description 动态加载垃圾数据名 */
const DYNAMIC_LOAD_GARBAGE = "DYNAMIC_LOAD_GARBAGE";
/**@description 动画加载全局数据名 */
const DYNAMIC_LOAD_RETAIN_MEMORY = "DYNAMIC_LOAD_RETAIN_MEMORY";
class ViewDynamicLoadData {
    private local = new Map<string, ResourceInfo>();
    private remote = new Map<string, ResourceInfo>();
    private reference = new Map<string, ResourceInfo>();
    public name: string;

    constructor(name: string = null) {
        this.name = name;
    }

    /**@description 添加动态加载的本地资源 */
    public addLocal(info: ResourceInfo, className: string = null) {
        if (info && info.data) {
            if (this.name == DYNAMIC_LOAD_GARBAGE) {
                cc.error(`找不到资源持有者: ${info.url}`);
            }
            let path = loader().getResourcePath(info.data);
            if (CC_DEBUG) uiManager().checkView(info.url, className);
            if (!this.local.has(path)) {
                info.assetUrl = path;
                loader().retainAsset(info);
                this.local.set(path, info);
            }
        }
    }

    /**@description 添加动态加载的远程资源 */
    public addRemote(info: ResourceInfo, className: string = null) {
        if (info && info.data && !this.remote.has(info.url)) {
            if (this.name == DYNAMIC_LOAD_GARBAGE) {
                cc.error(`找不到资源持有者 : ${info.url}`);
            }
            if (CC_DEBUG) uiManager().checkView(info.url, className);
            remoteCaches().retainAsset(info);
            this.remote.set(info.url, info);
        }
    }

    /**@description 添加资源加载引用*/
    public addReference(info: ResourceInfo, className: string = null) {
        if (info) {
            if (this.name == DYNAMIC_LOAD_GARBAGE) {
                cc.error(`找不到资源持有者: ${info.url}`);
            }
            if (CC_DEBUG) uiManager().checkView(info.url, className);
            if (!this.reference.has(info.url)) {
                loader().retainPreReference(info);
                this.reference.set(info.url, info);
            }
        }
    }

    /**@description 清除远程加载资源 */
    public clear() {
        if (this.name == DYNAMIC_LOAD_GARBAGE) {
            //先输出
            let isShow = this.reference.size > 0 || this.local.size > 0 || this.remote.size > 0;
            if (isShow) {
                cc.error(`当前未能释放资源如下:`);
            }

            if (this.reference && this.reference.size > 0) {
                cc.error("-----------reference-----------");
                if (this.reference) {
                    this.reference.forEach((info) => {
                        cc.error(info.url);
                    });
                }
            }
            if (this.local && this.local.size > 0) {
                cc.error("-----------local-----------");
                if (this.local) {
                    this.local.forEach((info) => {
                        cc.error(info.url);
                    });
                }
            }
            if (this.remote && this.remote.size > 0) {
                cc.error("-----------remote-----------");
                if (this.remote) {
                    this.remote.forEach((info, url) => {
                        cc.error(info.url);
                    });
                }
            }

        } else {
            //先清除当前资源的引用关系
            if (this.reference) {
                this.reference.forEach((info) => {
                    loader().releasePreReference(info);
                });
                this.reference.clear();
            }
            if (this.local) {
                this.local.forEach((info) => {
                    loader().releaseAsset(info);
                });
                this.local.clear();
            }
            if (this.remote) {
                this.remote.forEach((info, url) => {
                    remoteCaches().releaseAsset(info);
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
    view: UIView = null;
    /**@description 等待加载完成回调 */
    finishCb: ((view: any) => void)[] = [];
    /**@description 等待获取界面回调 */
    getViewCb: ((view: any) => void)[] = [];
    /**是否预加载,不显示出来，但会加到当前场景上 */
    isPreload: boolean = false;
    /**@description 资源信息 */
    info: ResourceInfo = null;

    /**@description 界面动态加载的数据 */
    loadData: ViewDynamicLoadData = new ViewDynamicLoadData();

    node: cc.Node = null;

    private doGet(view, className: string, msg: string) {
        for (let i = 0; i < this.getViewCb.length; i++) {
            let cb = this.getViewCb[i];
            if (cb) {
                cb(view);
                if (CC_DEBUG) cc.warn(`ViewData do get view : ${className} msg : ${msg}`);
            }
        }

        this.getViewCb = [];
    }

    private doFinish(view, className: string, msg: string) {
        for (let i = 0; i < this.finishCb.length; i++) {
            let cb = this.finishCb[i];
            if (cb) {
                cb(view);
                if (CC_DEBUG) cc.warn(`ViewData do finish view : ${className} msg : ${msg}`);
            }
        }
        this.finishCb = [];
    }

    doCallback(view, className: string, msg: string) {
        this.doFinish(view, className, msg);
        this.doGet(view, className, msg);
    }
}

class UIManager {

    private static _instance: UIManager = null;
    public static Instance() { return this._instance || (this._instance = new UIManager()); }
    public _logTag = `[UIManager]`;
    /**@description 视图 */
    private _viewDatas: Map<string, ViewData> = new Map<string, ViewData>();
    private getViewData(className: string): ViewData;
    private getViewData<T extends UIView>(uiClass: UIClass<T>): ViewData;
    private getViewData(data: any): ViewData {
        let className = this.getClassName(data);
        if (!className) return null;
        let viewData = this._viewDatas.has(className) ? this._viewDatas.get(className) : null;
        return viewData;
    }

    private getClassName(className: string): string;
    private getClassName<T extends UIView>(uiClass: UIClass<T>): string;
    private getClassName(data: any): string {
        if (!data) return null;
        let className = null;
        if (typeof data == "string") {
            className = data;
        }
        else {
            className = cc.js.getClassName(data);
        }
        return className;
    }

    /**@description GC的间隔时间,目前暂定为进入完成指定场景，后，多少时间内没有界面打开或关闭操作，做GC操作释放内存 */
    private GC_INTERVAL = 1500;
    /**@description 最后一次GC操作时间，当打开或关闭界面时，把当前GC时间重置为当前时间
     * 在进入到大厅1秒后无界面的关闭与打开，做GC内存释放操作
     */
    private _lastGCTime = 0;

    /**@description 是否需要做GC操作 */
    private _isNeedGC = false;

    /**@description 无主资源 */
    public garbage = new ViewDynamicLoadData(DYNAMIC_LOAD_GARBAGE);
    /**@description 驻留内存资源 */
    public retainMemory = new ViewDynamicLoadData(DYNAMIC_LOAD_RETAIN_MEMORY);

    public uiLoading: UILoadingDelegate = null;
    public toast : ToastDelegate = null;

    public preload<T extends UIView>(uiClass: UIClass<T>) {
        return this._open(uiClass, 0, true, null,null);
    }

    /**
     * @description open<T extends UIView>(config: { type: UIClass<T>, zIndex?: number, args?: any[] , delay?: number}) : Promise<T>
     * @param config 配置信息 
     * @param config.type UIView
     * @param config.zIndex 节点层级，默认为0
     * @param config.args 传入的参数列表
     * @param config.delay >0 多少时间未加载界面完成显示加载动画，<=0 | undefined | null 不显示动画
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
    public open<T extends UIView>(config: { type: UIClass<T>, zIndex?: number, args?: any[] , delay?: number,name?:string}) : Promise<T>{
        return this._open(config.type, config.zIndex ? config.zIndex : 0, false, config.args,config.delay,config.name);
    }

    private _open<T extends UIView>(uiClass: UIClass<T>, zOrder: number = 0, isPreload: boolean, args: any[],delay : number,name?:string) {
        return new Promise<T>((reslove, reject) => {
            if (!uiClass) {
                if (CC_DEBUG) cc.log(`${this._logTag}open ui class error`);
                reslove(null);
                return;
            }
            let className = cc.js.getClassName(uiClass);

            let canvas = this.getCanvas();
            if (!canvas) {
                if (CC_DEBUG) cc.error(`${this._logTag}找不到场景的Canvas节点`);
                reslove(null);
                return;
            }

            //打开界面时，更新GC时间
            this.recordGCTime();
            let viewData = this.getViewData(uiClass);
            if (viewData) {
                viewData.isPreload = isPreload;
                //已经加载
                if (viewData.isLoaded) {
                    viewData.status = ViewStatus.WAITTING_NONE;
                    if (!isPreload) {
                        if (viewData.view && cc.isValid(viewData.node)) {
                            viewData.node.zIndex = zOrder;
                            if (!viewData.node.parent) {
                                viewData.node.parent = this.getCanvas();
                            }
                            resolutionHelper().fullScreenAdapt(viewData.node);
                            viewData.view.show(args);
                        }
                    }
                    reslove(<T>viewData.view);
                    return;
                }
                else {
                    viewData.status = ViewStatus.WAITTING_NONE;
                    if ( !isPreload ){
                        if( this.uiLoading ) this.uiLoading.show(delay,name);
                    }
                    //正在加载中
                    if (CC_DEBUG) cc.warn(`${this._logTag}${className} 正在加载中...`);
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

                let progressCallback: (completedCount: number, totalCount: number, item: any) => void = null;

                if (!isPreload) {
                    if (this.uiLoading) this.uiLoading.show(delay,name);
                    //预加载界面不显示进度
                    progressCallback = (completedCount: number, totalCount: number, item: any) => {
                        let progress = Math.ceil((completedCount / totalCount) * 100);
                        if (this.uiLoading) this.uiLoading.updateProgress(progress);
                    };
                }
                this.loadPrefab(prefabUrl, progressCallback)
                    .then((prefab) => {
                        viewData.info = new ResourceInfo;
                        viewData.info.url = prefabUrl;
                        viewData.info.type = cc.Prefab;
                        viewData.info.data = prefab;
                        viewData.info.assetUrl = loader().getResourcePath(prefab);
                        loader().retainAsset(viewData.info);
                        this.createNode(className, uiClass, reslove, prefab, args, zOrder);
                        if (this.uiLoading) this.uiLoading.hide();
                    }).catch((reason) => {
                        viewData.isLoaded = true;
                        cc.error(reason);
                        this.close(uiClass);
                        viewData.doCallback(null, className, "打开界面异常");
                        reslove(null);
                        let uiName = "";
                        if ( CC_DEBUG ){
                            uiName = className;
                        }
                        if ( name ){
                            uiName = name;
                        }
                        if (this.toast) this.toast.show(`加载界面${uiName}失败，请重试`);
                        if (this.uiLoading) this.uiLoading.hide();
                    });
            }
        });
    }

    private _addComponent<T extends UIView>(uiNode: cc.Node, uiClass: UIClass<T>, viewData: ViewData, className: string, zOrder: number, args: any[]): UIView {
        if (uiNode) {
            //挂载脚本
            let view = uiNode.getComponent(uiClass) as UIView;
            if (!view) {
                view = uiNode.addComponent(uiClass);
                if (!view) {
                    if (CC_DEBUG) cc.error(`${this._logTag}挂载脚本失败 : ${className}`);
                    return null;
                }
                else {
                    if (CC_DEBUG) cc.log(`${this._logTag}挂载脚本 : ${className}`);
                }
            }

            resolutionHelper().fullScreenAdapt(uiNode);

            view.className = className;
            viewData.view = view;
            view.init(args);

            //界面显示在屏幕中间
            let widget = view.getComponent(cc.Widget);
            if (widget) {
                if (CC_DEBUG) cc.warn(`${this._logTag}你已经添加了cc.Widget组件，将会更改成居中模块`);
                widget.isAlignHorizontalCenter = true;
                widget.horizontalCenter = 0;
                widget.isAlignVerticalCenter = true;
                widget.verticalCenter = 0;
            }
            else {
                widget = view.addComponent(cc.Widget);
                widget.isAlignHorizontalCenter = true;
                widget.horizontalCenter = 0;
                widget.isAlignVerticalCenter = true;
                widget.verticalCenter = 0;
            }

            if (!viewData.isPreload) {
                uiNode.parent = this.getCanvas();
                uiNode.zIndex = zOrder;
            }
            return view;
        }
        else {
            return null;
        }
    }

    private createNode<T extends UIView>(className: string, uiClass: UIClass<T>, reslove, data: cc.Prefab, args: any[], zOrder: number) {
        let viewData = this._viewDatas.get(className);
        viewData.isLoaded = true;
        if (viewData.status == ViewStatus.WAITTING_CLOSE) {
            //加载过程中有人关闭了界面
            reslove(null);
            if (CC_DEBUG) cc.warn(`${this._logTag}${className}正等待关闭`);
            //如果此时有地方正在获取界面，直接返回空
            viewData.doCallback(null, className, "获取界内已经关闭");
            return;
        }

        let uiNode: cc.Node = cc.instantiate(data);
        viewData.node = uiNode;
        let view = this._addComponent(uiNode, uiClass, viewData, className, zOrder, args);
        if (!view) {
            reslove(null);
            return;
        }

        if (viewData.status == ViewStatus.WATITING_HIDE) {
            //加载过程中有人隐藏了界面
            view.hide();
            if (CC_DEBUG) cc.warn(`${this._logTag}加载过程隐藏了界面${className}`);
            reslove(view);
            viewData.doCallback(view, className, "加载完成，但加载过程中被隐藏");
        }
        else {
            if (CC_DEBUG) cc.log(`${this._logTag}open view : ${className}`)

            if (!viewData.isPreload) {
                view.show(args);
            }
            reslove(view)
            viewData.doCallback(view, className, "加载完成，回调之前加载中的界面");
        }
    }

    private loadPrefab(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void) {
        return new Promise<cc.Prefab>((resolove, reject) => {
            loader().loadRes(url, cc.Prefab, progressCallback, (data: ResourceCacheData) => {
                if (data && data.data && data.data instanceof cc.Prefab) {
                    resolove(data.data);
                }
                else {
                    reject(`加载prefab : ${url} 失败`)
                }
            });
        });
    }

    public getCanvas(): cc.Node {
        let rootScene = cc.director.getScene();
        if (!rootScene) {
            if (CC_DEBUG) cc.error(`${this._logTag}当前场景为空 ： ${cc.director.getScene().name}`);
            return null;
        }

        let root = rootScene.getChildByName("Canvas");
        if (!root) {
            if (CC_DEBUG) cc.error(`${this._logTag}当前场景上找不到 Canvas 节点`);
            return null;
        }
        return root;
    }

    public onDirectorAfterDraw(): boolean {
        let cando = true;
        let hasWaitingClose = false;
        this._viewDatas.forEach((viewData) => {
            if (viewData) {
                //只要有一个界面没加载完成，都不能进行处理
                if (!viewData.isLoaded) cando = false;
                if (viewData.status == ViewStatus.WAITTING_CLOSE) hasWaitingClose = true;
            }
        });
        if (hasWaitingClose && cando) {
            cc.time("释放资源");
            this._viewDatas.forEach((viewData, className) => {
                if (viewData && viewData.status == ViewStatus.WAITTING_CLOSE) {
                    cc.time(`${this._logTag} close view : ${className}`);
                    if (cc.isValid(viewData.node)) {
                        viewData.node.removeFromParent(false);
                        viewData.node.destroy();
                    }
                    viewData.loadData.clear();
                    loader().releaseAsset(viewData.info);
                    this._viewDatas.delete(className);
                    cc.timeEnd(`${this._logTag} close view : ${className}`);
                }
            });
            //删除无主加载数据
            this.garbage.clear()
            cc.timeEnd("释放资源");
            //此处GC操作另行做优化，不能过度的GC会造成动画的卡顿，需要挑一个比较空闲的时间段来做GC操作
            //cc.sys.garbageCollect();
        }

        //GC操作处理
        if (this._isNeedGC) {
            let now = Date.timeNowMillisecons();
            if (now - this._lastGCTime > this.GC_INTERVAL) {
                //抽时间做GC操作
                cc.sys.garbageCollect();
                if (CC_DEBUG) cc.log(`GC内存操作`);
                this._isNeedGC = false;
            }
        }
        return cando;
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

    /**@description 添加资源加载引用*/
    public addReference(info: ResourceInfo, className: string) {
        if (info) {
            let viewData = this.getViewData(className);
            if (viewData) {
                viewData.loadData.addReference(info, className);
            }
        }
    }

    public recordGCTime(isNeedGC: boolean = null) {
        if (isNeedGC != null) this._isNeedGC = isNeedGC;
        this._lastGCTime = Date.timeNowMillisecons();
    }

    public close<T extends UIView>(uiClass: UIClass<T>);
    public close(className: string);
    public close(data: any) {
        //当前所有界面都已经加载完成
        let viewData = this.getViewData(data);
        if (viewData) {
            viewData.status = ViewStatus.WAITTING_CLOSE;
            if (viewData.view && cc.isValid(viewData.node)) {
                viewData.node.removeFromParent(false);
            }
            this.recordGCTime();
        }
    }

    /**@description 关闭除传入参数以外的所有其它界面,不传入，关闭所有界面 */
    public closeExcept(views: (UIClass<UIView> | string | UIView)[]) {
        let self = this;
        if (views == undefined || views == null || views.length == 0) {
            //关闭所有界面
            if (CC_DEBUG) cc.error(`请检查参数，至少需要保留一个界面，不然就黑屏了，大兄弟`);
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

    public hide(className: string);
    public hide<T extends UIView>(uiClass: UIClass<T>);
    public hide(data: any) {
        let viewData = this.getViewData(data);
        if (viewData) {
            if (viewData.isLoaded) {
                //已经加载完成，说明已经是直实存在的界面，按照正常游戏进行删除
                if (viewData.view && cc.isValid(viewData.view.node)) {
                    viewData.view.hide();
                }
                if (CC_DEBUG) cc.log(`${this._logTag}hide view : ${viewData.loadData.name}`);
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

    public checkView(url: string, className: string) {
        if (CC_DEBUG && className) {
            this.getView(className).then((view) => {
                if (!view) {
                    let viewData = this.getViewData(className);
                    if (viewData) {
                        //预置加载返回的view是空
                        //排除掉这种方式的
                        if (!viewData.isPreload) {
                            cc.error(`资源 : ${url} 的持有者必须由UIManager.open方式打开`);
                        }
                    } else {
                        cc.error(`资源 : ${url} 的持有者必须由UIManager.open方式打开`);
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
                resolutionHelper().fullScreenAdapt(data.view.node);
            }
        });
    }

    /*获取当前canvas的组件 */
    public getCanvasComponent(): cc.Component {
        return this.getCanvas().getComponent("MainController");
    }

    public addComponent<T extends cc.Component>(type: { new(): T }): T;
    public addComponent(className: string): any;
    public addComponent(data: any) {
        let canvas = this.getCanvas();
        if (canvas) {
            let component = canvas.getComponent(data);
            if (component) {
                if (typeof data == "string") {
                    if (CC_DEBUG) cc.warn(`${this._logTag}已经存在 Component ${component}`)
                }
                else {
                    if (CC_DEBUG) cc.warn(`${this._logTag}已经存在 Component ${cc.js.getClassName(data)}`);
                }
                return component;
            }
            else {
                return canvas.addComponent(data);
            }
        }
        return null;
    }

    public removeComponent(component: string | cc.Component) {
        let canvas = this.getCanvas();
        if (canvas) canvas.removeComponent(component);
    }

    public printViews() {
        cc.log(`${this._logTag}---------views----start-----`);
        this._viewDatas.forEach((value: ViewData, key: string) => {
            cc.log(`[${key}] isLoaded : ${value.isLoaded} status : ${value.status} view : ${value.view} active : ${value.view && value.view.node ? value.view.node.active : false}`);
        });
        cc.log(`${this._logTag}---------views----end-----`);
    }

    public printCanvasChildren() {
        cc.log(`${this._logTag}-----------printCanvasChildren--start-----------`);
        let canvas = this.getCanvas();
        if (canvas) {
            let children = canvas.children;
            for (let i = 0; i < children.length; i++) {
                cc.log(`${children[i].name} active : ${children[i].active}`);
            }
        }
        cc.log(`${this._logTag}-----------printCanvasChildren--end-----------`);
    }
}
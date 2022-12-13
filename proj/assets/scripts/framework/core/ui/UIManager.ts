import { isValid, js, Node, Prefab, Widget, instantiate, director, Component, find, View, Camera } from "cc";
import { DEBUG } from "cc/env";
import { ViewStatus } from "../../defines/Enums";
import { Macro } from "../../defines/Macros";
import AdapterView from "../adapter/AdapterView";
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
            if (DEBUG) Manager.uiManager.checkView(info.url, className);
            if (!this.local.has(info.url)) {
                Manager.asset.retainAsset(info);
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
            if (DEBUG) Manager.uiManager.checkView(info.url, className);
            Manager.cache.remoteCaches.retainAsset(info);
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
                    Manager.asset.releaseAsset(info);
                });
                this.local.clear();
            }
            if (this.remote) {
                this.remote.forEach((info, url) => {
                    Manager.cache.remoteCaches.releaseAsset(info);
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
    /**@description 是否通过预置创建 */
    isPrefab: boolean = true;
    /**@description 资源信息 */
    info: Resource.Info = null!;
    /**@description 界面的类型 */
    viewType: UIClass<UIView> = null!;
    /**@description bundle */
    bundle: BUNDLE_TYPE = null!;

    /**@description 界面动态加载的数据 */
    loadData: ViewDynamicLoadData = new ViewDynamicLoadData();

    node: Node = null!;

    private doGet(view: UIView | null, className: string, msg: string) {
        for (let i = 0; i < this.getViewCb.length; i++) {
            let cb = this.getViewCb[i];
            if (cb) {
                cb(view);
                if (DEBUG) Log.w(`ViewData do get view : ${className} msg : ${msg}`);
            }
        }

        this.getViewCb = [];
    }

    private doFinish(view: UIView | null, className: string, msg: string) {
        for (let i = 0; i < this.finishCb.length; i++) {
            let cb = this.finishCb[i];
            if (cb) {
                cb(view);
                if (DEBUG) Log.w(`ViewData do finish view : ${className} msg : ${msg}`);
            }
        }
        this.finishCb = [];
    }

    doCallback(view: UIView | null, className: string, msg: string) {
        this.doFinish(view, className, msg);
        this.doGet(view, className, msg);
    }
}

export class UIManager implements ISingleton{
    isResident?: boolean = true;
    static module: string = "【UI管理器】";
    module: string = null!;
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
    public getViewType<T extends UIView>(view: UIView): GameViewClass<T> {
        if (!isValid(view)) {
            return null as any;
        }

        let className = view.className;
        if (!className) return null as any;
        let viewData = this._viewDatas.get(className);
        if (viewData) {
            return viewData.viewType as any;
        } else {
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

    private defaultOpenOption(options: OpenOption) {
        let out: DefaultOpenOption = {
            bundle: Macro.BUNDLE_RESOURCES,
            delay: options.delay,
            name: options.name,
            zIndex: 0,
            preload: false,
            type: options.type,
            args: options.args,
        };
        if (options.bundle != undefined) {
            out.bundle = options.bundle;
        }
        if (options.zIndex != undefined) {
            out.zIndex = options.zIndex;
        }
        if (options.preload != undefined) {
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
        return this.open({ type: uiClass, preload: true, bundle: bundle });
    }

    private parsePrefabUrl(url: string): { isPrefab: boolean, url: string } {
        if (url[0] == "@") {
            return { isPrefab: false, url: url.substr(1) };
        } else {
            return { isPrefab: true, url: url };
        }
    }

    /**
     * @description 打开视图
     * @param type UIView视图类型
     * @param OpenOption 打开设置
     * @param viewOption 视图显示设置参数，即UIView.show参数
     * @returns 
     */
    public open<T extends UIView>(openOption: OpenOption): Promise<T> {
        let _OpenOption = this.defaultOpenOption(openOption);
        return this._open(_OpenOption);
    }

    private _open<T extends UIView>(openOption: DefaultOpenOption) {
        return new Promise<T>((reslove, reject) => {
            if (!openOption.type) {
                if (DEBUG) Log.d(`${this.module}open ui class error`);
                reslove(<any>null);
                return;
            }
            let className = js.getClassName(openOption.type);

            let root = this.viewRoot;
            if (!root) {
                if (DEBUG) Log.e(`${this.module}找不到场景的Canvas节点`);
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
                        if (viewData.view && isValid(viewData.node)) {
                            viewData.node.zIndex = openOption.zIndex;
                            if (!viewData.node.parent) {
                                this.addView(viewData.node, openOption.zIndex);
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
                        Manager.uiLoading.show(openOption.delay, openOption.name);
                    }
                    //正在加载中
                    if (DEBUG) Log.w(`${this.module}${className} 正在加载中...`);
                    viewData.finishCb.push(reslove);
                    return;
                }
            }
            else {
                viewData = new ViewData();
                viewData.loadData.name = className;
                let prefabUrl = openOption.type.getPrefabUrl();
                let result = this.parsePrefabUrl(prefabUrl);
                viewData.isPreload = openOption.preload;
                viewData.isPrefab = result.isPrefab;
                viewData.viewType = openOption.type;
                viewData.bundle = openOption.bundle;
                this._viewDatas.set(className, viewData);
                if (!result.isPrefab) {
                    //说明存在于主场景中
                    viewData.info = new Resource.Info;
                    viewData.info.url = result.url;
                    viewData.info.type = Prefab;
                    viewData.info.data = this.getScenePrefab(result.url) as any;
                    viewData.info.bundle = openOption.bundle;
                    this.createNode(viewData, reslove, openOption);
                    return;
                }
                let progressCallback: (completedCount: number, totalCount: number, item: any) => void = null!;

                if (!openOption.preload) {
                    Manager.uiLoading.show(openOption.delay, openOption.name);
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
                        viewData.info.type = Prefab;
                        viewData.info.data = prefab;
                        viewData.info.bundle = openOption.bundle;
                        Manager.asset.retainAsset(viewData.info);
                        this.createNode(viewData, reslove, openOption);
                        Manager.uiLoading.hide();
                    }).catch((reason) => {
                        viewData.isLoaded = true;
                        Log.e(reason);
                        this.close(openOption.type);
                        viewData.doCallback(null, className, "打开界面异常");
                        reslove(<any>null);
                        let uiName = "";
                        if (DEBUG) {
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

    private _addComponent(uiNode: Node, viewData: ViewData, openOption: DefaultOpenOption): UIView | null {
        if (uiNode) {
            let className = this.getClassName(viewData.viewType);
            //挂载脚本
            let view = uiNode.getComponent(viewData.viewType);
            if (!view) {
                view = uiNode.addComponent(viewData.viewType);
                if (!view) {
                    if (DEBUG) Log.e(`${this.module}挂载脚本失败 : ${className}`);
                    return null;
                }
                else {
                    if (DEBUG) Log.d(`${this.module}挂载脚本 : ${className}`);
                }
            }

            view.className = className;
            view.bundle = openOption.bundle;
            viewData.view = view;
            view.args = openOption.args;

            //界面显示在屏幕中间
            let widget = view.getComponent(Widget);
            if (widget) {
                if (DEBUG) Log.e(`${this.module}请不要在根节点挂载cc.Widget组件`);
                widget.destroy();
            }
            if (!view.getComponent(AdapterView)) {
                view.addComponent(AdapterView);
            }
            if (!viewData.isPreload) {
                this.addView(uiNode, openOption.zIndex);
            }
            return view;
        }
        else {
            return null;
        }
    }

    private createNode(viewData: ViewData, reslove: any, openOptions: DefaultOpenOption) {
        viewData.isLoaded = true;
        let className = this.getClassName(viewData.viewType);
        if (viewData.status == ViewStatus.WAITTING_CLOSE) {
            //加载过程中有人关闭了界面
            reslove(null);
            if (DEBUG) Log.w(`${this.module}${className}正等待关闭`);
            //如果此时有地方正在获取界面，直接返回空
            viewData.doCallback(null, className, "获取界内已经关闭");
            return;
        }

        let uiNode: Node = instantiate(viewData.info.data as Prefab);
        viewData.node = uiNode;
        let view = this._addComponent(uiNode, viewData, openOptions);
        if (!view) {
            reslove(null);
            return;
        }

        if (viewData.status == ViewStatus.WATITING_HIDE) {
            //加载过程中有人隐藏了界面
            view.hide();
            if (DEBUG) Log.w(`${this.module}加载过程隐藏了界面${className}`);
            reslove(view);
            viewData.doCallback(view, className, "加载完成，但加载过程中被隐藏");
        }
        else {
            if (DEBUG) Log.d(`${this.module}open view : ${className}`)

            if (!viewData.isPreload) {
                view.show(openOptions.args);
            }
            reslove(view)
            viewData.doCallback(view, className, "加载完成，回调之前加载中的界面");
        }
    }

    private loadPrefab(bundle: BUNDLE_TYPE, url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void) {
        return new Promise<Prefab>((resolove, reject) => {
            Manager.asset.load(bundle, url, Prefab, progressCallback, (data) => {
                if (data && data.data && data.data instanceof Prefab) {
                    resolove(data.data);
                }
                else {
                    reject(`加载prefab : ${url} 失败`)
                }
            });
        });
    }

    private _canvas: Node = null!;

    private _viewRoot: Node = null!;
    private get viewRoot() {
        if (!this._viewRoot && !isValid(this._viewRoot)) {
            this._viewRoot = find("viewRoot", this.canvas) as Node;
        }
        return this._viewRoot;
    }

    private _componentRoot: Node = null!;
    get componentRoot() {
        if (!this._componentRoot && !isValid(this._componentRoot)) {
            this._componentRoot = find("componentRoot", this.canvas) as Node;
        }
        return this._componentRoot;
    }

    private _mainController: Component | null = null;
    /*获取当前canvas的组件 */
    public get mainController(): Component | null {
        if (!this._mainController && !isValid(this._mainController)) {
            return this._mainController;
        }
        let canvas = this.canvas;
        if (canvas) {
            this._mainController = canvas.getComponent("MainController");
            return this._mainController;
        }
        return null;
    }

    private _prefabs: Node = null!;
    private get prefabs() {
        if (!this._prefabs && !isValid(this._prefabs)) {
            this._prefabs = find("prefabs", this.canvas) as Node;
        }
        return this._prefabs;
    }

    private _root3D = null;
    /**@description 3d根节点 */
    public get root3D(){
        return find("3d",this.canvas.parent as Node) as Node;
    }

    /**@description 3d相机 */
    public get camera3d(){
        return find("Camera3D",this.canvas.parent as Node)?.getComponent(Camera) as Camera;
    }

    /**@description 获取主场景预置节点 */
    getScenePrefab(name: string) {
        return find(name, this.prefabs);
    }

    onLoad(node: Node) {
        this._canvas = node;
    }

    private get canvas(): Node {
        return this._canvas;
    }

    public addView(node: Node, zOrder: number) {
        this.viewRoot.addChild(node);
        node.zIndex = zOrder;
        (<any>window)["cc"].updateZIndex(this.viewRoot);
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
            let className = this.getClassName(data);
            if (viewData.view && isValid(viewData.node)) {
                viewData.node.removeFromParent();
                viewData.node.destroy();
            }
            viewData.loadData.clear();
            if ( viewData.isPrefab ){
                Manager.asset.releaseAsset(viewData.info);
            }
            this._viewDatas.delete(className);
            Log.d(`${this.module} close view : ${className}`);
        }
    }

    /**@description 关闭除传入参数以外的所有其它界面,不传入，关闭所有界面 */
    public closeExcept(views: (UIClass<UIView> | string | UIView)[]) {
        let self = this;
        if (views == undefined || views == null || views.length == 0) {
            //关闭所有界面
            if (DEBUG) Log.e(`请检查参数，至少需要保留一个界面，不然就黑屏了，大兄弟`);
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
    public closeBundleView(bundle: BUNDLE_TYPE) {
        let self = this;
        this._viewDatas.forEach((viewData, key) => {
            if (viewData.bundle == bundle) {
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
                if (DEBUG) Log.d(`${this.module}hide view : ${viewData.loadData.name}`);
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

    public addComponent<T extends Component>(type: { new(): T }): T;
    public addComponent(className: string): any;
    public addComponent(data: any) {
        let root = this.componentRoot;
        if (root) {
            let component = root.getComponent(data);
            if (component) {
                if (typeof data == "string") {
                    if (DEBUG) Log.w(`${this.module}已经存在 Component ${component}`)
                }
                else {
                    if (DEBUG) Log.w(`${this.module}已经存在 Component ${js.getClassName(data)}`);
                }
                return component;
            }
            else {
                return root.addComponent(data);
            }
        }
        return null;
    }

    public removeComponent(component: string | Component) {
        let root = this.componentRoot;
        if (root) {
            let comp = root.getComponent(component as any);
            if (comp) {
                comp.destroy();
            }
        }
    }

    debug(config : {showViews ?: boolean,showChildren ?: boolean,showComp ?: boolean}){
        if ( !config ){
            config = {};
            config.showChildren = true;
            config.showComp = true;
            config.showViews = true;
        }
        if ( config.showViews ){
            Log.d(`-----------当前所有视图------------`);
            this._viewDatas.forEach((value, key) => {
                Log.d(`[${key}] isLoaded : ${value.isLoaded} status : ${value.status} view : ${js.getClassName(value.view)} active : ${value.view && value.view.node ? value.view.node.active : false}`);
            });
        }
        if ( config.showChildren ){
            let root = this.viewRoot;
            if (root) {
                Log.d(`-----------当前所有节点信息------------`);
                let children = root.children;
                for (let i = 0; i < children.length; i++) {
                    let data = children[i];
                    Log.d(`${data.name} active : ${data.active}`);
                }
            }
        }
        if ( config.showComp ){
            let root: any = this.componentRoot;
            if (root) {
                Log.d(`-----------当前所有组件信息------------`);
                let comps: any[] = root._components;
                for (let i = 0; i < comps.length; i++) {
                    Log.d(js.getClassName(comps[i]));
                }
            }
        }
    }
}
import { Asset} from "cc";
import { DEBUG } from "cc/env";
import { Resource } from "./Resource";

/**
 * @description 资源加载器
 */
export default class ResourceLoader {

    /** @description 加载资源数据 */
    private _resources: Resource.Data[] = [];
    /**@description 当前已经加载的资源数量 */
    private _loadedCount: number = 0;

    /**@description 加载完成后的数据，为了方便释放时精准释放，没加载成功的资源，不在做释放的判断 */
    private _loadedResource: Map<string, Resource.Cache> = new Map<string, Resource.Cache>();

    /**@description 当前是否正在加载资源 */
    private _isLoading: boolean = false;

    /**@description 标识 */
    private _tag: string = null!;
    public get tag() {
        return this._tag;
    }
    public set tag(tag: string) {
        this._tag = tag;
    }

    /**@description 加载完成回调 */
    private _onLoadComplete?: (error: Resource.LoaderError) => void;
    public set onLoadComplete(cb) {
        this._onLoadComplete = cb;
    }
    public get onLoadComplete() {
        return this._onLoadComplete;
    }

    /**@description 加载进度 */
    public _onLoadProgress?: (loadedCount: number, toatl: number, data: Resource.Cache) => void;
    public set onLoadProgress(value) {
        this._onLoadProgress = value;
    }
    public get onLoadProgress() {
        return this._onLoadProgress;
    }


    /**
     * @description 实现类必须给个需要加载资源
     */
    private _getLoadResource?: () => Resource.Data[];
    public set getLoadResources(func) {
        this._getLoadResource = func;
    }
    public get getLoadResources() {
        return this._getLoadResource;
    }

    /**
     * @description 加载资源
     */
    public loadResources() {

        if (!this.getLoadResources) {
            if (DEBUG) Log.e("未指定 getLoadResources 函数");
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }

        let res = this.getLoadResources();
        if (!res) {
            if (DEBUG) Log.e(`未指定加载资源`);
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }
        if (res.length <= 0) {
            if (DEBUG) Log.w(`加载的资源为空`);
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }

        //如果正在加载中，防止重复调用
        if (this._isLoading) {
            if (DEBUG) Log.w(`资源加载中，未完成加载`);
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.LOADING);
            return;
        }

        if (this._resources.length > 0 && this.isLoadComplete()) {
            if (DEBUG) Log.w(`资源已经加载完成，使用已经加载完成的资源`);
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.SUCCESS);
            this.onLoadResourceComplete();
            return;
        }

        this._isLoading = true;
        this._resources = res;
        this._loadedCount = 0;
        this._resources.forEach((value, key, source) => {
            if (value.preloadView) {
                App.uiManager.preload(value.preloadView, value.bundle as BUNDLE_TYPE ,value.isCache).then((view) => {
                    let cache = new Resource.Cache(value.url!, value.type!, value.bundle!);
                    cache.isLoaded = true;
                    cache.data = <any>view;
                    if (value.preloadView) cache.url = value.preloadView.getPrefabUrl();
                    cache.bundle = value.bundle as BUNDLE_TYPE;
                    this._onLoadResourceComplete(cache);
                })
            } else if (value.dir) {
                App.asset.loadDir(value.bundle as BUNDLE_TYPE, value.dir, <any>(value.type), <any>null, this._onLoadResourceComplete.bind(this));
            } else {
                App.asset.load(value.bundle as BUNDLE_TYPE, value.url as string, <any>(value.type), <any>null, this._onLoadResourceComplete.bind(this));
            }
        });
    }

    /**
     * @description 卸载已经加载资源资源
     */
    public unLoadResources() {
        this._unLoadResources();
    }

    private _unLoadResources() {
        if (this._isLoading || this._resources.length <= 0) {
            //当前正在加载中
            if (this._isLoading) {
                Log.d("resources is loading , waiting for unload!!!");
            }
            return;
        }

        this._resources.forEach((value) => {
            if (value.url) {
                let url = Resource.getKey(value.url, value.type!);
                url = `${value.bundle}/${url}`;
                if (this._loadedResource.has(url)) {
                    let data = this._loadedResource.get(url);
                    if (data) {
                        App.asset.releaseAsset(data);
                    }
                    this._loadedResource.delete(url);
                }
            } else if (value.dir) {
                let url = Resource.getKey(value.dir, value.type!);
                url = `${value.bundle}/${url}`;
                if (this._loadedResource.has(url)) {
                    let data = this._loadedResource.get(url);
                    if (data) {
                        App.asset.releaseAsset(data);
                    }
                    this._loadedResource.delete(url);
                }
            }
        });
        //重置标记
        this._isLoading = false;
        this._loadedCount = 0;
        this._resources = []
    }

    private _onLoadResourceComplete(data: Resource.Cache) {
        this._loadedCount++;

        if (this._onLoadProgress) {
            if (this._loadedCount > this._resources.length) {
                this._loadedCount = this._resources.length;
            }
            //cc.log(`----------loadprogress ${this._loadedCount} / ${this._resources.length}--------------`);
            this._onLoadProgress(this._loadedCount, this._resources.length, data);
        }

        if (data && (Array.isArray(data.data) || data.data instanceof Asset)) {
            //排除掉界面管理器
            App.asset.retainAsset(data);
            this._loadedResource.set(`${data.bundle}/${data.key}`, data);
        }

        this.checkLoadResourceComplete();
    }
    /**
     * @description 资源加载完成
     */
    protected checkLoadResourceComplete() {
        //抛出事件给业务逻辑处理
        if (this.isLoadComplete()) {
            //加载完成
            this._isLoading = false;

            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.SUCCESS);
            this.onLoadResourceComplete();
        }
    }

    /**@description 加载资源完成 */
    protected onLoadResourceComplete() {

    }

    public isLoadComplete(): boolean {
        return this._loadedCount >= this._resources.length;
    }

}
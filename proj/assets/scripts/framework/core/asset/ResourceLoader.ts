import { Resource } from "./Resource";

/**
 * @description 资源加载器
 */
export default class ResourceLoader {

    /** @description 加载资源数据 */
    private _resources: Map<string,Resource.Data> = new Map<string,Resource.Data>();
    /**@description 当前已经加载的资源数量 */
    private _loadedCount: number = 0;

    /**@description 加载完成后的数据，为了方便释放时精准释放，没加载成功的资源，不在做释放的判断 */
    private _loadedResource: Map<string,Resource.Info>  = new Map<string,Resource.Info>();

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
    public _onLoadProgress?: (loadedCount: number, toatl: number, data: Resource.CacheData) => void;
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
            if (CC_DEBUG) Log.e("未指定 getLoadResources 函数");
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }

        let res = this.getLoadResources();
        if (!res) {
            if (CC_DEBUG) Log.e(`未指定加载资源`);
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }
        if (res.length <= 0) {
            if (CC_DEBUG) Log.w(`加载的资源为空`);
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }

        //如果正在加载中，防止重复调用
        if (this._isLoading) {
            if (CC_DEBUG) Log.w(`资源加载中，未完成加载`);
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.LOADING);
            return;
        }

        if (this._resources.size > 0 && this.isLoadComplete()) {
            if (CC_DEBUG) Log.w(`资源已经加载完成，使用已经加载完成的资源`);
            this.onLoadComplete && this.onLoadComplete(Resource.LoaderError.SUCCESS);
            this.onLoadResourceComplete();
            return;
        }

        this._isLoading = true;
        //为防止重复，这里把资源放在一个map中
        res.forEach((value, index) => {
            if (value.url) {
                this._resources.set(value.url, value);
            } else if (value.dir) {
                this._resources.set(value.dir, value);
            } else {
                if (value.preloadView) this._resources.set(value.preloadView.getPrefabUrl(), value);
            }
        });

        this._loadedCount = 0;
        this._resources.forEach((value, key, source) => {
            if (value.preloadView) {
                Manager.uiManager.preload(value.preloadView, value.bundle as BUNDLE_TYPE).then((view) => {
                    let cache = new Resource.CacheData();
                    cache.isLoaded = true;
                    cache.data = <any>view;
                    if (value.preloadView) cache.info.url = value.preloadView.getPrefabUrl();
                    cache.info.bundle = value.bundle as BUNDLE_TYPE;
                    this._onLoadResourceComplete(cache);
                })
            } else if (value.dir) {
                Manager.assetManager.loadDir(value.bundle as BUNDLE_TYPE, value.dir, <any>(value.type), <any>null, this._onLoadResourceComplete.bind(this));
            } else {
                Manager.assetManager.load(value.bundle as BUNDLE_TYPE, value.url as string, <any>(value.type), <any>null, this._onLoadResourceComplete.bind(this));
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
        if (this._isLoading || this._resources.size <= 0) {
            //当前正在加载中
            if (this._isLoading) {
                Log.d("resources is loading , waiting for unload!!!");
            }
            return;
        }
        if (this._resources.size > 0) {
            this._resources.forEach((value) => {
                if (value.url) {
                    if (this._loadedResource.has(value.url)) {
                        let data = this._loadedResource.get(value.url);
                        if (data) {
                            Manager.assetManager.releaseAsset(data);
                        }
                        this._loadedResource.delete(value.url);
                    }
                } else if (value.dir) {
                    if (this._loadedResource.has(value.dir)) {
                        let data = this._loadedResource.get(value.dir);
                        if (data) {
                            Manager.assetManager.releaseAsset(data);
                        }
                        this._loadedResource.delete(value.dir);
                    }
                }
            });
        }
        //重置标记
        this._isLoading = false;
        this._loadedCount = 0;
        this._resources.clear();
    }

    private _onLoadResourceComplete(data: Resource.CacheData) {
        this._loadedCount++;

        if (this._onLoadProgress) {
            if (this._loadedCount > this._resources.size) {
                this._loadedCount = this._resources.size;
            }
            //cc.log(`----------loadprogress ${this._loadedCount} / ${this._resources.length}--------------`);
            this._onLoadProgress(this._loadedCount, this._resources.size, data);
        }

        if (data && ( Array.isArray(data.data) || data.data instanceof cc.Asset ) ) {
            //排除掉界面管理器
            let info = new Resource.Info;
            info.url = data.info.url;
            info.type = data.info.type;
            info.data = data.data;
            info.bundle = data.info.bundle;
            Manager.assetManager.retainAsset(info);
            this._loadedResource.set(info.url, info);
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
        return this._loadedCount >= this._resources.size;
    }

}
import { ResourceData, ResourceCacheData, ResourceInfo } from "../base/Defines";
import { loader } from "./Loader";

export enum ResourceLoaderError {
    /**@description 加载中 */
    LOADING,
    /** @description 未找到或设置加载资源*/
    NO_FOUND_LOAD_RESOURCE,
    /**@description 完美加载 */
    SUCCESS,
}

/**
 * @description 资源加载器
 */
export default class ResourceLoader {

    /** @description 加载资源数据 */
    private _resources: Map<string,ResourceData> = new Map<string,ResourceData>();
    /**@description 当前已经加载的资源数量 */
    private _loadedCount: number = 0;

    /**@description 加载完成后的数据，为了方便释放时精准释放，没加载成功的资源，不在做释放的判断 */
    private _loadedResource: Map<string,ResourceInfo>  = new Map<string,ResourceInfo>();

    /**@description 当前是否正在加载资源 */
    private _isLoading: boolean = false;

    /**@description 标识 */
    private _tag: string = null;
    public get tag() {
        return this._tag;
    }
    public set tag(tag: string) {
        this._tag = tag;
    }

    /**@description 加载完成回调 */
    private _onLoadComplete: (error: ResourceLoaderError) => void = null;
    public set onLoadComplete(cb: (error: ResourceLoaderError) => void) {
        this._onLoadComplete = cb;
    }
    public get onLoadComplete() {
        return this._onLoadComplete;
    }

    /**@description 加载进度 */
    public _onLoadProgress: (loadedCount: number, toatl: number, data: ResourceCacheData) => void;
    public set onLoadProgress(value: (loadedCount: number, toatl: number, data: ResourceCacheData) => void) {
        this._onLoadProgress = value;
    }
    public get onLoadProgress() {
        return this._onLoadProgress;
    }


    /**
     * @description 实现类必须给个需要加载资源
     */
    private _getLoadResource: () => ResourceData[] = null;
    public set getLoadResources(func: () => ResourceData[]) {
        this._getLoadResource = func;
    }
    public get getLoadResources(): () => ResourceData[] {
        return this._getLoadResource;
    }

    /**
     * @description 加载资源
     */
    public loadResources() {

        if (!this.getLoadResources) {
            if (CC_DEBUG) cc.error("未指定 getLoadResources 函数");
            this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }

        let res = this.getLoadResources();
        if (!res) {
            if (CC_DEBUG) cc.error(`未指定加载资源`);
            this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }
        if (res.length <= 0) {
            if (CC_DEBUG) cc.warn(`加载的资源为空`);
            this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.NO_FOUND_LOAD_RESOURCE);
            return;
        }

        //如果正在加载中，防止重复调用
        if (this._isLoading) {
            if (CC_DEBUG) cc.warn(`资源加载中，未完成加载`);
            this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.LOADING);
            return;
        }

        if ( this._resources.size > 0 && this.isLoadComplete() ){
            if ( CC_DEBUG ) cc.warn(`资源已经加载完成，使用已经加载完成的资源`);
            this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.SUCCESS);
            this.onLoadResourceComplete();
            return;
        }

        this._isLoading = true;
        //为防止重复，这里把资源放在一个map中
        res.forEach((value,index)=>{
            if ( value.url ){
                this._resources.set(value.url,value);
            }else{
                if ( value.preloadView) this._resources.set(value.preloadView.getPrefabUrl(),value);
            }
        });

        this._loadedCount = 0;
        this._resources.forEach((value: ResourceData,key,source) => {
            if (value.url) {
                //先添加引用关系
                let info = new ResourceInfo;
                info.url = value.url;
                info.type = value.type;
                //cc.log(`load info url : ${info.url}`);
                loader().retainPreReference(info);
            }else{
                //预加载界面由UIManager管理
            }

            loader().loadRes(value, this._onLoadResourceComplete.bind(this));
        });
    }

    /**
     * @description 卸载已经加载资源资源
     */
    public unLoadResources() {
        this._unLoadResources();
    }

    private _unLoadResources() {
        if (this._isLoading || this._resources.size <= 0 ) {
            //当前正在加载中
            if (this._isLoading) {
                cc.log("resources is loading , waiting for unload!!!");
            }
            return;
        }
        if (this._resources.size > 0) {
            this._resources.forEach((value: ResourceData) => {
                if ( value.url ){
                    //解除预加载引用
                    let info = new ResourceInfo;
                    info.url = value.url;
                    info.type = value.type;
                    loader().releasePreReference(info);
                    if( this._loadedResource.has(value.url)){
                        let data = this._loadedResource.get(value.url);
                        if( data ){
                            loader().releaseAsset(data);
                        }
                        this._loadedResource.delete(value.url);
                    }
                }
            });
        }
        //重置标记
        this._isLoading = false;
        this._loadedCount = 0;
        this._resources.clear();
    }

    private _onLoadResourceComplete(data: ResourceCacheData) {
        this._loadedCount++;

        if (this._onLoadProgress) {
            if (this._loadedCount > this._resources.size) {
                this._loadedCount = this._resources.size;
            }
            //cc.log(`----------loadprogress ${this._loadedCount} / ${this._resources.length}--------------`);
            this._onLoadProgress(this._loadedCount, this._resources.size, data);
        }

        if (data && data.data instanceof cc.Asset ) {
            //排除掉界面管理器
            let info = new ResourceInfo;
            info.url = data.url;
            info.type = data.assetType;
            info.data = data.data;
            info.assetUrl = loader().getResourcePath(data.data);
            loader().retainAsset(info);
            this._loadedResource.set(info.url,info);
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

            this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.SUCCESS);
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
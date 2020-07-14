import { getSingleton } from "../base/Singleton";
import { ResourceCacheData, ResourceCacheStatus, ResourceInfo, BUNDLE_TYPE } from "../base/Defines";
import { cacheManager } from "./CacheManager";

/**@description 资源管理器 */
export function assetManager() {
    return getSingleton(AssetManager);
}

class AssetManager {
    private logTag = `[AssetManager]: `;
    private static _instance: AssetManager = null;
    public static Instance() {
        return this._instance || (this._instance = new AssetManager());
    }

    /**
     * @description 获取Bundle
     * @param bundle Bundle名|Bundle
     */
    public getBundle(bundle: BUNDLE_TYPE ) {
        if ( bundle ){
            if ( typeof bundle == "string" ){
                return cc.assetManager.getBundle(bundle);
            }
            return bundle;
        }
        return null;
    }

    public load(
        bundle: BUNDLE_TYPE,
        path: string,
        type: typeof cc.Asset,
        onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
        onComplete: (data:ResourceCacheData) => void): void {
            let cache = cacheManager().get(bundle,path);
            if ( cache ){
                //存在缓存信息
                if ( cache.isLoaded ){
                    //已经加载完成
                    if (CC_DEBUG && cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE ){
                        cc.warn(this.logTag, `资源:${path} 等待释放，但资源已经加载完成，此时有人又重新加载，不进行释放处理`);
                    }
                    //加载完成
                    onComplete(cache);
                }else{
                    if (CC_DEBUG && cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE ){
                        cc.warn(this.logTag, `资源:${path}等待释放，但资源处理加载过程中，此时有人又重新加载，不进行释放处理`);
                    }
                    cache.finishCb.push(onComplete);
                }
                //重新复位资源状态
                cache.status = ResourceCacheStatus.NONE;
            }else{
                //无缓存信息
                cache = new ResourceCacheData();
                cache.url = path;
                cache.assetType = type;
                cache.bundle = bundle;
                cacheManager().set(bundle,path,cache);
                cc.time(`加载资源 : ${cache.url}`);
                let _bundle = this.getBundle(bundle);
                if (!_bundle ){
                    //如果bundle不存在
                    let error = new Error(`${this.logTag} ${bundle} 没有加载，请先加载`);
                    this._onLoadComplete(cache,onComplete,error,null);
                    return;
                }
                let res = _bundle.get(path,type);
                if ( res ){
                    this._onLoadComplete(cache,onComplete,null,res);
                }else{
                    if ( onProgress ){
                        _bundle.load(path,type,onProgress,this._onLoadComplete.bind(this,cache,onComplete));
                    }else{
                        _bundle.load(path,type,this._onLoadComplete.bind(this,cache,onComplete));
                    }
                }
            }
    }

    private _onLoadComplete( cache : ResourceCacheData , completeCallback: (data: ResourceCacheData) => void,err:Error,data:cc.Asset){
        cache.isLoaded = true;
        //添加引用关系
        let tempCache = cache;
        if (err) {
            cc.error(`${this.logTag}加载资源失败:${cache.url} 原因:${err.message ? err.message : "未知"}`);
            cache.data = null;
            tempCache.data = null;
            cacheManager().remove(cache.bundle,cache.url);
            completeCallback(cache);
        }
        else {
            if (CC_DEBUG) cc.log(`${this.logTag}加载资源成功:${cache.url}`);
            cache.data = data;
            tempCache.data = data;
            completeCallback(cache);
        }

        //加载过程，有不同地方调用过来加载同一个资源的地方，都回调回去
        cache.doFinish(tempCache);
        cache.doGet(tempCache.data);

        if (cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
            if (CC_DEBUG) cc.warn(this.logTag, `资源:${cache.url}加载完成，但缓存状态为等待销毁，销毁资源`);
            if (cache.data) {
                cache.status = ResourceCacheStatus.NONE;
                let info = new ResourceInfo;
                info.url = cache.url;
                info.type = cache.assetType;
                info.data = cache.data;
                info.bundle = cache.bundle;
                this.releaseAsset(info);
            }
        }

        cc.timeEnd(`加载资源 : ${cache.url}`);
    }

    public releaseAsset( info : ResourceInfo ){
        if ( info.bundle ){
            cacheManager().remove(info.bundle,info.url);
            let bundle = this.getBundle(info.bundle);
            if ( bundle ){
                bundle.release(info.url,info.type);
            }
        }
    }

}
import { ResourceCacheData, ResourceCacheStatus, ResourceInfo, BUNDLE_TYPE, ResourceType, BUNDLE_REMOTE } from "../base/Defines";
import { Manager } from "../Framework";

class RemoteLoader {

    private _logTag = `[RemoteLoader] `;
    private static _instance: RemoteLoader = null;
    public static Instance() { return this._instance || (this._instance = new RemoteLoader()); }

    public loadImage(url: string, isNeedCache: boolean) {
        let me = this;
        return new Promise<cc.SpriteFrame>((resolve) => {
            if (url == null || url == undefined || url.length <= 0) {
                resolve(null);
                return;
            }
            let spCache = Manager.cacheManager.remoteCaches.getSpriteFrame(url);
            if (spCache && spCache.data) {
                if (CC_DEBUG) cc.log(this._logTag, `从缓存精灵帧中获取:${url}`);
                resolve(<cc.SpriteFrame>(spCache.data));
                return;
            }

            me._loadRemoteRes(url,cc.Texture2D , isNeedCache).then((data: any) => {
                //改变缓存类型
                let cache = Manager.cacheManager.remoteCaches.get(url);
                if (data && cache) {
                    if (CC_DEBUG) cc.log(`${this._logTag}加载图片完成${url}`);
                    cache.data = data;
                    cache.data.name = url;
                    let spriteFrame = Manager.cacheManager.remoteCaches.setSpriteFrame(url, cache.data);
                    resolve(spriteFrame);
                } else {
                    if (CC_DEBUG) cc.warn(`${this._logTag}加载图片错误${url}`);
                    resolve(null);
                }
            })
        });
    }

    public loadSkeleton(path: string, name: string, isNeedCache: boolean) {
        let me = this;
        return new Promise<sp.SkeletonData>((resolve) => {
            if (path && name) {
                let url = `${path}/${name}`;
                let spineAtlas = `${path}/${name}.atlas`;
                let spinePng = `${path}/${name}.png`;
                let spineJson = `${path}/${name}.json`;
                let cache = Manager.cacheManager.remoteCaches.get(url);
                if (cache) {
                    if ( cache.isLoaded ){
                        resolve(<sp.SkeletonData>(cache.data));
                    }else{
                        cache.finishCb.push(resolve);
                    }
                } else {
                    cache = new ResourceCacheData();
                    cache.resourceType = ResourceType.Remote;
                    cache.assetType = sp.SkeletonData;
                    cache.bundle = BUNDLE_REMOTE;
                    Manager.cacheManager.remoteCaches.set(url,cache);
                    me._loadRemoteRes(spinePng,cc.Texture2D, isNeedCache).then((texture:cc.Texture2D) => {
                        if (texture) {
                            me._loadRemoteRes(spineJson,cc.JsonAsset, isNeedCache).then((json:cc.JsonAsset) => {
                                if (json) {
                                    me._loadRemoteRes(spineAtlas,cc.JsonAsset, isNeedCache).then((atlas:cc.TextAsset) => {
                                        if (atlas) {
                                            //生成SkeletonData数据
                                            let asset = new sp.SkeletonData;
                                            asset.skeletonJson = json.json;
                                            asset.atlasText = atlas.text;
                                            asset.textures = [texture];
                                            let pngName = name + ".png"
                                            asset["textureNames"] = [pngName];

                                            cache.url = url;
                                            asset.name = cache.url;
                                            cache.data = asset;
                                            cache.isLoaded = true;
                                            resolve(<sp.SkeletonData>(cache.data));
                                            cache.doFinish(cache.data);
                                        } else {
                                            resolve(null);
                                            cache.doFinish(null);
                                            Manager.cacheManager.remoteCaches.remove(url);
                                        }
                                    });
                                } else {
                                    resolve(null);
                                    cache.doFinish(null);
                                    Manager.cacheManager.remoteCaches.remove(url);
                                }
                            });
                        } else {
                            resolve(null);
                            cache.doFinish(null);
                            Manager.cacheManager.remoteCaches.remove(url);
                        }
                    })
                }
            } else {
                resolve(null);
            }
        });
    }

    private _loadRemoteRes(url: string,type : typeof cc.Asset ,isNeedCache: boolean) {
        return new Promise<any>((resolve) => {
            let cache = Manager.cacheManager.remoteCaches.get(url);
            if (cache) {
                //有缓存,查看是否已经加载
                if (cache.isLoaded) {
                    //如果已经加载完成
                    resolve(cache.data);
                } else {
                    //正在加载中
                    cache.finishCb.push(resolve);
                }
            } else {
                //没有缓存存在,生成加载缓存
                cache = new ResourceCacheData();
                cache.resourceType = ResourceType.Remote;
                cache.assetType = type;
                Manager.cacheManager.remoteCaches.set(url, cache);
                cc.assetManager.loadRemote(url,(error,data)=>{
                    cache.isLoaded = true;
                    if (data) {
                        cache.data = data;
                        if ( CC_DEBUG ) cc.log(`${this._logTag}加载远程资源完成:${url}`);
                    }
                    else {
                        if (CC_DEBUG) cc.warn(`${this._logTag}加载本地资源异常:${url}`);
                    }
                    //把再加载过程里，双加载同一资源的回调都回调回去
                    cache.doFinish(data);
                    resolve(cache.data)
                })
            }
        });
    }

    /**@description 由主游戏控制器驱动，在下载远程资源时，设置一个上限下载任务数据，以免同一时间任务数量过大 */
    update(){
        
    }
}


export class AssetManager {
    private logTag = `[AssetManager]: `;
    private static _instance: AssetManager = null;
    public static Instance() {
        return this._instance || (this._instance = new AssetManager());
    }

    private _remote = new RemoteLoader();
    public get remote(){ return this._remote;}
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
            let cache = Manager.cacheManager.get(bundle,path);
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
                Manager.cacheManager.set(bundle,path,cache);
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
            Manager.cacheManager.remove(cache.bundle,cache.url);
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
            Manager.cacheManager.remove(info.bundle,info.url);
            let bundle = this.getBundle(info.bundle);
            if ( bundle ){
                bundle.release(info.url,info.type);
            }
        }
    }

}
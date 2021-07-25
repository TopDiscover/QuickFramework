import { Asset, assetManager, AssetManager, JsonAsset, TextAsset, Texture2D, sp, SpriteFrame, ImageAsset } from "cc";
import { DEBUG } from "cc/env";
import { ResourceCacheData, ResourceCacheStatus, ResourceInfo, BUNDLE_TYPE, ResourceType, BUNDLE_REMOTE } from "../base/Defines";

class RemoteLoader {

    private _logTag = `[RemoteLoader] `;
    private static _instance: RemoteLoader = null!;
    public static Instance() { return this._instance || (this._instance = new RemoteLoader()); }

    public loadImage(url: string, isNeedCache: boolean) {
        let me = this;
        return new Promise<SpriteFrame | null>((resolve) => {
            if (url == null || url == undefined || url.length <= 0) {
                resolve(null);
                return;
            }
            let spCache = Manager.cacheManager.remoteCaches.getSpriteFrame(url);
            if (spCache && spCache.data) {
                if (DEBUG) log(this._logTag, `从缓存精灵帧中获取:${url}`);
                resolve(<SpriteFrame>(spCache.data));
                return;
            }

            me._loadRemoteRes(url, Texture2D, isNeedCache).then((data: any) => {
                //改变缓存类型
                let cache = Manager.cacheManager.remoteCaches.get(url);
                if (data && cache) {
                    if (DEBUG) log(`${this._logTag}加载图片完成${url}`);
                    cache.data = data;
                    (<Asset>cache.data).name = url;
                    let spriteFrame = Manager.cacheManager.remoteCaches.setSpriteFrame(url, cache.data);
                    resolve(spriteFrame);
                } else {
                    if (DEBUG) warn(`${this._logTag}加载图片错误${url}`);
                    resolve(null);
                }
            })
        });
    }

    public loadSkeleton(path: string, name: string, isNeedCache: boolean) {
        let me = this;
        return new Promise<sp.SkeletonData | null>((resolve) => {
            if (path && name) {
                let url = `${path}/${name}`;
                let spineAtlas = `${path}/${name}.atlas`;
                let spinePng = `${path}/${name}.png`;
                let spineJson = `${path}/${name}.json`;
                let cache = Manager.cacheManager.remoteCaches.get(url);
                if (cache) {
                    if (cache.isLoaded) {
                        resolve(<sp.SkeletonData>(cache.data));
                    } else {
                        cache.finishCb.push(resolve);
                    }
                } else {
                    cache = new ResourceCacheData();
                    cache.info.resourceType = ResourceType.Remote;
                    cache.info.type = sp.SkeletonData;
                    cache.info.bundle = BUNDLE_REMOTE;
                    Manager.cacheManager.remoteCaches.set(url, cache);
                    me._loadRemoteRes(spinePng, Asset, isNeedCache).then((image: ImageAsset) => {
                        if (image) {
                            me._loadRemoteRes(spineJson, JsonAsset, isNeedCache).then((json: JsonAsset) => {
                                if (json) {
                                    me._loadRemoteRes(spineAtlas, JsonAsset, isNeedCache).then((atlas: TextAsset) => {
                                        if (atlas) {
                                            //生成SkeletonData数据
                                            let asset = new sp.SkeletonData;
                                            asset.skeletonJson = json.json;
                                            asset.atlasText = atlas.text;
                                            let texture = new Texture2D();
                                            texture.image = image;
                                            asset.textures = [texture];
                                            let pngName = name + ".png"
                                            asset.textureNames = [pngName];
                                            cache = cache as ResourceCacheData;
                                            cache.info.url = url;
                                            asset.name = url;
                                            cache.data = asset;
                                            cache.isLoaded = true;
                                            resolve(<sp.SkeletonData>(cache.data));
                                            cache.doFinish(cache.data);
                                        } else {
                                            resolve(null);
                                            cache = cache as ResourceCacheData;
                                            cache.doFinish(null);
                                            Manager.cacheManager.remoteCaches.remove(url);
                                        }
                                    });
                                } else {
                                    resolve(null);
                                    cache = cache as ResourceCacheData;
                                    cache.doFinish(null);
                                    Manager.cacheManager.remoteCaches.remove(url);
                                }
                            });
                        } else {
                            resolve(null);
                            cache = cache as ResourceCacheData;
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

    private _loadRemoteRes(url: string, type: typeof Asset, isNeedCache: boolean) {
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
                cache.info.resourceType = ResourceType.Remote;
                cache.info.type = type;
                Manager.cacheManager.remoteCaches.set(url, cache);
                assetManager.loadRemote(url,{cacheAsset : isNeedCache } ,  (error, data) => {
                    if (cache) {
                        cache.isLoaded = true;
                        if (data) {
                            cache.data = data;
                            (<Asset>cache.data).addRef();
                            if (DEBUG) log(`${this._logTag}加载远程资源完成:${url}`);
                        }
                        else {
                            if (DEBUG) warn(`${this._logTag}加载本地资源异常:${url}`);
                        }
                        //把再加载过程里，双加载同一资源的回调都回调回去
                        cache.doFinish(data);
                        resolve(cache.data)
                    }
                })
            }
        });
    }

    /**@description 由主游戏控制器驱动，在下载远程资源时，设置一个上限下载任务数据，以免同一时间任务数量过大 */
    update() {

    }
}


export class _AssetManager {
    private logTag = `[AssetManager]: `;
    private static _instance: _AssetManager = null!;
    public static Instance() {
        return this._instance || (this._instance = new _AssetManager());
    }

    private _remote = new RemoteLoader();
    public get remote() { return this._remote; }
    /**
     * @description 获取Bundle
     * @param bundle Bundle名|Bundle
     */
    public getBundle(bundle: BUNDLE_TYPE) {
        if (bundle) {
            if (typeof bundle == "string") {
                return assetManager.getBundle(bundle);
            }
            return bundle;
        }
        return null;
    }

    public getBundleName( bundle : BUNDLE_TYPE ) : string | null{
        if( bundle ){
            if( typeof bundle == "string" ){
                return bundle;
            }else{
                return bundle.name;
            }
        }
        return null;
    }

    /**@description 加载bundle */
    public loadBundle(nameOrUrl: string, onComplete: (err: Error, bundle: AssetManager.Bundle) => void): void {
        assetManager.loadBundle(nameOrUrl, onComplete);
    }

    /**@description 移除bundle */
    public removeBundle(bundle: BUNDLE_TYPE) {
        let result = this.getBundle(bundle);
        if (result) {
            Manager.cacheManager.removeBundle(bundle);
            result.releaseAll();
            assetManager.removeBundle(result);
        }
    }

    public load(
        bundle: BUNDLE_TYPE,
        path: string,
        type: typeof Asset,
        onProgress: (finish: number, total: number, item: AssetManager.RequestItem) => void,
        onComplete: (data: ResourceCacheData) => void): void {
        if (DEBUG) {
            log(`load bundle : ${bundle} path : ${path}`)
        }
        let cache = Manager.cacheManager.get(bundle, path);
        if (cache) {
            //存在缓存信息
            if (cache.isLoaded) {
                //已经加载完成
                if (DEBUG && cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
                    warn(this.logTag, `资源:${path} 等待释放，但资源已经加载完成，此时有人又重新加载，不进行释放处理`);
                }
                //加载完成
                onComplete(cache);
            } else {
                if (DEBUG && cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
                    warn(this.logTag, `资源:${path}等待释放，但资源处理加载过程中，此时有人又重新加载，不进行释放处理`);
                }
                cache.finishCb.push(onComplete);
            }
            //重新复位资源状态
            cache.status = ResourceCacheStatus.NONE;
        } else {
            //无缓存信息
            cache = new ResourceCacheData();
            cache.info.url = path;
            cache.info.type = type;
            cache.info.bundle = bundle;
            Manager.cacheManager.set(bundle, path, cache);
            console.time(`加载资源 : ${cache.info.url}`);
            let _bundle = this.getBundle(bundle);
            if (!_bundle) {
                //如果bundle不存在
                let error = new Error(`${this.logTag} ${bundle} 没有加载，请先加载`);
                this._onLoadComplete(cache, onComplete, error, null);
                return;
            }
            let res = _bundle.get(path, type);
            if (res) {
                this._onLoadComplete(cache, onComplete, null, res);
            } else {
                if (onProgress) {
                    _bundle.load(path, type, onProgress, this._onLoadComplete.bind(this, cache, onComplete));
                } else {
                    _bundle.load(path, type, this._onLoadComplete.bind(this, cache, onComplete));
                }
            }
        }
    }

    private _onLoadComplete(cache: ResourceCacheData, completeCallback: (data: ResourceCacheData) => void, err: Error | null, data: Asset | Asset[] | null) {
        cache.isLoaded = true;
        //添加引用关系
        let tempCache = cache;
        if (err) {
            error(`${this.logTag}加载资源失败:${cache.info.url} 原因:${err.message ? err.message : "未知"}`);
            cache.data = null;
            tempCache.data = null;
            Manager.cacheManager.remove(cache.info.bundle, cache.info.url);
            completeCallback(cache);
        }
        else {
            if (DEBUG) log(`${this.logTag}加载资源成功:${cache.info.url}`);
            cache.data = data;
            tempCache.data = data;
            completeCallback(cache);
        }

        //加载过程，有不同地方调用过来加载同一个资源的地方，都回调回去
        cache.doFinish(tempCache);
        cache.doGet(tempCache.data);

        if (cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
            if (DEBUG) warn(this.logTag, `资源:${cache.info.url}加载完成，但缓存状态为等待销毁，销毁资源`);
            if (cache.data) {
                cache.status = ResourceCacheStatus.NONE;
                let info = new ResourceInfo;
                info.url = cache.info.url;
                info.type = cache.info.type;
                info.data = cache.data;
                info.bundle = cache.info.bundle;
                this.releaseAsset(info);
            }
        }

        console.timeEnd(`加载资源 : ${cache.info.url}`);
    }

    public loadDir(
        bundle: BUNDLE_TYPE,
        path: string,
        type: typeof Asset,
        onProgress: (finish: number, total: number, item: AssetManager.RequestItem) => void,
        onComplete: (data: ResourceCacheData) => void): void {
        if (DEBUG) {
            log(`load bundle : ${bundle} path : ${path}`)
        }
        let cache = Manager.cacheManager.get(bundle, path);
        if (cache) {
            //存在缓存信息
            if (cache.isLoaded) {
                //已经加载完成
                if (DEBUG && cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
                    warn(this.logTag, `资源:${path} 等待释放，但资源已经加载完成，此时有人又重新加载，不进行释放处理`);
                }
                //加载完成
                onComplete(cache);
            } else {
                if (DEBUG && cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
                    warn(this.logTag, `资源:${path}等待释放，但资源处理加载过程中，此时有人又重新加载，不进行释放处理`);
                }
                cache.finishCb.push(onComplete);
            }
            //重新复位资源状态
            cache.status = ResourceCacheStatus.NONE;
        } else {
            //无缓存信息
            cache = new ResourceCacheData();
            cache.info.url = path;
            cache.info.type = type;
            cache.info.bundle = bundle;
            Manager.cacheManager.set(bundle, path, cache);
            console.time(`加载资源 : ${cache.info.url}`);
            let _bundle = this.getBundle(bundle);
            if (!_bundle) {
                //如果bundle不存在
                let error = new Error(`${this.logTag} ${bundle} 没有加载，请先加载`);
                this._onLoadComplete(cache, onComplete, error, null);
                return;
            }
            if (onProgress) {
                _bundle.loadDir(path, type, onProgress, this._onLoadComplete.bind(this, cache, onComplete));
            } else {
                _bundle.loadDir(path, type, this._onLoadComplete.bind(this, cache, onComplete));
            }
        }
    }

    public releaseAsset(info: ResourceInfo) {
        if (info && info.bundle) {
            let cache = Manager.cacheManager.get(info.bundle, info.url, false);
            if (!cache) {
                return;
            } else {
                if (cache.isInvalid) {
                    if (DEBUG) warn(`资源已经释放 url : ${info.url}`);
                    return;
                }
            }
            if (cache.isLoaded) {
                if (cache.info.retain) {
                    if (DEBUG) log(`常驻资源 url : ${cache.info.url}`);
                    return;
                }
                if (DEBUG) log(`释放资源 : ${info.bundle}.${info.url}`);

                if (Manager.cacheManager.removeWithInfo(info)) {
                    let bundle = this.getBundle(info.bundle);
                    if (bundle) {
                        if (Array.isArray(info.data)) {
                            for (let i = 0; i < info.data.length; i++) {
                                let path = `${info.url}/${info.data[i].name}`;
                                bundle.release(path, info.type);
                            }
                            if (DEBUG) log(`成功释放资源目录 : ${info.bundle}.${info.url}`);
                        } else {
                            bundle.release(info.url, info.type);
                            if (DEBUG) log(`成功释放资源 : ${info.bundle}.${info.url}`);
                        }
                    } else {
                        error(`${info.bundle} no found`);
                    }
                } else {
                    if (DEBUG) {
                        if (Array.isArray(info.data)) {
                            for (let i = 0; i < info.data.length; i++) {
                                if (info.data[i].refCount != 0) {
                                    warn(`资源bundle : ${info.bundle} url : ${info.url}/${info.data[i].name} 被其它界面引用 refCount : ${info.data[i].refCount}`)
                                }
                            }
                        } else {
                            warn(`资源bundle : ${info.bundle} url : ${info.url} 被其它界面引用 refCount : ${info.data.refCount}`)
                        }
                    }
                }
            } else {
                cache.status = ResourceCacheStatus.WAITTING_FOR_RELEASE;
                if (DEBUG) warn(`${cache.info.url} 正在加载，等待加载完成后进行释放`);
            }

        }
    }

    public retainAsset(info: ResourceInfo) {
        if (info) {
            let cache = Manager.cacheManager.get(info.bundle, info.url)
            if (cache) {
                if (DEBUG) {
                    if (info.data != cache.data) {
                        error(`错误的retainAsset :${info.url}`);
                    }
                }
                if (!cache.info.retain) {
                    cache.info.retain = info.retain;
                }
                if (Array.isArray(cache.data)) {
                    //里面是数组 
                    for (let i = 0; i < cache.data.length; i++) {
                        cache.data[i] && cache.data[i].addRef();
                    }
                } else {
                    cache.data && cache.data.addRef();
                }
            } else {
                if (DEBUG) error(`retainAsset cache.data is null`);
            }
        } else {
            if (DEBUG) error(`retainAsset info is null`);
        }
    }

    /**
     * @description 添加常驻资源
     * @param prefab 
     */
    public addPersistAsset(url: string, data: Asset, bundle: BUNDLE_TYPE) {
        let info = new ResourceInfo;
        info.url = url;
        info.data = data;
        info.bundle = bundle;
        info.retain = true;
        this.retainAsset(info);
    }
}
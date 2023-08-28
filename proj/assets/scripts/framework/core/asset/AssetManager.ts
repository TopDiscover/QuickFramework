import { Macro } from "../../defines/Macros";
import { Resource } from "./Resource";

class RemoteLoader {

    private _logTag = `[RemoteLoader] `;

    public loadImage(url: string, isNeedCache: boolean) {
        let me = this;
        return new Promise<[Resource.Cache,cc.SpriteFrame]>((resolve) => {
            if (url == null || url == undefined || url.length <= 0) {
                resolve([null,null]);
                return;
            }
            let key = Resource.getKey(url,cc.SpriteFrame);
            if (isNeedCache) {
                //从释放缓存中取
                let spCache = App.releaseManger.getRemote(key);
                if ( spCache ){
                    if (CC_DEBUG) Log.d(this._logTag, `从待释放缓存精灵帧中获取:${key}`);
                    resolve([spCache,<cc.SpriteFrame>(spCache.data)]);
                    return 
                }
                //如果存在缓存 ，直接取出
                spCache = App.cache.remoteCaches.getSpriteFrame(key);
                if (spCache && spCache.data) {
                    if (CC_DEBUG) Log.d(this._logTag, `从缓存精灵帧中获取:${key}`);
                    resolve([spCache,<cc.SpriteFrame>(spCache.data)]);
                    return;
                } else {
                    //错误处理
                    if (CC_DEBUG) {
                        if (spCache) Log.d(this._logTag, `错误资源，删除缓存信息，重新加载:${key}`);
                    }
                    App.cache.remoteCaches.remove(key,cc.SpriteFrame);
                }
            } else {
                //不需要缓存，先删除之前的,再重新加载
                if (CC_DEBUG) Log.d(this._logTag, `不需要缓存信息，删除缓存，重新加载${key}`);
                App.releaseManger.getRemote(url);
                App.cache.remoteCaches.remove(url,cc.SpriteFrame);
            }

            me._loadRemoteRes(url, cc.Texture2D, isNeedCache).then(([cache,data]) => {
                //改变缓存类型
                let key = Resource.getKey(url,cc.Texture2D);
                cache = App.cache.remoteCaches.get(key);
                if (data && cache) {
                    if (CC_DEBUG) Log.d(`${this._logTag}加载图片完成${key}`);
                    cache.data = data;
                    (<cc.Asset>cache.data).name = url;
                    resolve(App.cache.remoteCaches.setSpriteFrame(url, cache.data));
                } else {
                    if (CC_DEBUG) Log.w(`${this._logTag}加载图片错误${url}`);
                    resolve(null);
                }
            })
        });
    }

    public loadSkeleton(path: string, name: string, isNeedCache: boolean) {
        let me = this;
        return new Promise<[Resource.Cache,sp.SkeletonData]>((resolve) => {
            if (path && name) {
                let url = `${path}/${name}`;
                let spineAtlas = `${path}/${name}.atlas`;
                let spinePng = `${path}/${name}.png`;
                let spineJson = `${path}/${name}.json`;
                let cache = App.releaseManger.getRemote(url);
                if (cache) {
                    //从释放队列中获取,如果有值，直接使用
                    resolve([cache,<sp.SkeletonData>cache.data]);
                    return;
                    // let cache = App.cache.remoteCaches.get(url);
                    // if (cache) {
                    //     cache.isLoaded = true;
                    //     cache.data = res;
                    //     cache.info.data = res;
                    //     cache.info.url = url;
                    //     resolve(<sp.SkeletonData>(cache.data));
                    //     cache.doFinish(cache.data);
                    // } else {
                    //     cache = new Resource.Cache();
                    //     cache.info.resourceType = Resource.Type.Remote;
                    //     cache.info.type = sp.SkeletonData;
                    //     cache.info.bundle = Macro.BUNDLE_REMOTE;
                    //     cache.isLoaded = true;
                    //     cache.data = res;
                    //     cache.info.data = res;
                    //     cache.info.url = url;
                    //     App.cache.remoteCaches.set(url, cache);
                    //     resolve(<sp.SkeletonData>(cache.data));
                    //     cache.doFinish(cache.data);
                    // }
                    return;
                }
                cache = App.cache.remoteCaches.get(url);
                if (cache) {
                    if (cache.isLoaded) {
                        resolve([cache,<sp.SkeletonData>(cache.data)]);
                    } else {
                        cache.finishCb.push(resolve);
                    }
                } else {
                    cache = new Resource.Cache(url,sp.SkeletonData,Macro.BUNDLE_REMOTE);
                    cache.resourceType = Resource.Type.Remote;
                    App.cache.remoteCaches.set(cache);
                    me._loadRemoteRes(spinePng, cc.Texture2D, isNeedCache).then((texture: cc.Texture2D) => {
                        if (texture) {
                            me._loadRemoteRes(spineJson, cc.JsonAsset, isNeedCache).then((json: cc.JsonAsset) => {
                                if (json) {
                                    me._loadRemoteRes(spineAtlas, cc.JsonAsset, isNeedCache).then((atlas: cc.TextAsset) => {
                                        if (atlas) {
                                            //生成SkeletonData数据
                                            let asset = new sp.SkeletonData;
                                            asset.skeletonJson = json.json;
                                            asset.atlasText = atlas.text;
                                            asset.textures = [texture];
                                            let pngName = name + ".png"
                                            asset["textureNames"] = [pngName];

                                            cache.url = url;
                                            asset.name = url;
                                            cache.data = asset;
                                            cache.isLoaded = true;
                                            resolve([cache,<sp.SkeletonData>(cache.data)]);
                                            cache.doFinish(cache.data);
                                        } else {
                                            resolve(null);
                                            cache.doFinish(null);
                                            App.cache.remoteCaches.remove(url);
                                        }
                                    });
                                } else {
                                    resolve(null);
                                    cache.doFinish(null);
                                    App.cache.remoteCaches.remove(url);
                                }
                            });
                        } else {
                            resolve(null);
                            cache.doFinish(null);
                            App.cache.remoteCaches.remove(url);
                        }
                    })
                }
            } else {
                resolve(null);
            }
        });
    }

    private extname(url: string) {
        let value = url.match(/(\.[^\.\/\?\\]*)(\?.*)?$/);
        //如果找
        return value ? value[1] : ".png";
    }

    private _loadRemoteRes(url: string, type: typeof cc.Asset, isNeedCache: boolean, options: Record<string, any> = {}) {
        return new Promise<[Resource.Cache,any]>((resolve) => {
            let key = Resource.getKey(url,type);

            //先从待释放中取
            let cache = App.releaseManger.get(Macro.BUNDLE_REMOTE,key);
            if ( cache ){
                (<cc.Asset>cache.data).addRef();
                //把再加载过程里，双加载同一资源的回调都回调回去
                cache.doFinish();
                cache.doGet();
                resolve([cache,cache.data]);
                return;
            }

            //从缓存中取
            cache = App.cache.remoteCaches.get(key);
            if (cache) {
                //有缓存,查看是否已经加载
                if (cache.isLoaded) {
                    //如果已经加载完成
                    resolve([cache,cache.data]);
                } else {
                    //正在加载中
                    cache.finishCb.push(resolve);
                }
            } else {
                //没有缓存存在,生成加载缓存
                cache = new Resource.Cache(url,type,Macro.BUNDLE_REMOTE);
                cache.resourceType = Resource.Type.Remote;
                App.cache.remoteCaches.set(cache);
                options["cacheAsset"] = true;
                options["reloadAsset"] = !isNeedCache;
                if (type == cc.Texture2D) {
                    options.ext = this.extname(url);
                }
                cc.assetManager.loadRemote(url, options, (error, data) => {
                    if (cache) {
                        cache.isLoaded = true;
                        if (data) {
                            cache.data = data;
                            if (CC_DEBUG) Log.d(`${this._logTag}加载远程资源完成:${url}`);
                        }
                        else {
                            if (CC_DEBUG) Log.w(`${this._logTag}加载本地资源异常:${url}`);
                        }
                        //把再加载过程里，双加载同一资源的回调都回调回去
                        cache.doFinish();
                        cache.doGet();
                        resolve([cache,cache.data])
                    }
                })
            }
        });
    }

    /**@description 由主游戏控制器驱动，在下载远程资源时，设置一个上限下载任务数据，以免同一时间任务数量过大 */
    update() {

    }
}

export class AssetManager implements ISingleton {
    isResident?: boolean = true;
    static module: string = "【AssetManager】";
    module: string = null!;
    private _remote = new RemoteLoader();
    public get remote() { return this._remote; }
    /**
     * @description 获取Bundle
     * @param bundle Bundle名|Bundle
     */
    private getBundle(bundle: BUNDLE_TYPE) {
        return App.bundleManager.getBundle(bundle);
    }

    public load(
        bundle: BUNDLE_TYPE,
        url: string,
        type: typeof cc.Asset,
        onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
        onComplete: (data: Resource.Cache) => void): void {
        let key = Resource.getKey(url, type);
        if (CC_DEBUG) {
            Log.d(`load bundle : ${bundle} path : ${key}`)
        }
        //先到释放管理器中查找 
        let cache = App.releaseManger.get(bundle, key);
        if (cache) {
            console.time(`加载资源 : ${key}`);
            App.cache.set(cache);
            this._onLoadComplete(cache, onComplete, null, cache.data);
            return;
        }

        cache = App.cache.get(bundle, url, type);
        if (cache) {
            //存在缓存信息
            if (cache.isLoaded) {
                //已经加载完成
                if (CC_DEBUG && cache.status == Resource.CacheStatus.WAITTING_FOR_RELEASE) {
                    Log.w(this.module, `资源:${key} 等待释放，但资源已经加载完成，此时有人又重新加载，不进行释放处理`);
                }
                //加载完成
                onComplete(cache);
            } else {
                if (CC_DEBUG && cache.status == Resource.CacheStatus.WAITTING_FOR_RELEASE) {
                    Log.w(this.module, `资源:${key}等待释放，但资源处理加载过程中，此时有人又重新加载，不进行释放处理`);
                }
                cache.finishCb.push(onComplete);
            }
            //重新复位资源状态
            cache.status = Resource.CacheStatus.NONE;
        } else {
            //无缓存信息
            cache = new Resource.Cache(url,type,bundle);
            App.cache.set(cache);
            console.time(`加载资源 : ${key}`);

            let _bundle = this.getBundle(bundle);
            if (!_bundle) {
                //如果bundle不存在
                let error = new Error(`${this.module} ${bundle} 没有加载，请先加载`);
                this._onLoadComplete(cache, onComplete, error, null);
                return;
            }
            if (!type) {
                //如果bundle不存在
                let error = new Error(`${this.module} ${bundle} ${url} 加载没有指定资源类型`);
                this._onLoadComplete(cache, onComplete, error, null);
                return;
            }
            let res = _bundle.get(url, type);
            if (res) {
                this._onLoadComplete(cache, onComplete, null, res);
            } else {
                if (onProgress) {
                    _bundle.load(url, type, onProgress, this._onLoadComplete.bind(this, cache, onComplete));
                } else {
                    _bundle.load(url, type, this._onLoadComplete.bind(this, cache, onComplete));
                }
            }
        }
    }

    private _onLoadComplete(cache: Resource.Cache, complete: (data: Resource.Cache) => void, err: Error | null, data: cc.Asset | cc.Asset[] | null) {
        cache.isLoaded = true;
        //添加引用关系
        let tempCache = cache;
        let url = cache.key;
        if (err) {
            Log.e(`${this.module}加载资源失败:${cache.url} 原因:${err.message ? err.message : "未知"}`);
            cache.data = null;
            tempCache.data = null;
            App.cache.remove(cache);
            complete(cache);
        }
        else {
            if (CC_DEBUG) Log.d(`${this.module}加载资源成功:${cache.url}`);
            cache.data = data;
            tempCache.data = data;
            complete(cache);
        }

        //加载过程，有不同地方调用过来加载同一个资源的地方，都回调回去
        cache.doFinish(tempCache);
        cache.doGet(tempCache.data);

        if (cache.status == Resource.CacheStatus.WAITTING_FOR_RELEASE) {
            if (CC_DEBUG) Log.w(this.module, `资源:${cache.url}加载完成，但缓存状态为等待销毁，销毁资源`);
            if (cache.data) {
                cache.status = Resource.CacheStatus.NONE;
                this.releaseAsset(cache);
            }
        }

        console.timeEnd(`加载资源 : ${url}`);
    }

    public loadDir(
        bundle: BUNDLE_TYPE,
        path: string,
        type: typeof cc.Asset,
        onProgress: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
        onComplete: (data: Resource.Cache) => void): void {

        let url = Resource.getKey(path, type);
        if (CC_DEBUG) {
            Log.d(`load bundle : ${bundle} path : ${url}`)
        }
        //先到释放管理器中查找 
        let cache = App.releaseManger.get(bundle, url);
        if (cache) {
            console.time(`加载资源 : ${url}`);
            App.cache.set(cache);
            this._onLoadComplete(cache, onComplete, null, cache.data);
            return;
        }

        cache = App.cache.get(bundle, url, type);
        if (cache) {
            //存在缓存信息
            if (cache.isLoaded) {
                //已经加载完成
                if (CC_DEBUG && cache.status == Resource.CacheStatus.WAITTING_FOR_RELEASE) {
                    Log.w(this.module, `资源:${url} 等待释放，但资源已经加载完成，此时有人又重新加载，不进行释放处理`);
                }
                //加载完成
                onComplete(cache);
            } else {
                if (CC_DEBUG && cache.status == Resource.CacheStatus.WAITTING_FOR_RELEASE) {
                    Log.w(this.module, `资源:${url}等待释放，但资源处理加载过程中，此时有人又重新加载，不进行释放处理`);
                }
                cache.finishCb.push(onComplete);
            }
            //重新复位资源状态
            cache.status = Resource.CacheStatus.NONE;
        } else {
            //无缓存信息
            cache = new Resource.Cache(url,type,bundle);
            App.cache.set(cache);
            console.time(`加载资源 : ${cache.url}`);

            let _bundle = this.getBundle(bundle);
            if (!_bundle) {
                //如果bundle不存在
                let error = new Error(`${this.module} ${bundle} 没有加载，请先加载`);
                this._onLoadComplete(cache, onComplete, error, null);
                return;
            }
            if (type) {
                if (onProgress) {
                    _bundle.loadDir(path, type, onProgress, this._onLoadComplete.bind(this, cache, onComplete));
                } else {
                    _bundle.loadDir(path, type, this._onLoadComplete.bind(this, cache, onComplete));
                }
            } else {
                //如果bundle不存在
                let error = new Error(`${this.module} ${bundle} ${path} 加载没有指定资源类型`);
                this._onLoadComplete(cache, onComplete, error, null);
            }
        }
    }
    public releaseAsset( cache : Resource.Cache ){
        cache = App.cache.get(cache.bundle,cache.url,cache.type,false);
        if (cache) {
            if (cache.isLoaded) {
                if (cache.retain) {
                    if (CC_DEBUG) Log.d(`常驻资源 url : ${cache.url}`);
                    return;
                }
                App.releaseManger.release(cache);
            } else {
                cache.status = Resource.CacheStatus.WAITTING_FOR_RELEASE;
                if (CC_DEBUG) Log.w(`${cache.url} 正在加载，等待加载完成后进行释放`);
            }

        }
    }

    
    public retainAsset(cache: Resource.Cache) {
        if (cache) {
            cache = App.cache.get(cache.bundle, cache.url, cache.type)
            if (cache) {
                if (!cache.retain) {
                    cache.retain = cache.retain;
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
                if (CC_DEBUG) Log.e(`${cache.url} retainAsset cache.data is null`);
            }
        } else {
            if (CC_DEBUG) Log.e(`retainAsset info is null`);
        }
    }

    /**
     * @description 添加常驻资源
     * @param prefab 
     */
    public addPersistAsset(cache : Resource.Cache) {
        cache.retain = true;
        this.retainAsset(cache);
    }
}
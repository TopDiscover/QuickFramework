import UIView from "../ui/UIView";
import { DEBUG } from "cc/env";
import { Asset, isValid, js, SpriteAtlas, SpriteFrame, sp, Texture2D, ImageAsset, AssetManager, JsonAsset, TextAsset } from "cc";
import { Resource } from "./Resource";
import { Macro } from "../../defines/Macros";

class BundleCache {

    private _caches = new Map<string, Resource.Cache>();
    private name = Macro.UNKNOWN;
    constructor(name: string) {
        this.name = name;
    }

    public get(key: string, isCheck: boolean) {
        if (this._caches.has(key)) {
            let cache = this._caches.get(key);
            if (isCheck && cache && cache.isInvalid) {
                //资源已经释放
                Log.w(`资源加载完成，但已经被释放 , 重新加载资源 : ${key}`);
                this.remove(key);
                return null;
            }
            return this._caches.get(key);
        }
        return null;
    }

    public set(data: Resource.Cache) {
        this._caches.set(data.key, data);
    }

    public remove(key: string) {
        return this._caches.delete(key);
    }

    public get size() {
        return this._caches.size;
    }

    debug() {
        let key = this.name;
        let caches = this._caches;
        if (DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息开始----------------`)
        let content: any[] = [];
        let invalidContent: any[] = [];
        caches.forEach((data, key, source) => {
            if (data.isLoaded && isValid(data.data)) {
                content.push(data.debug());
            } else {
                invalidContent.push(data.debug());
            }
        });
        if (content.length > 0) {
            Log.d(`----------- 有效缓存信息 -----------`);
            Log.d(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            Log.d(`----------- 无效缓存信息 -----------`);
            Log.d(JSON.stringify(invalidContent));
        }
        if (DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息结束----------------`)
    }
}

class RemoteCaches {
    private _caches = new Map<string, Resource.Cache>();
    /**
     * @description 获取远程缓存数据
     * @param type 远程奖状类型
     * @param key 远程地址
     */
    public get(key: string) {
        if (this._caches.has(key)) {
            return this._caches.get(key);
        }
        return null;
    }

    public getSpriteFrame(url: string) {
        let key = Resource.getKey(url, SpriteFrame);
        let cacheSpriteFrame = this.get(key);
        if (cacheSpriteFrame) {
            //检查纹理是否还在
            let cacheTexture2D = this.get(Resource.getKey(url, Texture2D));
            if (cacheTexture2D) {
                return cacheSpriteFrame;
            } else {
                this.remove(url, SpriteFrame, true);
                return null;
            }
        }
        return null;
    }
    public makeSpriteFrame(url: string, data: any): Resource.CacheResult<SpriteFrame> {
        if (data && data instanceof ImageAsset) {
            //同一图片加载两次也会回调到这里，这里如果当前精灵缓存中有，不在重新创建
            let cache = this.getSpriteFrame(url);
            if (cache) {
                return {cache, asset: <SpriteFrame>(cache.data)};
            }
            cache = new Resource.Cache(url, SpriteFrame, Macro.BUNDLE_REMOTE);
            let sp = new SpriteFrame();
            let texture = new Texture2D();
            texture.image = data;
            sp.texture = texture;
            sp.name = url;
            (<any>sp)._nativeUrl = url;
            cache.isLoaded = true;
            cache.url = url;
            cache.data = sp;
            this.set(cache);
            return {cache, asset: <SpriteFrame>(cache.data)};
        }
        return {cache: null!, asset: null!};
    }

    makeSkeletonData(
        cache: Resource.Cache,
        image: ImageAsset,
        json: JsonAsset,
        atlas: TextAsset,
        name: string,
    ) {
        //生成SkeletonData数据
        let asset = new sp.SkeletonData;
        asset.skeletonJson = json.json as any;
        asset.atlasText = atlas.text;
        let texture = new Texture2D();
        texture.image = image;
        asset.textures = [texture];
        let pngName = name + ".png"
        asset.textureNames = [pngName];
        cache.data = asset;
        cache.isLoaded = true;
        return cache;
    }

    public set(data: Resource.Cache) {
        this._caches.set(data.key, data);
    }

    public retainAsset(cache: Resource.Cache) {
        if (cache) {
            if (cache.retain) {
                if (!cache.retain) {
                    if (DEBUG) Log.w(`资源 : ${cache.url} 已经被设置成常驻资源，不能改变其属性`);
                }
            } else {
                cache.retain = cache.retain;
            }
            this.addRef(cache.url, cache.type);
            if (cache.type == SpriteFrame) {
                //贴图
                this.addRef(cache.url, Texture2D);
            }
            if (cache.type == sp.SkeletonData) {
                this.addRef(`${cache.url}.png`, Texture2D);
                this.addRef(`${cache.url}.json`, JsonAsset);
                this.addRef(`${cache.url}.atlas`, TextAsset);
            }
        }
    }


    public releaseAsset(cache: Resource.Cache) {
        if (cache) {
            if (cache.retain) {
                //常驻内存中
                return;
            }
            this.remove(cache.url, cache.type);
        }
    }

    protected addRef(url: string, type: typeof Asset) {
        let key = Resource.getKey(url, type);
        let cache = this.get(key);
        if (cache) {
            cache.addRef();
        }
    }

    protected decRef(url: string, type: typeof Asset, force: boolean = false) {
        let key = Resource.getKey(url, type);
        let cache = this.get(key);
        if (cache) {
            const success = cache.decRef(false);
            if (success) {
                if (cache.refCount <= 0) {
                    this._caches.delete(key);
                    App.releaseManger.releaseRemote(cache, force);
                }
            } else {
                this._caches.delete(key);
            }
        }
    }

    public remove(url: string, type: typeof Asset, force: boolean = false) {
        this.decRef(url, type, force);
        if (type == SpriteFrame) {
            //删除贴图
            this.decRef(url, Texture2D, force);
        }
        if (type == sp.SkeletonData) {
            //删除三个文件缓存
            this.decRef(`${url}.png`, Texture2D, force);
            this.decRef(`${url}.json`, JsonAsset, force);
            this.decRef(`${url}.atlas`, TextAsset, force);
        }
    }

    debug() {
        let caches = this._caches;
        Log.d(`---- 远程加载资源缓存信息 ----`);
        let content: any[] = [];
        let invalidContent: any[] = [];
        caches.forEach((data, key, source) => {
            if (data.isLoaded && data.data && isValid(data.data)) {
                content.push(data.debug());
            } else {
                invalidContent.push(data.debug());
            }
        });
        if (content.length > 0) {
            Log.d(`----------------有效缓存信息------------------`);
            Log.d(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            Log.d(`----------------无效缓存信息------------------`);
            Log.d(JSON.stringify(invalidContent));
        }
    }
}

export class CacheManager implements ISingleton {
    isResident?: boolean = true;
    static module: string = "【缓存管理器】";
    module: string = null!;
    private _bundles = new Map<string, BundleCache>();
    private _remoteCaches = new RemoteCaches();
    public get remoteCaches() { return this._remoteCaches; }

    public getBundleName(bundle: BUNDLE_TYPE) {
        return App.bundleManager.getBundleName(bundle);
    }

    /**
     * @description 同步获取资源缓存，此接口不会检查资源的状态，只要建立了缓存，就会立即返回
     * @param bundle bundle名
     * @param url 资源url
     * @param isCheck 是否检查资源有效性，当为ture时，会检查资源是否有效，如果有效直接返回，如果无效，则返回nll
     * @returns 
     */
    public get(bundle: BUNDLE_TYPE, url: string, type: typeof Asset, isCheck: boolean = true) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            return (this._bundles.get(bundleName) as BundleCache).get(Resource.getKey(url, type), isCheck);
        }
        return null;
    }

    public set(cache: Resource.Cache) {
        let bundleName = this.getBundleName(cache.bundle);
        if (bundleName) {
            if (!this._bundles.has(bundleName)) {
                let bundleCache = new BundleCache(bundleName);
                bundleCache.set(cache);
                this._bundles.set(bundleName, bundleCache);
            } else {
                (this._bundles.get(bundleName)!).set(cache);
            }
        }
    }

    /**
     * @description 
     * @param cache 缓存信息
     */
    public remove(cache: Resource.Cache) {
        let bundleName = this.getBundleName(cache.bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            return (this._bundles.get(bundleName) as BundleCache).remove(cache.key);
        }
        return false;
    }

    public removeWithInfo(cache: Resource.Cache, bundle: AssetManager.Bundle, lazyInfo?: { add: (cache: Resource.Cache) => void }) {
        let isSuccess = true;
        if (cache) {
            cache.decRef(false);
            let type = cache.isDir ? "目录" : "资源";
            if (cache.refCount <= 0) {
                if (App.isLazyRelease) {
                    DEBUG && Log.d(`${this.module} 成功释放${type},将释放资源加入到释放队列中 bundle : ${cache.bundle} url : ${cache.url}`);
                    if ( lazyInfo && lazyInfo.add && cache.isDir ){
                        const deps = cache.deps;
                        deps.forEach(v => {
                            const temp = this.get(cache.bundle,v,cache.type);
                            if ( temp ){
                                lazyInfo.add(temp);
                                this.remove(temp);
                            }
                        });
                    }
                } else {
                    if (cache.isDir) {
                        // 只删除缓存
                        const deps = cache.deps;
                        deps.forEach(v => {
                            const temp = this.get(cache.bundle,v,cache.type)
                            if ( temp ){
                                if ( temp.refCount <= 0 ){
                                    DEBUG && Log.d(`${this.module} [${type}]成功释放资源 bundle : ${cache.bundle} url : ${temp.url}`)
                                    bundle.release(temp.url,cache.type)
                                    this.remove(temp);
                                }
                                else{
                                    DEBUG && Log.w(`${this.module} [${type}]资源${temp.url} 正使用中引用计数为:${temp.refCount}`)
                                }
                            }
                        });
                    } else {
                        bundle.release(cache.url, cache.type);
                    }
                    this.remove(cache);
                    DEBUG && Log.d(`${this.module} 成功释放${type} bundle : ${cache.bundle} url : ${cache.url}`);
                }
            } else {
                isSuccess = false;
                if (DEBUG) {
                    if (App.isLazyRelease) {
                        Log.w(`${this.module} 释放${type}失败，无法加入释放队列中 bundle : ${cache.bundle} url : ${cache.url} 引用计数 : ${cache.refCount}`);
                    } else {
                        Log.w(`${this.module} 释放${type}失败 bundle : ${cache.bundle} url : ${cache.url} 引用计数 : ${cache.refCount}`);
                    }
                }
            }
        }
        return isSuccess;
    }

    public removeBundle(bundle: BUNDLE_TYPE) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            this._bundles.delete(bundleName);
        }
    }

    /**
     * @description 如果资源正在加载中，会等待资源加载完成后返回，否则直接返回null
     * @param url 
     * @param type 资源类型
     * @param bundle
     * @param onComplete 完成回调,如果调用时资源会在加载完成后回调 getCache的最终值
     */
    public getCache<T extends Asset>(
        url: string,
        type: { prototype: T },
        bundle: BUNDLE_TYPE,
        onComplete: Resource.CompleteFun<T>
    ): Resource.CacheResult<T> {
        const _type = type as any as typeof Asset;
        let cache = this.get(bundle, url, _type);
        const _onComplete = (data: Resource.CacheResult<T>) => {
            DEBUG && Log.d(`${this.module} getCache 资源${url} 加载完成`);
            onComplete(data);
        }
        if (cache) {
            if (cache.isLoaded) {
                //已经加载完成
                if (cache.data instanceof _type) {
                    return { cache: cache, asset: cache.data as T};
                } else {
                    if (DEBUG) Log.e(`${this.module}传入类型:${js.getClassName(_type)}与资源实际类型: ${js.getClassName(cache.data as any)}不同 url : ${cache.url}`);
                    return { cache: cache, asset: null!};
                }
            } else {
                //加载中
                cache.finishCb.push(_onComplete as Resource.CompleteFun<Asset>);
                DEBUG && Log.d(`${this.module} getCache 资源${url} 正在加载中`);
                return { cache: cache, asset: null!};
            }
        } else {
            return { cache: null!, asset: null!};
        }
    }

    /**
     * @description 异步获取资源，如果资源未加载，会加载完成后返回
     * @param url 
     * @param type 
     * @param bundle 
     */
    public getCacheByAsync<T extends Asset>(
        url: string,
        type: { prototype: T },
        bundle: BUNDLE_TYPE,
        onComplete?: Resource.CompleteFun<T>
    ) {
        const _type = type as any as typeof Asset;

        const _onComplete = (data: Resource.CacheResult<T>) => {
            onComplete && onComplete(data);
        }

        const result = this.getCache(url, type, bundle, _onComplete)
        if (result.cache) {
            if ( result.cache.isLoaded ){
                _onComplete(result as Resource.CacheResult<T>);
            }
        }else{
            // 没有加载资源
            App.asset.load(bundle, url, _type, <any>null, (cache) => {
                if (cache && cache.data && cache.data instanceof _type) {
                    if (onComplete) {
                        onComplete({cache:cache,asset:cache.data as T});
                    }
                } else {
                    Log.e(`${this.module}加载失败 : ${url}`);
                    if (onComplete) {
                        onComplete({cache:null!,asset:null!});
                    }
                }
            });
        }
    }

    public getSpriteFrameByAsync(
        urls: string[],
        key: string,
        view: UIView,
        addExtraLoadResource: (view: UIView, info: Resource.Cache) => void,
        bundle: BUNDLE_TYPE,
        onComplete: (info: { url: string, spriteFrame: SpriteFrame, isTryReload?: boolean, cache: Resource.Cache }) => void
    ) {
        let nIndex = 0;
        let onCompleteFun = (data: Resource.CacheResult<SpriteAtlas>) => {
            addExtraLoadResource(view, data.cache);
            let spriteFrame = (data.asset as SpriteAtlas).getSpriteFrame(key);
            if (spriteFrame) {
                if (isValid(spriteFrame)) {
                    onComplete({ url: urls[nIndex], spriteFrame: spriteFrame, cache: data.cache });
                } else {
                    //来到这里面，其实程序已经崩溃了，已经没什么意思，也不知道写这个有啥用，尽量安慰,哈哈哈
                    Log.e(`精灵帧被释放，释放当前无法的图集资源 url ：${urls[nIndex]} key : ${key}`);
                    App.asset.releaseAsset(data.cache);
                    onComplete({ url: urls[nIndex], spriteFrame: null!, isTryReload: true, cache: data.cache });
                }
            } else {
                nIndex++;
                if (nIndex >= urls.length) {
                    onComplete({ url: urls[nIndex], spriteFrame: null!, cache: data.cache });
                } else {
                    getFun(urls[nIndex]);
                }
            }
        }

        let getFun = (url: string) => {
            this.getCacheByAsync(url, SpriteAtlas, bundle, onCompleteFun)
        };

        getFun(urls[nIndex]);
    }

    debug() {
        this._bundles.forEach(v => {
            v.debug();
        });

        this.remoteCaches.debug();
    }
}
import UIView from "../ui/UIView";
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
        if (CC_DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息开始----------------`)
        let content: any[] = [];
        let invalidContent: any[] = [];
        caches.forEach((data, key, source) => {
            if (data.isLoaded && data.data) {
                invalidContent.push(data.debug());
            } else {
                content.push(data.debug());
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
        if (CC_DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息结束----------------`)
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
        let key = Resource.getKey(url, cc.SpriteFrame);
        let cacheSpriteFrame = this.get(key);
        if (cacheSpriteFrame) {
            //检查纹理是否还在
            let cacheTexture2D = this.get(Resource.getKey(url, cc.Texture2D));
            if (cacheTexture2D) {
                return cacheSpriteFrame;
            } else {
                this.remove(url, cc.SpriteFrame);
                return null;
            }
        }
        return null;
    }
    public setSpriteFrame(url: string, data: any): [Resource.Cache,cc.SpriteFrame] {
        if (data && data instanceof cc.Texture2D) {
            //同一图片加载两次也会回调到这里，这里如果当前精灵缓存中有，不在重新创建
            let cache = this.getSpriteFrame(url);
            if (cache) {
                return [cache,<cc.SpriteFrame>(cache.data)];
            }
            cache = new Resource.Cache(url, cc.SpriteFrame, Macro.BUNDLE_REMOTE);
            cache.data = new cc.SpriteFrame(data);
            data.addRef();
            // cache.data.nativeUrl = url;
            (<any>cache.data)._nativeUrl = url;
            cache.data.name = url;
            cache.isLoaded = true;
            cache.url = url;
            this.set(cache);
            return [cache,<cc.SpriteFrame>(cache.data)];
        }
        return [null,null];
    }

    public set(data: Resource.Cache) {
        this._caches.set(data.key, data);
    }

    public retainAsset(cache: Resource.Cache) {
        if (cache) {
            if (cache.retain) {
                if (!cache.retain) {
                    if (CC_DEBUG) Log.w(`资源 : ${cache.url} 已经被设置成常驻资源，不能改变其属性`);
                }
            } else {
                cache.retain = cache.retain;
            }
            (<cc.Asset>cache.data).addRef();
        }
    }


    public releaseAsset(cache: Resource.Cache) {
        if (cache) {
            if (cache.retain) {
                //常驻内存中
                return;
            }
            let data : cc.Asset = cache.data as any;
            data.decRef(false);
            if (data.refCount <= 0) {
                this.remove(cache.url,cache.type);
            }
        }
    }

    public remove(url: string, type: typeof cc.Asset) {

        if (type == cc.SpriteFrame) {
            //先删除精灵帧
            let key = Resource.getKey(url, cc.SpriteFrame);
            let cache = this.get(key);
            if (cache) {
                (<cc.Asset>cache.data).decRef(false);
                this._caches.delete(key);
                App.releaseManger.releaseRemote(cache);
            }


            //删除贴图
            key = Resource.getKey(url,cc.Texture2D);
            cache = this.get(key);
            if ( cache ){
                (<cc.Asset>cache.data).decRef(false);
                this._caches.delete(key);
                App.releaseManger.releaseRemote(cache);
            }

        }

        // let cache = this._caches.has(url) ? this._caches.get(url) : null;
        // if (cache && cache.data instanceof sp.SkeletonData) {
        //     //这里面需要删除加载进去的三个文件缓存 
        //     this.remove(`${cache.url}.atlas`);
        //     this.remove(`${cache.url}.png`);
        //     this.remove(`${cache.url}.json`);
        // }
        // if (cache && cache.data instanceof cc.Asset) {
        //     if (CC_DEBUG) Log.d(`释放加载的本地远程资源:${cache.url}`);
        //     cache.data.decRef(false);
        //     cache.data = cache.data;
        //     App.releaseManger.releaseRemote(cache);
        // }
    }

    debug() {
        let spCaches = this._spriteFrameCaches;
        let caches = this._caches;
        let infos = this._resMap;
        Log.d(`---- 远程加载资源缓存信息 ----`);

        let content: any[] = [];
        let invalidContent: any[] = [];
        spCaches.forEach((data, key, source) => {
            if (data.isLoaded && ((data.data && !cc.isValid(data.data)) || !data.data)) {
                invalidContent.push(data.debug());
            } else {
                content.push(data.debug());
            }
        });

        if (content.length > 0) {
            Log.d(`----------------有效 spriteFrame 缓存信息------------------`);
            Log.d(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            Log.d(`----------------无效 spriteFrame 缓存信息------------------`);
            Log.d(JSON.stringify(invalidContent));
        }


        content = [];
        invalidContent = [];
        caches.forEach((data, key, source) => {
            if (data.isLoaded && data.data && !cc.isValid(data.data)) {
                invalidContent.push(data.debug());
            } else {
                content.push(data.debug());
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

        if (infos.size > 0) {
            Log.d(`----------------当前资源引用计数信息------------------`);
            content = [];
            infos.forEach((value, key) => {
                let item = { url: key, data: { refCount: value.refCount, url: value.url, retain: value.retain } };
                content.push(item);
            });
            Log.d(JSON.stringify(content));
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
    public get(bundle: BUNDLE_TYPE, url: string, type: typeof cc.Asset, isCheck: boolean = true) {
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

    /**@description 释放资源，引用计数减1  */
    protected decRef(cache: Resource.Cache, assets: cc.Asset, bundle: cc.AssetManager.Bundle) {
        const data = assets
        data.decRef(false);
        let isSuccess = true;
        if (data.refCount <= 0) {
            if (App.isLazyRelease) {
                CC_DEBUG && Log.d(`${this.module} bundle : ${cache.bundle} 释放资源成功 : ${cache.url} , 将加载到释放队列中`);
            } else {
                bundle.release(cache.url, cache.type);
                CC_DEBUG && Log.d(`${this.module} bundle : ${cache.bundle} 释放资源成功 : ${cache.url}`);
            }
        } else {
            if (CC_DEBUG) {
                if (App.isLazyRelease) {
                    Log.w(`${this.module} bundle : ${cache.bundle} 释放资源失败 : ${cache.url} , 引用计数 : ${data.refCount} , 不能加载到释放队列中`);
                } else {
                    Log.w(`${this.module} bundle : ${cache.bundle} 释放资源失败 : ${cache.url} , 引用计数 : ${data.refCount}`);
                }
            }
            isSuccess = false;
        }
        return isSuccess;
    }

    public removeWithInfo(cache: Resource.Cache, bundle: cc.AssetManager.Bundle) {
        let isSuccess = true;
        if (cache && cache.data) {

            if (Array.isArray(cache.data)) {
                for (let i = 0; i < cache.data.length; i++) {
                    let result = this.decRef(cache, cache.data[i], bundle);
                    if (!result) {
                        isSuccess = false;
                    }
                }
                if (isSuccess) {
                    if (App.isLazyRelease) {
                        CC_DEBUG && Log.d(`${this.module} 成功释放资源目录,将释放目录加入到释放队列中 bundle : ${cache.bundle} : ${cache.bundle}.${cache.url}`);
                    } else {
                        this.remove(cache);
                        CC_DEBUG && Log.d(`${this.module} 成功释放资源目录 bundle : ${cache.bundle} : ${cache.bundle}.${cache.url}`);
                    }
                } else {
                    if (App.isLazyRelease) {
                        CC_DEBUG && Log.d(`${this.module} 释放资源目录失败，无法加入到释放队列中 bundle : ${cache.bundle} : ${cache.bundle}.${cache.url}`);
                    } else {
                        CC_DEBUG && Log.d(`${this.module} 释放资源目录失败 bundle : ${cache.bundle} : ${cache.bundle}.${cache.url}`);
                    }
                }

            } else {
                if (this.decRef(cache, cache.data, bundle)) {
                    if (!App.isLazyRelease) {
                        this.remove(cache);
                    }
                } else {
                    isSuccess = false;
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

    private _getGetCacheByAsyncArgs(): { url: string, type: typeof cc.Asset, bundle: BUNDLE_TYPE, ignoreType: boolean } | null {
        if (arguments.length < 3) {
            if (CC_DEBUG) Log.e(`${this.module}参数传入有误，必须两个参数`);
            return null;
        }
        if (typeof arguments[0] != "string") {
            if (CC_DEBUG) Log.e(`${this.module}传入第一个参数有误,必须是string`);
            return null;
        }

        let ignoreType = arguments.length > 3 ? arguments[3] : false;
        if (!ignoreType && !cc.js.isChildClassOf(arguments[1], cc.Asset)) {
            if (CC_DEBUG) Log.e(`${this.module}传入的第二个参数有误,必须是cc.Asset的子类`);
            return null;
        }
        return { url: arguments[0], type: arguments[1], bundle: arguments[2], ignoreType: ignoreType };
    }

    /**
     * @description 如果资源正在加载中，会等待资源加载完成后返回，否则直接返回null
     * @param url 
     * @param type 资源类型
     * @param bundle
     */
    public getCache<T extends cc.Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<[Resource.Cache, T]>;
    public getCache<T extends cc.Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE, ignoreType: boolean): Promise<[Resource.Cache, T]>;
    public getCache() {
        let args = arguments;
        let me = this;
        return new Promise<[Resource.Cache, any]>((resolve) => {
            let _args = me._getGetCacheByAsyncArgs.apply(me, args as any);
            if (!_args) {
                resolve([null, null]);
                return;
            }
            let cache = me.get(_args.bundle, _args.url, _args.type);
            if (cache) {
                if (cache.isLoaded) {
                    //已经加载完成
                    if (_args.type && !_args.ignoreType) {
                        if (cache.data instanceof _args.type) {
                            resolve([cache, cache.data]);
                        } else {
                            if (CC_DEBUG) Log.e(`${this.module}传入类型:${cc.js.getClassName(_args.type)}与资源实际类型: ${cc.js.getClassName(cache.data as any)}不同 url : ${cache.url}`);
                            resolve([null, null]);
                        }
                    } else {
                        resolve([cache, cache.data]);
                    }
                } else {
                    //加载中
                    cache.getCb.push(resolve);
                }
            } else {
                resolve([null, null]);
            }
        });
    }

    /**
     * @description 异步获取资源，如果资源未加载，会加载完成后返回
     * @param url 
     * @param type 
     * @param bundle 
     */
    public getCacheByAsync<T extends cc.Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<[Resource.Cache, T]>;
    public getCacheByAsync() {
        let me = this;
        let args = this._getGetCacheByAsyncArgs.apply(this, <any>arguments);
        return new Promise<[Resource.Cache, any]>((resolve) => {
            if (!args) {
                resolve([null, null]);
                return;
            }
            me.getCache(args.url, args.type, args.bundle).then(([cache, data]) => {
                args = args as { url: string, type: typeof cc.Asset, bundle: BUNDLE_TYPE };
                if (data && data instanceof args.type) {
                    resolve([cache, data]);
                } else {
                    //加载资源
                    App.asset.load(args.bundle, args.url, args.type, <any>null, (cache) => {
                        args = args as { url: string, type: typeof cc.Asset, bundle: BUNDLE_TYPE };
                        if (cache && cache.data && cache.data instanceof args.type) {
                            resolve([cache, cache.data]);
                        } else {
                            Log.e(`${this.module}加载失败 : ${args.url}`);
                            resolve([null, null]);
                        }
                    });
                }
            });
        });
    }

    public getSpriteFrameByAsync(urls: string[], key: string, view: UIView, addExtraLoadResource: (view: UIView, info: Resource.Info) => void, bundle: BUNDLE_TYPE) {
        let me = this;
        return new Promise<{ url: string, spriteFrame: cc.SpriteFrame, isTryReload?: boolean, cache: Resource.Cache }>((resolve) => {
            let nIndex = 0;
            let getFun = (url: string) => {
                me.getCacheByAsync(url, cc.SpriteAtlas, bundle).then(([cache, atlas]) => {
                    addExtraLoadResource(view, cache);
                    if (atlas) {
                        let spriteFrame = atlas.getSpriteFrame(key);
                        if (spriteFrame) {
                            if (cc.isValid(spriteFrame)) {
                                resolve({ url: url, spriteFrame: spriteFrame, cache: cache });
                            } else {
                                //来到这里面，其实程序已经崩溃了，已经没什么意思，也不知道写这个有啥用，尽量安慰,哈哈哈
                                Log.e(`精灵帧被释放，释放当前无法的图集资源 url ：${url} key : ${key}`);
                                App.asset.releaseAsset(cache);
                                resolve({ url: url, spriteFrame: null, isTryReload: true, cache: cache });
                            }
                        } else {
                            nIndex++;
                            if (nIndex >= urls.length) {
                                resolve({ url: url, spriteFrame: null, cache: null });
                            } else {
                                getFun(urls[nIndex]);
                            }
                        }
                    } else {
                        resolve({ url: url, spriteFrame: null, cache: null });
                    }
                })
            };

            getFun(urls[nIndex]);
        });
    }

    debug() {
        this._bundles.forEach(v => {
            v.debug();
        });

        this.remoteCaches.debug();
    }
}
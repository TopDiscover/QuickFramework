import UIView from "../ui/UIView";
import { DEBUG } from "cc/env";
import { Asset, isValid, js, SpriteAtlas, SpriteFrame, sp, Texture2D, ImageAsset, AssetManager } from "cc";
import { Resource } from "./Resource";
import { Macro } from "../../defines/Macros";
class ResourceCache {

    private _caches = new Map<string, Resource.CacheData>();
    private name = Macro.UNKNOWN;
    constructor(name: string) {
        this.name = name;
    }

    public get(path: string, isCheck: boolean) {
        if (this._caches.has(path)) {
            let cache = this._caches.get(path);
            if (isCheck && cache && cache.isInvalid) {
                //资源已经释放
                Log.w(`资源加载完成，但已经被释放 , 重新加载资源 : ${path}`);
                this.remove(path);
                return null;
            }
            return this._caches.get(path);
        }
        return null;
    }

    public set(path: string, data: Resource.CacheData) {
        this._caches.set(path, data);
    }

    public remove(path: string) {
        return this._caches.delete(path);
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

            if (data.isLoaded && data.data && !isValid(data.data)) {
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
        if (DEBUG) Log.d(`----------------Bundle ${key} 资源缓存信息结束----------------`)
    }
}

class CacheInfo {
    refCount = 0;
    url: string = "";
    /**@description 是否常驻于内存中 */
    retain: boolean = false;
}

class RemoteCaches {
    private _caches = new Map<string, Resource.CacheData>();
    private _spriteFrameCaches = new Map<string, Resource.CacheData>();
    private _resMap = new Map<string, CacheInfo>();
    /**
     * @description 获取远程缓存数据
     * @param type 远程奖状类型
     * @param url 远程地址
     */
    public get(url: string) {
        if (this._caches.has(url)) {
            return this._caches.get(url);
        }
        return null;
    }

    public getSpriteFrame(url: string) {
        if (this._spriteFrameCaches.has(url)) {
            let cache = this._spriteFrameCaches.get(url);
            let texture2D = this.get(url);
            if (texture2D) {
                return cache;
            } else {
                this.remove(url);
                return null;
            }
        }
        return null;
    }
    public setSpriteFrame(url: string, data: any): SpriteFrame | null {
        if (data && data instanceof ImageAsset) {
            //同一图片加载两次也会回调到这里，这里如果当前精灵缓存中有，不在重新创建
            let spriteFrame = this.getSpriteFrame(url);
            if (spriteFrame) {
                return <SpriteFrame>(spriteFrame.data);
            }
            let cache = new Resource.CacheData();
            let sp = new SpriteFrame();
            let texture = new Texture2D();
            texture.image = data
            sp.texture = texture;
            sp.name = url;
            (<any>sp)._nativeUrl = url;
            cache.data = sp;
            cache.isLoaded = true;
            cache.info.url = url;
            this._spriteFrameCaches.set(url, cache);
            return <SpriteFrame>(cache.data);
        }
        return null;
    }

    public set(url: string, data: Resource.CacheData) {
        data.info.url = url;
        this._caches.set(url, data);
    }

    private _getCacheInfo(info: Resource.Info, isNoFoundCreate: boolean = true) {
        if (info && info.url && info.url.length > 0) {
            if (!this._resMap.has(info.url)) {
                if (isNoFoundCreate) {
                    let cache = new CacheInfo;
                    cache.url = info.url;
                    this._resMap.set(info.url, cache);
                }
                else {
                    return null;
                }
            }
            return this._resMap.get(info.url);
        }
        return null;
    }

    public retainAsset(info: Resource.Info) {
        if (info && info.data) {
            let cache = this._getCacheInfo(info);
            if (cache) {
                if (cache.retain) {
                    if (!info.retain) {
                        if (DEBUG) Log.w(`资源 : ${info.url} 已经被设置成常驻资源，不能改变其属性`);
                    }
                } else {
                    cache.retain = info.retain;
                }

                (<Asset>info.data).addRef();
                cache.refCount++;
                if (cache.retain) {
                    cache.refCount = 999999;
                }
            }
        }
    }

    public releaseAsset(info: Resource.Info) {
        if (info && info.data) {
            let cache = this._getCacheInfo(info, false);
            if (cache) {
                if (cache.retain) {
                    //常驻内存中
                    return;
                }
                cache.refCount--;
                if (cache.refCount <= 0) {
                    this.remove(cache.url);
                }
            }
        }
    }

    public remove(url: string) {
        this._resMap.delete(url);

        //先删除精灵帧
        if (this._spriteFrameCaches.has(url)) {
            //先释放引用计数
            (<Asset>(this._spriteFrameCaches.get(url) as Resource.CacheData).data).decRef(false);
            this._spriteFrameCaches.delete(url);
            if (DEBUG) Log.d(`remove remote sprite frames resource url : ${url}`);
        }

        let cache = this._caches.has(url) ? this._caches.get(url) : null;
        if (cache && cache.data instanceof sp.SkeletonData) {
            //这里面需要删除加载进去的三个文件缓存 
            this.remove(`${cache.info.url}.atlas`);
            this.remove(`${cache.info.url}.png`);
            this.remove(`${cache.info.url}.json`);
        }
        if (cache && cache.data instanceof Asset) {
            if (DEBUG) Log.d(`释放加载的本地远程资源:${cache.info.url}`);
            cache.data.decRef(false);
            cache.info.data = cache.data;
            App.releaseManger.releaseRemote(cache.info);
        }
        if (DEBUG) Log.d(`remove remote cache url : ${url}`);
        return this._caches.delete(url);
    }

    debug(){
        let spCaches = this._spriteFrameCaches;
        let caches = this._caches;
        let infos = this._resMap;
        Log.d(`---- 远程加载资源缓存信息 ----`);

        let content: any[] = [];
        let invalidContent: any[] = [];
        spCaches.forEach((data, key, source) => {
            if (data.isLoaded && ((data.data && !isValid(data.data)) || !data.data)) {
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
            if (data.isLoaded && data.data && !isValid(data.data)) {
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
    private _bundles = new Map<string, ResourceCache>();
    private _remoteCaches = new RemoteCaches();
    public get remoteCaches() { return this._remoteCaches; }

    public getBundleName(bundle: BUNDLE_TYPE) {
        return App.bundleManager.getBundleName(bundle);
    }

    /**
     * @description 同步获取资源缓存，此接口不会检查资源的状态，只要建立了缓存，就会立即返回
     * @param bundle bundle名
     * @param path 资源路径
     * @param isCheck 是否检查资源有效性，当为ture时，会检查资源是否有效，如果有效直接返回，如果无效，则返回nll
     * @returns 
     */
    public get(bundle: BUNDLE_TYPE, path: string, isCheck: boolean = true) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            return (this._bundles.get(bundleName) as ResourceCache).get(path, isCheck);
        }
        return null;
    }

    public set(bundle: BUNDLE_TYPE, path: string, data: Resource.CacheData) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName) {
            if (!this._bundles.has(bundleName)) {
                let cache = new ResourceCache(bundleName);
                cache.set(path, data);
                this._bundles.set(bundleName, cache);
            } else {
                (this._bundles.get(bundleName) as ResourceCache).set(path, data);
            }
        }
    }

    /**
     * @description 
     * @param bundle bundle
     * @param path path
     */
    public remove(bundle: BUNDLE_TYPE, path: string) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            return (this._bundles.get(bundleName) as ResourceCache).remove(path);
        }
        return false;
    }

    public removeWithInfo(info: Resource.Info, bundle: AssetManager.Bundle) {
        if (info && info.data) {
            if (Array.isArray(info.data)) {
                for (let i = 0; i < info.data.length; i++) {
                    const data = info.data[i];
                    data.decRef(false);
                    const path = `${info.url}/${info.data[i].name}`;
                    if (data.refCount <= 0) {
                        bundle.release(path, info.type);
                        DEBUG && Log.d(`${this.module} bundle : ${info.bundle} 释放资源成功 : ${path}`);
                    } else {
                        DEBUG && Log.w(`${this.module} bundle : ${info.bundle} 释放资源失败 : ${path} , 引用计数 : ${data.refCount}`);
                    }
                }
                this.remove(info.bundle, info.url);
                DEBUG && Log.d(`${this.module} 成功释放资源目录 bundle : ${info.bundle} : ${info.bundle}.${info.url}`);
            } else {
                const data = info.data;
                data.decRef(false);
                if (data.refCount <= 0) {
                    bundle.release(info.url, info.type);
                    DEBUG && Log.d(`${this.module} bundle : ${info.bundle} 释放资源成功 : ${info.url}`);
                } else {
                    DEBUG && Log.w(`${this.module} bundle : ${info.bundle} 释放资源失败 : ${info.url} , 引用计数 : ${data.refCount}`);
                }
                this.remove(info.bundle, info.url);
            }
        }
    }

    public removeBundle(bundle: BUNDLE_TYPE) {
        let bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
            this._bundles.delete(bundleName);
        }
    }

    private _getGetCacheByAsyncArgs(): { url: string, type: typeof Asset, bundle: BUNDLE_TYPE } | null {
        if (arguments.length < 3) {
            if (DEBUG) Log.e(`${this.module}参数传入有误，必须两个参数`);
            return null;
        }
        if (typeof arguments[0] != "string") {
            if (DEBUG) Log.e(`${this.module}传入第一个参数有误,必须是string`);
            return null;
        }

        if (!js.isChildClassOf(arguments[1], Asset)) {
            if (DEBUG) Log.e(`${this.module}传入的第二个参数有误,必须是cc.Asset的子类`);
            return null;
        }
        return { url: arguments[0], type: arguments[1], bundle: arguments[2] };
    }

    /**
     * @description 如果资源正在加载中，会等待资源加载完成后返回，否则直接返回null
     * @param url 
     * @param type 资源类型
     * @param bundle
     */
    public getCache<T extends Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<T>;
    public getCache() {
        let args = arguments;
        let me = this;
        return new Promise<any>((resolve) => {
            let _args = me._getGetCacheByAsyncArgs.apply(me, args as any);
            if (!_args) {
                resolve(null);
                return;
            }
            let cache = me.get(_args.bundle, _args.url);
            if (cache) {
                if (cache.isLoaded) {
                    //已经加载完成
                    if (_args.type) {
                        if (cache.data instanceof _args.type) {
                            resolve(cache.data);
                        } else {
                            if (DEBUG) Log.e(`${this.module}传入类型:${js.getClassName(_args.type)}与资源实际类型: ${js.getClassName(cache.data as any)}不同 url : ${cache.info.url}`);
                            resolve(null);
                        }
                    } else {
                        resolve(cache.data);
                    }
                } else {
                    //加载中
                    cache.getCb.push(resolve);
                }
            } else {
                resolve(null);
            }
        });
    }

    /**
     * @description 异步获取资源，如果资源未加载，会加载完成后返回
     * @param url 
     * @param type 
     * @param bundle 
     */
    public getCacheByAsync<T extends Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<T>;
    public getCacheByAsync() {
        let me = this;
        let args = this._getGetCacheByAsyncArgs.apply(this, <any>arguments);
        return new Promise<any>((resolve) => {
            if (!args) {
                resolve(null);
                return;
            }
            me.getCache(args.url, args.type, args.bundle).then((data) => {
                args = args as { url: string, type: typeof Asset, bundle: BUNDLE_TYPE };
                if (data && data instanceof args.type) {
                    resolve(data);
                } else {
                    //加载资源
                    App.asset.load(args.bundle, args.url, args.type, <any>null, (cache) => {
                        args = args as { url: string, type: typeof Asset, bundle: BUNDLE_TYPE };
                        if (cache && cache.data && cache.data instanceof args.type) {
                            resolve(cache.data);
                        } else {
                            Log.e(`${this.module}加载失败 : ${args.url}`);
                            resolve(null);
                        }
                    });
                }
            });
        });
    }

    public getSpriteFrameByAsync(urls: string[], key: string, view: UIView, addExtraLoadResource: (view: UIView, info: Resource.Info) => void, bundle: BUNDLE_TYPE) {
        let me = this;
        return new Promise<{ url: string, spriteFrame: SpriteFrame | null, isTryReload?: boolean }>((resolve) => {
            let nIndex = 0;
            let getFun = (url: string) => {
                me.getCacheByAsync(url, SpriteAtlas, bundle).then((atlas) => {
                    let info = new Resource.Info;
                    info.url = url;
                    info.type = SpriteAtlas;
                    info.data = atlas;
                    info.bundle = bundle;
                    addExtraLoadResource(view, info);
                    if (atlas) {
                        let spriteFrame = atlas.getSpriteFrame(key);
                        if (spriteFrame) {
                            if (isValid(spriteFrame)) {
                                resolve({ url: url, spriteFrame: spriteFrame });
                            } else {
                                //来到这里面，其实程序已经崩溃了，已经没什么意思，也不知道写这个有啥用，尽量安慰,哈哈哈
                                Log.e(`精灵帧被释放，释放当前无法的图集资源 url ：${url} key : ${key}`);
                                App.asset.releaseAsset(info);
                                resolve({ url: url, spriteFrame: null, isTryReload: true });
                            }
                        } else {
                            nIndex++;
                            if (nIndex >= urls.length) {
                                resolve({ url: url, spriteFrame: null });
                            } else {
                                getFun(urls[nIndex]);
                            }
                        }
                    } else {
                        resolve({ url: url, spriteFrame: null });
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
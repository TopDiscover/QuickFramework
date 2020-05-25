import UIView from "../ui/UIView";
import { addExtraLoadResourceReference } from "../extentions/Utils";
import { RemoteUrl, ResourceCacheData, ResourceInfo } from "../base/Defines";
import { loader } from "../loader/Loader";
import { getSingleton } from "../base/Singleton";

class CacheInfo {
    refCount = 0;
    url: string = "";
    /**@description 是否常驻于内存中 */
    retain: boolean = false;
}

export function remoteCaches(){
    return getSingleton(RemoteCaches);
}

class RemoteCaches {

    private static _instance: RemoteCaches = null;
    public static Instance() { return this._instance || (this._instance = new RemoteCaches()); }

    private _caches = new Map<string, ResourceCacheData>();
    private _spriteFrameCaches = new Map<string, ResourceCacheData>();
    private _resMap = new Map<string, CacheInfo>();
    /**
     * @description 获取远程缓存数据
     * @param type 远程奖状类型
     * @param remoteUrl url数据
     */
    public get(url: string | RemoteUrl) {
        let tempUrl = "";
        if (typeof url == "string") {
            let remoteUrl = this.parseUrl(url);
            tempUrl = this.makeUrl(remoteUrl);
        } else {
            tempUrl = this.makeUrl(url);
        }
        if (this._caches.has(tempUrl)) {
            return this._caches.get(tempUrl);
        }
        return null;
    }

    public getSpriteFrame(url: string | RemoteUrl) {
        let tempUrl = "";
        if (typeof url == "string") {
            let remoteUrl = this.parseUrl(url);
            tempUrl = this.makeUrl(remoteUrl);
        } else {
            tempUrl = this.makeUrl(url);
        }
        if (this._spriteFrameCaches.has(tempUrl)) {
            let cache = this._spriteFrameCaches.get(tempUrl);
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
    public setSpriteFrame(url: string | RemoteUrl, data: any): cc.SpriteFrame {
        let tempUrl = "";
        if (typeof url == "string") {
            let remoteUrl = this.parseUrl(url);
            tempUrl = this.makeUrl(remoteUrl);
        } else {
            tempUrl = this.makeUrl(url);
        }
        if (data && data instanceof cc.Texture2D) {

            //同一图片加载两次也会回调到这里，这里如果当前精灵缓存中有，不在重新创建
            let spriteFrame = this.getSpriteFrame(url);
            if (spriteFrame) {
                return <cc.SpriteFrame>(spriteFrame.data);
            }

            let cache = new ResourceCacheData();
            cache.data = new cc.SpriteFrame(data);
            cache.data.url = tempUrl;
            cache.isLoaded = true;
            cache.url = tempUrl;

            //添加到动态图集中
            if (cc.dynamicAtlasManager.enabled) {
                //cc.dynamicAtlasManager.showDebug(true);
                //cc.dynamicAtlasManager.insertSpriteFrame((<cc.SpriteFrame>(cache.data)));
            }

            this._spriteFrameCaches.set(tempUrl, cache);
            return <cc.SpriteFrame>(cache.data);
        }
        return null;
    }

    public set(url: string | RemoteUrl, data: ResourceCacheData) {
        let tempUrl = "";
        if (typeof url == "string") {
            let remoteUrl = this.parseUrl(url);
            tempUrl = this.makeUrl(remoteUrl);
        } else {
            tempUrl = this.makeUrl(url);
        }
        data.url = tempUrl;
        this._caches.set(tempUrl, data);
    }

    private _getCacheInfo(info: ResourceInfo, isNoFoundCreate: boolean = true) {
        if (info && info.url && info.url.length > 0) {
            let remoteUrl = this.parseUrl(info.url);
            let url = this.makeUrl(remoteUrl);
            if (!this._resMap.has(url)) {
                if (isNoFoundCreate) {
                    let cache = new CacheInfo;
                    cache.url = info.url;
                    this._resMap.set(url, cache);
                }
                else {
                    return null;
                }
            }
            return this._resMap.get(url);
        }
        return null;
    }

    public retainAsset(info: ResourceInfo) {
        if (info && info.data) {
            let cache = this._getCacheInfo(info);
            if (cache) {
                if (cache.retain) {
                    if (!info.retain) {
                        if (CC_DEBUG) cc.warn(`资源 : ${info.url} 已经被设置成常驻资源，不能改变其属性`);
                    }
                } else {
                    cache.retain = info.retain;
                }
                cache.refCount++;
                if (cache.retain) {
                    cache.refCount = 999999;
                }
            }
        }
    }

    public releaseAsset(info: ResourceInfo) {
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

    public remove(url: string | RemoteUrl) {
        let tempUrl = "";
        if (typeof url == "string") {
            let remoteUrl = this.parseUrl(url);
            tempUrl = this.makeUrl(remoteUrl);
        } else {
            tempUrl = this.makeUrl(url);
        }

        this._resMap.delete(tempUrl);

        //先删除精灵帧
        if (this._spriteFrameCaches.has(tempUrl)) {
            this._spriteFrameCaches.delete(tempUrl);
            if (CC_DEBUG) cc.log(`remove remote sprite frames resource url : ${tempUrl}`);
        }

        let cache = this._caches.has(tempUrl) ? this._caches.get(tempUrl) : null;
        if (cache && cache.data instanceof sp.SkeletonData) {
            //这里面需要删除加载进去的三个文件缓存 
            this.remove(`${cache.url}.atlas`);
            this.remove(`${cache.url}.png`);
            this.remove(`${cache.url}.json`);
        }
        let success = this._caches.delete(tempUrl);
        if (success) {
            if (CC_JSB && cache) {
                cc.loader.release(cache.jsbStoragePath);
                if (CC_DEBUG) cc.log(`释放加载的本地远程资源:${cache.jsbStoragePath}`);
            }
            if (CC_DEBUG) cc.log(`remove remote cache url : ${tempUrl}`);
        }
        return success;
    }

    public makeUrl(remoteUrl: RemoteUrl): string {
        return `${remoteUrl.path}/${remoteUrl.fileName}`;
    }

    public parseUrl(url) {
        url = url.replace(/\s*/g, "");

        let data: RemoteUrl = { url: null, path: null, fileName: null };
        data.url = url;
        //摘取文件
        let fileName = data.url.slice(data.url.lastIndexOf("/") + 1);
        let fileDir = data.url.substr(0, data.url.length - fileName.length - 1);
        let md5path = fileDir;
        if (CC_JSB) {
            md5path = md5(fileDir).toString();
            data.path = md5path;
        } else {
            data.path = fileDir;
        }
        data.fileName = fileName;
        return data;
    }

    showCaches() {
        cc.log(`---- [RemoteCaches] showCaches ----`);

        let content = [];
        let invalidContent = [];
        this._spriteFrameCaches.forEach((data, key, source) => {
            let itemContent = { url: data.url, isLoaded: data.isLoaded, isValid: cc.isValid(data.data), assetType: cc.js.getClassName(data.assetType), data: data.data ? cc.js.getClassName(data.data) : null, status: data.status };
            let item = { url: key, data: itemContent };
            if (data.isLoaded && ((data.data && !cc.isValid(data.data)) || !data.data)) {
                invalidContent.push(item);
            } else {
                content.push(item);
            }
        });

        if (content.length > 0) {
            cc.log(`----------------Current valid spriteFrame Caches------------------`);
            cc.log(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            cc.log(`----------------Current invalid spriteFrame Caches------------------`);
            cc.log(JSON.stringify(invalidContent));
        }


        content = [];
        invalidContent = [];
        this._caches.forEach((data, key, source) => {
            let itemContent = { url: data.url, isLoaded: data.isLoaded, isValid: cc.isValid(data.data), assetType: cc.js.getClassName(data.assetType), data: data.data ? cc.js.getClassName(data.data) : null, status: data.status }
            let item = { url: key, data: itemContent };
            if (data.isLoaded && data.data && !cc.isValid(data.data)) {
                invalidContent.push(item);
            } else {
                content.push(item);
            }
        });
        if (content.length > 0) {
            cc.log(`----------------Current valid Caches------------------`);
            cc.log(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            cc.log(`----------------Current invalid Caches------------------`);
            cc.log(JSON.stringify(invalidContent));
        }

        if (this._resMap.size > 0) {
            cc.log(`----------------Current resource reference Caches------------------`);
            content = [];
            this._resMap.forEach((value, key) => {
                let item = { url: key, data: { refCount: value.refCount, url: value.url, retain: value.retain } };
                content.push(item);
            });
            cc.log(JSON.stringify(content));
        }
    }

}

export function resCaches(){
    return getSingleton(ResCaches);
}

class ResCaches {
    private static _instance: ResCaches = null;
    private logTag = `[ResCaches] `;
    public static Instance() { return this._instance || (this._instance = new ResCaches()); }
    //缓存
    private _caches = new Map<string, ResourceCacheData>();

    public isInvalid( cache : ResourceCacheData ){
       return cache.isLoaded && cache.data && !cc.isValid(cache.data);
    }

    public get(url: string , isCheck : boolean = true): ResourceCacheData {
        if (this._caches.has(url)) {
            let cache = this._caches.get(url);
            if ( isCheck && this.isInvalid(cache) ) {
                //资源已经被释放
                cc.warn(`资源加载完成，但已经被释放 , 重新加载资源 : ${url}`);
                this.remove(url);
                return null;
            }
            return this._caches.get(url);
        }
        return null;
    }

    public set(url: string, data: ResourceCacheData) {
        this._caches.set(url, data);
    }

    public remove(url: string) {
        return this._caches.delete(url);
    }

    /**
     * @description 确保资源已经加载完成，如果资源正在加载中，会直接返回null
     * @param url 
     */
    public getAudioClip(url: string) {
        return this.getCacheSync(url, cc.AudioClip);
    }

    public getAudioClipByAsync(url: string) {
        return this.getCacheByAsync(url, cc.AudioClip);
    }

    /**
     * @description 确保资源已经加载完成，如果资源正在加载中，会直接返回null
     * @param url 
     */
    public getPrefab(url: string) {
        return this.getCacheSync(url, cc.Prefab);
    }

    /**
     * @description 确保资源已经加载完成，如果资源正在加载中，会直接返回null
     * @param url 
     * @param type 资源类型
     */
    public getCacheSync<T extends cc.Asset>(url: string, type: { prototype: T }): T;
    public getCacheSync(url: string)
    public getCacheSync() {
        let args: { url: string, type?: typeof cc.Asset } = this._getGetCacheArgs.apply(this, arguments);
        if (args) {
            let cache = this.get(args.url);
            if (cache) {
                if (args.type) {
                    if (cache.data instanceof args.type) {
                        return cache.data;
                    }
                }
                else {
                    return cache.data;
                }
            }
        }
        return null;
    }

    /**
     * @description 如果资源正在加载中，会等待资源加载完成后返回，否则直接返回null
     * @param url 
     * @param type 资源类型
     */
    public getCache<T extends cc.Asset>(url: string, type: { prototype: T }): Promise<T>;
    public getCache(url: string): Promise<typeof cc.Asset>
    public getCache() {
        let args = arguments;
        let me = this;
        return new Promise<any>((resolve) => {
            let _args: { url: string, type?: typeof cc.Asset } = this._getGetCacheArgs.apply(this, args);
            if (!_args) {
                resolve(null);
                return;
            }
            let cache = me.get(_args.url);
            if (cache) {
                if (cache.isLoaded) {
                    //已经加载完成
                    if (_args.type) {
                        if (cache.data instanceof _args.type) {
                            resolve(cache.data);
                        } else {
                            if (CC_DEBUG) cc.error(`${this.logTag}传入类型:${cc.js.getClassName(_args.type)}与资源实际类型: ${cc.js.getClassName(cache.data)}不同 url : ${cache.url}`);
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
     */
    public getCacheByAsync<T extends cc.Asset>(url: string, type: { prototype: T }): Promise<T>;
    public getCacheByAsync() {
        let me = this;
        let args: { url: string, type: typeof cc.Asset } = this._getGetCacheByAsyncArgs.apply(this, arguments);
        return new Promise<any>((resolve) => {
            if (!args) {
                resolve(null);
                return;
            }
            me.getCache(args.url, args.type).then((data) => {
                if (data && data instanceof args.type) {
                    resolve(data);
                }
                else {
                    loader().loadRes({ url: args.url, type: args.type }, (cache) => {
                        if (cache && cache.data && cache.data instanceof args.type) {
                            resolve(cache.data);
                        }
                        else {
                            cc.error(`${this.logTag}加载失败 : ${args.url}`);
                            resolve(null);
                        }
                    });
                }
            });
        });
    }

    public getSpriteFrameByAsync(urls: string[], key: string, view: UIView, addExtraLoadResource: (view: UIView, info: ResourceInfo) => void) {
        let me = this;
        return new Promise<{ url: string, spriteFrame: cc.SpriteFrame, isTryReload?: boolean }>((resolve) => {

            let nIndex = 0;

            let getFun = (url) => {
                let info = new ResourceInfo;
                info.type = cc.SpriteAtlas;
                info.url = url;
                addExtraLoadResourceReference(view, info);
                me.getCacheByAsync(url, cc.SpriteAtlas).then((atlas) => {
                    let info = new ResourceInfo;
                    info.url = url;
                    info.type = cc.SpriteAtlas;
                    info.data = atlas;
                    addExtraLoadResource(view, info);
                    if (atlas) {
                        let spriteFrame = atlas.getSpriteFrame(key);
                        if (spriteFrame) {
                            if (cc.isValid(spriteFrame)) {
                                resolve({ url: url, spriteFrame: spriteFrame });
                            } else {
                                //来到这里面，其实程序已经崩溃了，已经没什么意思，也不知道写这个有啥用，尽量安慰,哈哈哈
                                cc.error(`精灵帧被释放，释放当前无法的图集资源 url ：${url} key : ${key}`);
                                loader().releasePreReference(info);
                                loader().releaseAsset(info);
                                //删除当前无效的缓存
                                this.remove(url);
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



    private _getGetCacheArgs(): { url: string, type?: typeof cc.Asset } {
        if (arguments.length < 1 || typeof arguments[0] != "string") {
            if (CC_DEBUG) cc.error(`${this.logTag}传入第一个参数有错误,必须是string`);
            return null;
        }
        let ret: { url: string, type?: typeof cc.Asset } = { url: arguments[0] };

        if (arguments.length >= 2) {
            if (cc.js.isChildClassOf(arguments[1], cc.Asset)) {
                //如果是资源类型才做处理
                ret.type = arguments[1];
            } else {
                if (CC_DEBUG) cc.error(`${this.logTag}传入类型有误`);
            }
        }
        return ret;
    }

    private _getGetCacheByAsyncArgs(): { url: string, type: typeof cc.Asset } {
        if (arguments.length < 2) {
            if (CC_DEBUG) cc.error(`${this.logTag}参数传入有误，必须两个参数`);
            return null;
        }
        if (typeof arguments[0] != "string") {
            if (CC_DEBUG) cc.error(`${this.logTag}传入第一个参数有误,必须是string`);
            return null;
        }

        if (!cc.js.isChildClassOf(arguments[1], cc.Asset)) {
            if (CC_DEBUG) cc.error(`${this.logTag}传入的第二个参数有误,必须是cc.Asset的子类`);
            return null;
        }
        return { url: arguments[0], type: arguments[1] };
    }

    /**@description 显示当前资源缓存信息 */
    public showCaches() {
        cc.log(`---- ${this.logTag} showCaches ----`);
        let content = [];
        let invalidContent = [];
        this._caches.forEach((data, key, source) => {
            let itemContent = { url: data.url, isLoaded: data.isLoaded, isValid: cc.isValid(data.data), assetType: cc.js.getClassName(data.assetType), data: data.data ? cc.js.getClassName(data.data) : null, status: data.status }
            let item = { url: key, data: itemContent };

            if (data.isLoaded && data.data && !cc.isValid(data.data)) {
                invalidContent.push(item);
            } else {
                content.push(item);
            }
        });
        if (content.length > 0) {
            cc.log(`----------- Current valid caches -----------`);
            cc.log(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
            cc.log(`----------- Current invalid caches -----------`);
            cc.log(JSON.stringify(invalidContent));
        }
    }
}
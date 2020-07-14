import { getSingleton } from "../base/Singleton";
import { ResourceCacheData, BUNDLE_TYPE, ResourceInfo } from "../base/Defines";
import { assetManager } from "./AssetManager";
import UIView from "../ui/UIView";

/**@description 资源管理器 */
export function cacheManager() {
    return getSingleton(CacheManager);
}

class ResourceCache{

    private _caches = new Map<string , ResourceCacheData>();
    private name = "unknown";
    constructor( name : string ){
        this.name = name;
    }

    private isInvalid( cache : ResourceCacheData ){
        return cache.isLoaded && cache.data && !cc.isValid(cache.data);
    }

    public get( path : string , isCheck : boolean) : ResourceCacheData{
        if ( this._caches.has(path) ){
            let cache = this._caches.get(path);
            if (isCheck && this.isInvalid(cache) ){
                //资源已经释放
                cc.warn(`资源加载完成，但已经被释放 , 重新加载资源 : ${path}`);
                this.remove(path);
                return null;
            }
            return this._caches.get(path);
        }
        return null;
    }

    public set( path : string , data : ResourceCacheData ){
        this._caches.set(path,data);
    }

    public remove( path : string ){
        return this._caches.delete(path);
    }
}

class CacheManager {
    private logTag = `[CacheManager]: `;
    private static _instance: CacheManager = null;
    public static Instance() {
        return this._instance || (this._instance = new CacheManager());
    }

    public _bundles = new Map<string,ResourceCache>();

    public getBundle( bundle : BUNDLE_TYPE ){
        if ( typeof bundle == "string"){
            return bundle;
        }else{
            return bundle ? bundle.name : null;
        }
    }

    public get( bundle : BUNDLE_TYPE, path : string , isCheck : boolean = true): ResourceCacheData{
        let bundleName = this.getBundle(bundle);
        if ( bundleName && this._bundles.has(bundleName)){
            return this._bundles.get(bundleName).get(path,isCheck);
        }
        return null;
    }

    public set( bundle : BUNDLE_TYPE , path:string , data : ResourceCacheData){
        let bundleName = this.getBundle(bundle);
        if ( bundleName){
            if ( !this._bundles.has(bundleName) ){
                let cache = new ResourceCache(bundleName);
                cache.set(path,data);
                this._bundles.set(bundleName,cache);
            }else{
                this._bundles.get(bundleName).set(path,data);
            }
        }
    }

    public remove( bundle : BUNDLE_TYPE , path:string){
        let bundleName = this.getBundle(bundle);
        if ( bundleName ){
            if ( this._bundles.has(bundleName) ){
                return this._bundles.get(bundleName).remove(path);
            }
        }
        return false;
    }

    private _getGetCacheByAsyncArgs(): { url: string, type: typeof cc.Asset , bundle:BUNDLE_TYPE} {
        if (arguments.length < 3) {
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
        return { url: arguments[0], type: arguments[1] , bundle:arguments[2]};
    }

    /**
     * @description 如果资源正在加载中，会等待资源加载完成后返回，否则直接返回null
     * @param url 
     * @param type 资源类型
     * @param bundle
     */
    public getCache<T extends cc.Asset>(url: string, type: { prototype: T } , bundle : BUNDLE_TYPE): Promise<T>;
    public getCache() {
        let args = arguments;
        let me = this;
        return new Promise<any>((resolve) => {
            let _args : { url : string , type:typeof cc.Asset , bundle:BUNDLE_TYPE} = me._getGetCacheByAsyncArgs.apply(me,args);
            if (!_args) {
                resolve(null);
                return;
            }
            let cache = me.get(_args.bundle,_args.url);
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
     * @param bundle 
     */
    public getCacheByAsync<T extends cc.Asset>( url :string , type : { prototype : T} , bundle : BUNDLE_TYPE ) : Promise<T>;
    public getCacheByAsync(){
        let me = this;
        let args : { url : string , type:typeof cc.Asset , bundle:BUNDLE_TYPE} = this._getGetCacheByAsyncArgs.apply(this,arguments);
        return new Promise<any>((resolve)=>{
            if ( !args){
                resolve(null);
                return;
            }
            me.getCache(args.url,args.type,args.bundle).then((data)=>{
                if ( data && data instanceof args.type ){
                    resolve(data);
                }else{
                    //加载资源
                    assetManager().load(args.bundle,args.url,args.type,null,(cache)=>{
                        if ( cache && cache.data && cache.data instanceof args.type ){
                            resolve(cache.data);
                        }else{
                            cc.error(`${this.logTag}加载失败 : ${args.url}`);
                            resolve(null);
                        }
                    });
                }
            });
        });
    }

    public getSpriteFrameByAsync(urls: string[], key: string, view: UIView, addExtraLoadResource: (view: UIView, info: ResourceInfo) => void,bundle:BUNDLE_TYPE) {
        let me = this;
        return new Promise<{ url: string, spriteFrame: cc.SpriteFrame, isTryReload?: boolean }>((resolve) => {
            let nIndex = 0;
            let getFun = (url) => {
                me.getCacheByAsync(url, cc.SpriteAtlas,bundle).then((atlas) => {
                    let info = new ResourceInfo;
                    info.url = url;
                    info.type = cc.SpriteAtlas;
                    info.data = atlas;
                    info.bundle = bundle;
                    addExtraLoadResource(view, info);
                    if (atlas) {
                        let spriteFrame = atlas.getSpriteFrame(key);
                        if (spriteFrame) {
                            if (cc.isValid(spriteFrame)) {
                                resolve({ url: url, spriteFrame: spriteFrame });
                            } else {
                                //来到这里面，其实程序已经崩溃了，已经没什么意思，也不知道写这个有啥用，尽量安慰,哈哈哈
                                cc.error(`精灵帧被释放，释放当前无法的图集资源 url ：${url} key : ${key}`);
                                assetManager().releaseAsset(info);
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
}
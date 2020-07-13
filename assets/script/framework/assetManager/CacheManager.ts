import { getSingleton } from "../base/Singleton";
import { ResourceCacheData } from "../base/Defines";

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

    public get( path : string , isCheck : boolean) : ResourceCacheData{
        return null;
    }

    public set( path : string , data : ResourceCacheData ){

    }

    public delete( path : string ){

    }
}

class CacheManager {
    private logTag = `[CacheManager]: `;
    private static _instance: CacheManager = null;
    public static Instance() {
        return this._instance || (this._instance = new CacheManager());
    }

    public _bundles = new Map<string,ResourceCache>();

    public getBundle( bundle : string | cc.AssetManager.Bundle ){
        if ( typeof bundle == "string"){
            return bundle;
        }else{
            return bundle ? bundle.name : null;
        }
    }

    public getCache( bundle : string | cc.AssetManager.Bundle, path : string , isCheck : boolean = true): ResourceCacheData{
        let bundleName = this.getBundle(bundle);
        if ( bundleName && this._bundles.has(bundleName)){
            return this._bundles.get(bundleName).get(path,isCheck);
        }
        return null;
    }

    public setCache( bundle : string | cc.AssetManager.Bundle , path:string , data : ResourceCacheData){
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

    public removeCache( bundle : string | cc.AssetManager.Bundle , path:string){
        let bundleName = this.getBundle(bundle);
        if ( bundleName ){
            if ( this._bundles.has(bundleName) ){
                this._bundles.get(bundleName).delete(path);
            }
        }
    }
}
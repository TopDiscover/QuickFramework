import { getSingleton } from "../base/Singleton";
import { ResourceCacheData } from "../base/Defines";

/**@description 资源管理器 */
export function cacheManager() {
    return getSingleton(CacheManager);
}

class ResourceCache{

    public get( path : string) : ResourceCacheData{
        return null;
    }
}

class CacheManager {
    private logTag = `[CacheManager]: `;
    private static _instance: CacheManager = null;
    public static Instance() {
        return this._instance || (this._instance = new CacheManager());
    }

    public _bundles = new Map<string,ResourceCache>();

    public getCache( bundle : string | cc.AssetManager.Bundle, path : string ): ResourceCacheData{
        let bundleName = "";
        if ( typeof bundle == "string"){
            bundleName = bundle;
        }else{
            bundleName = bundle.name;
        }
        if ( this._bundles.has(bundleName)){
            return this._bundles.get(bundleName).get(path);
        }
        return null;
    }

    public setCache( bundle : string | cc.AssetManager.Bundle , path:string){
        
    }
}
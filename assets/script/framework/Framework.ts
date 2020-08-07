import { language } from "./base/Language";
import { eventDispatcher } from "./event/EventDispatcher";
import { dataBase } from "./database/DataBase";
import { uiManager } from "./base/UIManager";
import { localStorage } from "./base/LocalStorage";
import { AssetManager } from "./assetManager/AssetManager";
import { CacheManager } from "./assetManager/CacheManager";
import { ResolutionHelper } from "./adaptor/ResolutionHelper";
import { getSingleton } from "./base/Singleton";

export class _FramewokManager{
    
    /**@description 语言包 */
    get language( ){
        return language();
    }
    
    /**@description 事件派发器 */
    get eventDispatcher(){
        return eventDispatcher();
    }

    /**@description 数据库，仅web下可用 */
    get dataBase(){
        return dataBase();
    }

    /**@description 界面管理器 */
    get uiManager(){
        return uiManager();
    }

    /**@description 本地仓库 */
    get localStorage(){
        return localStorage();
    }

    /**@description 资源管理器 */
    get assetManager(){
        return getSingleton(AssetManager);
    }

    /**@description 资源缓存管理器 */
    get cacheManager(){
        return getSingleton(CacheManager);
    }

    /**@description 屏幕适配 */
    get resolutionHelper(){
        return getSingleton(ResolutionHelper);
    }
}

export const Manager = new _FramewokManager();

window["Manager"] = window["Manager"] || Manager;
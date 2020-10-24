import { Language } from "./base/Language";
import { EventDispatcher } from "./event/EventDispatcher";
import { UIManager } from "./base/UIManager";
import { LocalStorage } from "./base/LocalStorage";
import { AssetManager } from "./assetManager/AssetManager";
import { CacheManager } from "./assetManager/CacheManager";
import { ResolutionHelper } from "./adaptor/ResolutionHelper";
import { getSingleton } from "./base/Singleton";
import TipsDelegate from "./ui/TipsDelegate";
import UILoadingDelegate from "./ui/UILoadingDelegate";

export class _FramewokManager{
    
    /**@description 语言包 */
    get language( ){
        return getSingleton(Language);
    }
    
    /**@description 事件派发器 */
    get eventDispatcher(){
        return getSingleton(EventDispatcher);
    }

    /**@description 界面管理器 */
    get uiManager(){
        return getSingleton(UIManager);
    }

    /**@description 本地仓库 */
    get localStorage(){
        return getSingleton(LocalStorage);
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

    private _tips : TipsDelegate = null
    /**@description 小提示 */
    get tips(){
        return this._tips;
    }
    set tips( value : TipsDelegate ){
        this._tips = value
    }

    private _uiLoading : UILoadingDelegate = null;
    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading(){
        return this._uiLoading;
    }
    set uiLoading( value : UILoadingDelegate){
        this._uiLoading = value
    }
}

export const Manager = new _FramewokManager();
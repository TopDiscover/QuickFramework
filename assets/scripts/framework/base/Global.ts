/**@description 请不要在此文件中引用其它文件 */

import { Asset, isValid } from "cc";

/**
 * @description 绑定对象到名字空间
 * @param key 
 * @param value 
 */
export function toNamespace(key:string,value:any):void{
    createNamespace();
    (<any>td)[key] = value;
}

export function createNamespace() {
    if (!window.td){
        (<any>window.td) = {};
    }
}

export const COMMON_LANGUAGE_NAME = "COMMON_LANGUAGE_NAME";

let TAG = {
    NetEvent: "NetEvent_",
};

export let EventApi = {
    NetEvent: {
        ON_OPEN: TAG.NetEvent + "ON_OPEN",
        ON_CLOSE: TAG.NetEvent + "ON_CLOSE",
        ON_ERROR: TAG.NetEvent + "ON_ERROR",
    },
    AdaptScreenEvent: "AdaptScreenEvent",
    CHANGE_LANGUAGE: "CHANGE_LANGUAGE",
}

export enum CustomNetEventType {
    /**@description 应用层主动调用网络层close */
    CLOSE = "CustomClose",
}

/**@description 网络数据全以大端方式进行处理 */
export const USING_LITTLE_ENDIAN = false;

/**@description 语言包路径使用前缀 */
export const USING_LAN_KEY = "i18n.";

/**@description 是否允许游戏启动后切换语言 */
export const ENABLE_CHANGE_LANGUAGE = true;

/**@description 远程资源bundle名 */
export const BUNDLE_REMOTE = "__Remote__Caches__";

/**@description resources 目录bundle名 */
export const BUNDLE_RESOURCES = 'resources';

/**
 * @description 界面视图状态
 * 界面控制器,各界面的类名不能相同，即使是放在不同文件夹下面，也会认为是同一类型，建议加上模块前缀
 */

 export enum ViewStatus {
    /**@description 等待关闭 */
    WAITTING_CLOSE,
    /**@description 等待隐藏 */
    WATITING_HIDE,
    /**@description 无状态 */
    WAITTING_NONE,
}

/**
 * @description 资源加载缓存数据 
 */
 export enum ResourceCacheStatus {
    /**@description 无状态 */
    NONE,
    /**@description 等待释放 */
    WAITTING_FOR_RELEASE,
}

/**@description 资源类型 */
export enum ResourceType {
    /**@description 本地 */
    Local,
    /**@description 远程资源 */
    Remote,
}

/**@description 资源信息 */
export class ResourceInfo {
    url: string = "";
    type: typeof Asset = null!;
    data: Asset | Asset[] = null!;
    /**@description 是否常驻内存，远程加载资源有效 */
    retain: boolean = false;
    bundle: BUNDLE_TYPE = null!;
    /**@description 默认为本地资源 */
    resourceType: ResourceType = ResourceType.Local;
}

export class ResourceCacheData {
    /**@description 是否已经加载完成 */
    isLoaded: boolean = false;
    /**@description 加载完成数据 
     * cc.Prefab 
     * cc.SpriteAtlas 
     * cc.SpriteFrame 
     * cc.AudioClip 
     * cc.Font 
     * sp.SkeletonData 
     * cc.ParticleAsset 
     * cc.Texture2D
     * cc.JsonAsset
     * */
    data: Asset | Asset[] | null = null;

    info: ResourceInfo = new ResourceInfo();

    status = ResourceCacheStatus.NONE;

    /**@description 在加载过程中有地方获取,加载完成后再回调 */
    getCb: ((data: any) => void)[] = [];

    /**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
    finishCb: ((data: any) => void)[] = [];

    public doGet(data: any) {
        for (let i = 0; i < this.getCb.length; i++) {
            if (this.getCb[i]) this.getCb[i](data);
        }
        this.getCb = [];
    }

    public doFinish(data: any) {
        for (let i = 0; i < this.finishCb.length; i++) {
            if (this.finishCb[i]) this.finishCb[i](data);
        }
        this.finishCb = [];
    }

    public get isInvalid() {
        if (this.isLoaded && this.data && !isValid(this.data)){
            return true;
        }
        return false;
    }
}
toNamespace("ResourceCacheData",ResourceCacheData);
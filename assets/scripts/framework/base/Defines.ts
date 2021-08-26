
import { Asset, isValid } from "cc";
import UIView from "../ui/UIView";
import { Service } from "./Service";

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

export interface ResourceData {
    /**@description resources 目录url 与 type 必须成对出现*/
    url?: string,
    /**@description 资源类型 与 url 必须成对出现 目前支持预加载的资源有cc.Prefab | cc.SpriteFrame | sp.SkeletonData*/
    type?: typeof Asset,
    /**
     * @description 预加载界面，不需要对url type赋值 
     * 如GameView游戏界面，需要提前直接加载好界面，而不是只加载预置体，
     * 在网络消息来的时间，用预置体加载界面还是需要一定的时间，
     * 从而会造成消息处理不是顺序执行 
     * */
    preloadView?: td.UIClass<UIView>,
    bundle?: BUNDLE_TYPE,
    /**@description 如果是加载的目录，请用dir字段 */
    dir?: string,
}

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

export interface ServiceEvent {
    service: Service;
    event: Event;
}

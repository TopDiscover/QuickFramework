/*
 * @Author: your name
 * @Date: 2019-11-20 19:04:21
 * @LastEditTime: 2020-04-01 18:06:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ddz\assets\framework\loader\Defines.ts
 */
import UIView, { UIClass } from "../ui/UIView";

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
export class ResourceInfo{
    url : string = "";
    type : typeof cc.Asset = null;
    data : cc.Asset = null;
    assetUrl : string = "";
    /**@description 是否常驻内存，远程加载资源有效 */
    retain : boolean = false;
    bundle:BUNDLE_TYPE = null;
}

export class ResourceCacheData {

    /**@description 加载资源url地址 */
    url: string = "";
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
    data: cc.Asset = null;

    /**@description 加载资源类型 */
    assetType: typeof cc.Asset = null;

    status = ResourceCacheStatus.NONE;

    bundle:BUNDLE_TYPE = null;

    /**@description 在加载过程中有地方获取,加载完成后再回调 */
    getCb: ((data: any) => void)[] = [];

    /**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
    finishCb: ((data: any) => void)[] = [];

    /**@description jsb下载完成回调 */
    jsbFinishCb: (data: any) => void = null;

    /**@description 远程下载资源保存本地的物理路径，仅在JSB情况下有效 */
    jsbStoragePath: string = null;

    /**@description 默认为本地资源 */
    resourceType: ResourceType = ResourceType.Local;

    public doGet(data) {
        for (let i = 0; i < this.getCb.length; i++) {
            if (this.getCb[i]) this.getCb[i](data);
        }
        this.getCb = [];
    }

    public doFinish(data) {
        for (let i = 0; i < this.finishCb.length; i++) {
            if (this.finishCb[i]) this.finishCb[i](data);
        }
        this.finishCb = [];
    }

    public doJsbFinish(data) {
        if (this.jsbFinishCb) {
            this.jsbFinishCb(data);
        }
        this.jsbFinishCb = null;
    }
}

export interface ResourceData {
    /**@description resources 目录url 与 type 必须成对出现*/
    url?: string,
    /**@description 资源类型 与 url 必须成对出现 目前支持预加载的资源有cc.Prefab | cc.SpriteFrame | sp.SkeletonData*/
    type?: typeof cc.Asset,
    /**
     * @description 预加载界面，不需要对url type赋值 
     * 如GameView游戏界面，需要提前直接加载好界面，而不是只加载预置体，
     * 在网络消息来的时间，用预置体加载界面还是需要一定的时间，
     * 从而会造成消息处理不是顺序执行 
     * */
    preloadView?: UIClass<UIView>,
    bundle?:BUNDLE_TYPE,
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

export type BUNDLE_TYPE = string | cc.AssetManager.Bundle;

export const BUNDLE_RESOURCES = 'resources';

export const BUNDLE_REMOTE = "__Remote__Caches__";

/**@description 是否允许游戏启动后切换语言 */
export const ENABLE_CHANGE_LANGUAGE = false;
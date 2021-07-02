import { Asset, AssetManager, sp, SpriteFrame } from "cc";
import { BUNDLE_TYPE, ResourceCacheData, ResourceInfo } from "../base/Defines";
import { ISingleManager } from "./ISingleManager";

export interface IRemoteLoader {
    /**
     * @description 加载远程资源图片
     * @param url 远程地址
     * @param isNeedCache 是否需要缓存 
     * */
    loadImage(url: string, isNeedCache: boolean): Promise<SpriteFrame | null>;

    /**
     * @description 加载远程spine动画
     * @param path 远程地址
     * @param name 动画文件名
     * @param isNeedCache 是否需要缓存
     * @example http://www.xxx.com/cat
     * 其中path : http://www.xxx.com
     * name : cat
     * 接口会自动拼接找出这三个文件的地址
     */
    loadSkeleton(path: string, name: string, isNeedCache: boolean): Promise<sp.SkeletonData | null>;
}

export interface IAssetManager extends ISingleManager {

    readonly remote: IRemoteLoader;
    /**
     * @description 获取Bundle
     * @param bundle Bundle名|Bundle
     */
    getBundle(bundle: BUNDLE_TYPE): AssetManager.Bundle | null;
    getBundleName(bundle: BUNDLE_TYPE): string | null;
    /**@description 加载bundle */
    loadBundle(nameOrUrl: string, onComplete: (err: Error, bundle: AssetManager.Bundle) => void): void;
    /**@description 移除bundle */
    removeBundle(bundle: BUNDLE_TYPE): void;
    /**
     * @description 加载本地资源
     * @param bundle 
     * @param path 
     * @param type 
     * @param onProgress 
     * @param onComplete 
     */
    load(
        bundle: BUNDLE_TYPE,
        path: string,
        type: typeof Asset,
        onProgress: (finish: number, total: number, item: AssetManager.RequestItem) => void,
        onComplete: (data: ResourceCacheData) => void): void;
    /**
     * @description 加载目录
     * @param bundle 
     * @param path 
     * @param type 
     * @param onProgress 
     * @param onComplete 
     */
    loadDir(
        bundle: BUNDLE_TYPE,
        path: string,
        type: typeof Asset,
        onProgress: (finish: number, total: number, item: AssetManager.RequestItem) => void,
        onComplete: (data: ResourceCacheData) => void): void;
    /**@description 释放资源 */
    releaseAsset(info: ResourceInfo): void;
    /**@description 添加资源引用计数 */
    retainAsset(info: ResourceInfo): void;
    /**
     * @description 添加常驻资源
     * @param prefab 
     */
    addPersistAsset(url: string, data: Asset, bundle: BUNDLE_TYPE): void;

}
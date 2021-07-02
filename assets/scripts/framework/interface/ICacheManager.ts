import { Asset, SpriteFrame } from "cc";
import { BUNDLE_TYPE, ResourceCacheData, ResourceInfo } from "../base/Defines";
import UIView from "../ui/UIView";
import { ISingleManager } from "./ISingleManager";

/**@description 本地缓存 */
export interface IResourceCache {
    /**@description 输出Cache信息 */
    print(): void;
    get(path: string, isCheck: boolean): ResourceCacheData | null | undefined;
    set(path: string, data: ResourceCacheData): void;
    remove(path: string): void;
    removeUnuseCaches(): void;
}

/**@description 远程缓存 */
export interface IRemoteCaches {
    set(url: string, data: ResourceCacheData): void;
    get(url: string): ResourceCacheData | null | undefined;
    getSpriteFrame(url: string): ResourceCacheData | null | undefined;
    setSpriteFrame(url: string, data: any): SpriteFrame | null;
    retainAsset(info: ResourceInfo): void;
    releaseAsset(info: ResourceInfo): void;
    remove(url: string): boolean;
    showCaches(): void;
}

export interface ICacheManager extends ISingleManager {
    readonly remoteCaches: IRemoteCaches;
    getBundleName(bundle: BUNDLE_TYPE): string | null;
    set(bundle: BUNDLE_TYPE, path: string, data: ResourceCacheData): void;
    get(bundle: BUNDLE_TYPE, path: string, isCheck?: boolean): ResourceCacheData | null | undefined;
    remove(bundle: BUNDLE_TYPE, path: string): boolean;
    removeWithInfo(info: ResourceInfo): boolean;
    removeBundle(bundle: BUNDLE_TYPE): void;
    /**
     * @description 如果资源正在加载中，会等待资源加载完成后返回，否则直接返回null
     * @param url 
     * @param type 资源类型
     * @param bundle
     */
    getCache<T extends Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<T>;
    /**
    * @description 异步获取资源，如果资源未加载，会加载完成后返回
    * @param url 
    * @param type 
    * @param bundle 
    */
    getCacheByAsync<T extends Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<T>;
    getSpriteFrameByAsync(
        urls: string[],
        key: string,
        view: UIView,
        addExtraLoadResource: (view: UIView, info: ResourceInfo) => void,
        bundle: BUNDLE_TYPE): Promise<{
            url: string;
            spriteFrame: SpriteFrame | null;
            isTryReload?: boolean | undefined;
        }>;
    /**@description 打印当前缓存资源 */
    printCaches(): void;
}
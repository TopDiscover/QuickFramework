
/**
 * 资源释放管理
 * DateTime = Mon Dec 13 2021 20:58:18 GMT+0800 (中国标准时间)
 * Author = zheng_fasheng
 */

import { Asset, assetManager, Node, isValid, tween, Tween, Prefab, AssetManager, SpriteFrame, Texture2D, sp, JsonAsset, TextAsset } from "cc";
import { Macro } from "../../defines/Macros";
import { Resource } from "./Resource";
import { ViewAsset } from "./ViewAsset";
import { ViewStatus } from "../../defines/Enums";
import { DEBUG } from "cc/env";

const LOG_TAG = "【释放管理器】 : ";

class LazyInfo {

    private name: string = "";
    constructor(name: string) {
        this.name = name;
    }

    private _caches: Map<string, Resource.Cache> = new Map();

    /**@description 放入懒释放资源 */
    add(cache: Resource.Cache) {

        //管理器引用加1
        if (Array.isArray(cache.data)) {
            cache.refCount++;
            Log.d(`${LOG_TAG}向${this.name}加入待释放目录:${cache.key}`);
            for (let i = 0; i < cache.data.length; i++) {
                if (cache.data[i]) {
                    cache.data[i].addRef();//为释放管理器添加引用计数
                }
            }
        } else {
            if (cache.data) {
                Log.d(`${LOG_TAG}向${this.name}加入待释放资源:${cache.key}`);
                cache.data.addRef();//为释放管理器添加引用计数
            }
        }
        if ( cache.inputStamp ){
            cache.stamp = cache.inputStamp;
            cache.inputStamp = null!;
        }else{
            cache.stamp = Date.timeNow();
        }
        
        this._caches.set(cache.key, cache);
    }

    /**
     * @description 获取缓存
     * @param key  Resource.getKey(url,type) 的值
     * @returns 
     */
    get(key: string) {
        let cache = this._caches.get(key);
        if (cache) {
            if (Array.isArray(cache.data)) {
                for (let i = 0; i < cache.data.length; i++) {
                    if (cache.data[i]) {
                        cache.data[i].decRef(false);
                    }
                }
                Log.d(`${LOG_TAG}向${this.name}获取待释放目录:${cache.key}`);
                this._caches.delete(key);
                return cache;
            } else {
                if (isValid(cache.data)) {
                    //获取后删除当前管理器的引用
                    cache.data.decRef(false);
                    Log.d(`${LOG_TAG}向${this.name}获取待释放资源:${cache.key}`);
                    this._caches.delete(key);
                    return cache;
                } else {
                    Log.w(`${LOG_TAG}向${this.name}获取待释放资源时，资源${cache.key}已经释放`);
                    this._caches.delete(key);
                    return null;
                }
            }
        }
        return null;
    }

    onLowMemory() {
        if (this._caches.size > 0) {
            Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载的资源`);
            if (this.name == Macro.BUNDLE_REMOTE) {
                this._caches.forEach((cache, key, source) => {
                    if (cache.data instanceof Asset) {
                        Log.d(`${LOG_TAG} 释放远程加载资源${cache.description}`);
                        assetManager.releaseAsset(cache.data as Asset);
                    }
                });
                this._caches.clear();
                return;
            }
            let bundle = assetManager.getBundle(this.name);
            if (bundle) {
                //先释放预置，再释放资源
                //不然再释放资源的时候，预置有可能在使用该资源，导致资源得不到释放
                this._caches.forEach((cache, key) => {
                    if (Array.isArray(cache.data)) {
                        if (cache.type == Prefab) {
                            this.release(cache, bundle!);
                            this._caches.delete(cache.key);
                        }
                    } else {
                        if (cache.data instanceof Prefab) {
                            this.release(cache, bundle!);
                            this._caches.delete(key);
                        }
                    }
                })

                this._caches.forEach(info => {
                    this.release(info, bundle!);
                });
                this._caches.clear();
            } else {
                Log.w(`${LOG_TAG}释放bundle : ${this.name} 时，Bundle已经被释放，直接清空待释放数据`);
                this._caches.clear();
            }
        }
    }

    tryRemove(bundle: BUNDLE_TYPE) {
        if (this.name != bundle) {
            return;
        }
        this.onLowMemory();
    }

    protected release(cache: Resource.Cache, bundle: AssetManager.Bundle) {
        if (Array.isArray(cache.data)) {
            Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载目录${cache.fullUrl}`);
            for (let i = 0; i < cache.data.length; i++) {
                if (cache.data[i]) {
                    cache.data[i].decRef(false);
                    let path = `${cache.fullUrl}/${cache.data[i].name}`;
                    if (cache.data[i].refCount <= 0) {
                        bundle?.release(path, cache.type);
                        Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载资源${path}`);
                    } else {
                        Log.w(`${LOG_TAG}bundle : ${this.name} 资源${path}正使用中引用计数为:${cache.data[i].refCount}`)
                    }
                }
            }
        } else {
            if (isValid(cache.data)) {
                //获取后删除当前管理器的引用
                cache.data.decRef(false);

                if (cache.data.refCount <= 0) {
                    bundle?.release(cache.url, cache.type);
                    Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载资源${cache.url}`);
                } else {
                    Log.w(`${LOG_TAG}bundle : ${this.name} 资源${cache.url}正使用中引用计数为:${cache.data.refCount}`)
                }
            }
        }
    }

    /**@description 尝试释放长时间未使用资源 */
    tryRemoveTimeoutResources() {
        if (App.isLazyRelease && App.isAutoReleaseUnuseResources) {
            this._caches.forEach((cache, key, source) => {
                if (cache.retain) {
                    return;
                }
                if (cache.stamp == null) {
                    return;
                }
                let now = Date.timeNow();
                let pass = now - cache.stamp;
                if (pass >= App.autoReleaseUnuseResourcesTimeout) {

                    if (this.name == Macro.BUNDLE_REMOTE) {
                        if (cache.data instanceof Asset) {
                            Log.d(`${LOG_TAG}bundle : ${this.name} 释放远程加载资源${cache.url}`);
                            assetManager.releaseAsset(cache.data as Asset);
                        }
                        this._caches.delete(key);
                        return;
                    }

                    //释放长时间未使用资源
                    let bundle = App.bundleManager.getBundle(cache.bundle);
                    this.release(cache, bundle!);
                    this._caches.delete(key);
                }
            })
        }
    }

    get assets() {
        return this._caches;
    }
}

export class ReleaseManager implements ISingleton {
    static module: string = LOG_TAG;
    isResident?: boolean = true;
    module: string = null!;
    /**@description 待释放资源 */
    private _lazyInfos: Map<string, LazyInfo> = new Map();
    /**@description 待释放bundle */
    private _bundles: Map<string, boolean> = new Map();
    /**@description 远程资源 */
    private _remote: LazyInfo = new LazyInfo(Macro.BUNDLE_REMOTE);
    /**@description 界面资源 */
    private _uiDatas = new Map<string,ViewAsset.Data>;

    private _actionTag = 999;

    private getBundle(bundle: BUNDLE_TYPE) {
        return App.bundleManager.getBundle(bundle);
    }

    private getBundleName(bundle: BUNDLE_TYPE) {
        return App.bundleManager.getBundleName(bundle);
    }

    release(cache: Resource.Cache) {
        let bundle = this.getBundle(cache.bundle);
        if (bundle) {
            if (App.isLazyRelease) {
                let name = bundle.name
                //如果是懒释放，记录一下就行了
                let lazyInfo: LazyInfo | undefined;
                if (this._lazyInfos.has(name)) {
                    lazyInfo = this._lazyInfos.get(name);
                } else {
                    lazyInfo = new LazyInfo(name);
                    this._lazyInfos.set(name, lazyInfo);
                }

                if (App.cache.removeWithInfo(cache, bundle)) {
                    if (lazyInfo) {
                        lazyInfo.add(cache);
                    }
                    App.cache.remove(cache);
                }
            } else {
                App.cache.removeWithInfo(cache, bundle);
            }
        } else {
            Log.e(`${LOG_TAG}${cache.bundle} no found`);
        }
    }

    get(bundle: BUNDLE_TYPE, key: string) {
        let temp = this.getBundle(bundle);
        if (temp) {
            let info = this._lazyInfos.get(temp.name);
            if (info) {
                return info.get(key);
            }
        } else {
            Log.w(`${LOG_TAG}${bundle}不存在，删除释放管理器中的缓存`);
            let name = this.getBundleName(bundle);
            this.onLoadBundle(name);
            this._lazyInfos.delete(name);
        }
        return null;
    }

    removeBundle(bundle: BUNDLE_TYPE) {
        let temp = this.getBundle(bundle);
        if (App.isLazyRelease) {
            if (temp) {
                Log.d(`${LOG_TAG}向释放管理器中添加待释放bundle : ${temp?.name}`);
                this._bundles.set(temp?.name, false);
            }
        } else {
            Log.d(`${LOG_TAG}释放Bundle : ${temp?.name}`);
            temp?.releaseAll();
            if (temp) assetManager.removeBundle(temp);
        }
    }

    onLoadBundle(bundle: string) {
        this._bundles.delete(bundle);
    }

    /**
     * @description 判断bundle是否存在于释放管理器中
     */
    isExistBunble(bundle: BUNDLE_TYPE) {
        if (App.isLazyRelease) {
            //开启了懒释放功能
            let name = this.getBundleName(bundle);
            if (this._bundles.has(name)) {
                return true;
            }
            return false;
        } else {
            //未开启，在释放之前已经获取过了，严格来说，不可能走到这里
            return false;
        }
    }

    onLowMemory() {
        Log.d(`${LOG_TAG}------------收到内存警告，释放无用资源------------`);

        //先释放UI资源
        this._uiDatas.forEach((v,k)=>{
            if( isValid(v.view) && isValid(v.node) ){
                v.node.destroy();
            }
            v.loadData.clear();
            if( v.isPrefab ){
                App.asset.releaseAsset(v.cache);
            }
            this._uiDatas.delete(k);
        })

        this._lazyInfos.forEach((info, key, source) => {
            info.onLowMemory();
        });

        Log.d(`${LOG_TAG}-------------释放无用bundle-------------`);
        this._bundles.forEach((value, bundle) => {
            let temp = assetManager.getBundle(bundle);
            if (temp) {
                if (App.bundleManager.isEngineBundle(bundle)) {
                    Log.d(`${bundle} : 引擎bundle，跳过处理`)
                    return;
                }
                Log.d(`释放无用bundle : ${bundle}`);
                temp.releaseAll();
                assetManager.removeBundle(temp);
                this._bundles.delete(bundle);
            }
        });

        Log.d(`${LOG_TAG}-------------释放无用远程资源-------------`);
        this._remote.onLowMemory();
    }

    onAutoReleaseUnuseResources() {
        Log.d(`${LOG_TAG}------------释放长时间未使用资源开始------------`);
        let curBundle = App.stageData.where;

        //释放UI 资源
        let now = Date.timeNow();
        this._uiDatas.forEach((v,k)=>{
            let pass = now - v.cache.stamp!;
            if (pass >= App.autoReleaseUnuseResourcesTimeout) {
                Log.d(`${this.module} 释放UI资源 : ${v.name} 开始`)
                v.updateStamp();
                if( isValid(v.view) && isValid(v.node) ){
                    v.node.destroy();
                }
                v.loadData.clear();
                if( v.isPrefab ){
                    Log.d(`${this.module} 释放UI预置体 : ${v.cache.fullUrl}`)
                    App.asset.releaseAsset(v.cache);
                }
                Log.d(`${this.module} 释放UI资源 : ${v.name} 结束`)
                this._uiDatas.delete(k);
            }
        });

        //排除当前bundle的资源，当前bundle正在运行，没有必要释放当前bundle资源
        this._lazyInfos.forEach((info, bundle, source) => {
            if (bundle == curBundle) {
                return;
            }
            info.tryRemoveTimeoutResources()
        });

        Log.d(`${LOG_TAG}-------------释放无用远程资源-------------`);
        this._remote.tryRemoveTimeoutResources();

        Log.d(`${LOG_TAG}------------释放长时间未使用资源结束------------`);
    }

    /**@description 尝试释放指定bundel的资源 */
    tryRemoveBundle(bundle: BUNDLE_TYPE) {
        Log.d(`${LOG_TAG}--------------尝试释放${bundle}加载资源------------`);

        //先释放UI资源
        this._uiDatas.forEach((v,k)=>{
            if ( v.bundle == bundle ){
                if( isValid(v.view) && isValid(v.node) ){
                    v.node.destroy();
                }
                v.loadData.clear();
                if( v.isPrefab ){
                    App.asset.releaseAsset(v.cache);
                }
                this._uiDatas.delete(k);
            }
        })

        this._lazyInfos.forEach((info, key, source) => {
            info.tryRemove(bundle);
        });

        let name = this.getBundleName(bundle);
        let temp = assetManager.getBundle(name);
        if (temp) {
            Log.d(`释放无用bundle : ${name}`);
            temp.releaseAll();
            assetManager.removeBundle(temp);
            this._bundles.delete(name);
        }
    }

    getRemote(url: string, type: typeof Asset) {
        //返回的是数组
        let caches: Resource.Cache[] = [];
        if (type == SpriteFrame) {
            let spriteFrameCache = this._remote.get(Resource.getKey(url, type));
            let texture2DCache = this._remote.get(Resource.getKey(url, Texture2D));
            caches.push(spriteFrameCache!);
            caches.push(texture2DCache!);
        } else if (type == sp.SkeletonData) {
            let spineAtlas = `${url}.atlas`;
            let spinePng = `${url}.png`;
            let spineJson = `${url}.json`;
            let data = this._remote.get(Resource.getKey(url, type));
            let pngCache = this._remote.get(Resource.getKey(spinePng, Texture2D));
            let jsonCache = this._remote.get(Resource.getKey(spineJson, JsonAsset));
            let atlasCache = this._remote.get(Resource.getKey(spineAtlas, TextAsset));
            caches.push(data!);
            caches.push(pngCache!);
            caches.push(jsonCache!);
            caches.push(atlasCache!);
        } else {
            let cache = this._remote.get(Resource.getKey(url, type));
            caches.push(cache!);
        }
        return caches;
    }

    releaseRemote(cache: Resource.Cache, force: boolean = false) {
        if (App.isLazyRelease && !force) {
            this._remote.add(cache);
        } else {
            if (cache.data instanceof Asset) {
                assetManager.releaseAsset(cache.data as Asset);
            }
        }
    }

    /**@description 获取 UI 资源数据 */
    getUI( name : string ){
        let out = this._uiDatas.get(name);
        if ( out ){
            if ( isValid(out.view) && isValid(out.node) ){
                DEBUG && Log.d(`${this.module}获取待释放UI资源 : ${name}`)
            }else{
                DEBUG && Log.d(`${this.module}获取待释放UI资源 : ${name} 时，节点已经销毁`);
                out.loadData.clear();
                if ( out.isPrefab ){
                    App.asset.releaseAsset(out.cache);
                }
                out = undefined;
            }
            this._uiDatas.delete(name);
        }
        return out;
    }

    /**@description 释放 UI 资源数据 */
    releaseUI( data : ViewAsset.Data ){
        data.status = ViewStatus.WAITTING_CLOSE;
        if ( App.isLazyRelease && data.isCache ){
            let result = false;
            if( isValid(data.view) && isValid(data.node) ){
                result = true;
                data.node.removeFromParent();
                data.view.onClose();
                data.cache.stamp = Date.timeNow();
            }else{
                DEBUG && Log.d(`${this.module} 界面数据已经无效,尝试释放加载的资源`)
                data.loadData.clear();
                data.isPrefab && App.asset.releaseAsset(data.cache);
            }
            if ( result ){
                DEBUG && Log.d(`${this.module}加入待释放的UI资源${data.name}`);
                this._uiDatas.set(data.name,data);
            }
        }else{
            if( isValid(data.view) && isValid(data.node) ){
                data.node.removeFromParent();
                data.view.onClose();
                data.node.destroy();
            }
            data.loadData.clear();
            if( data.isPrefab ){
                App.asset.releaseAsset(data.cache);
            }
        }
    }

    onLoad(node: Node) {
        tween(node).repeatForever(tween(node)
            .delay(App.autoReleaseUnuseResourcesTimeout)
            .call(() => {
                this.onAutoReleaseUnuseResources();
            }))
            .tag(this._actionTag)
            .start()
    }

    onDestroy(node: Node) {
        Tween.stopAllByTag(this._actionTag);
    }

    debug() {
        let bundles: string[] = [];
        this._bundles.forEach((data, key, source) => {
            bundles.push(key);
        })
        let data = {
            lazyInfo: this._lazyInfos,
            bundles: bundles,
            remote: this._remote
        }
        Log.d(`--------------${this.module}调试信息如下--------------`)
        if (App.isLazyRelease) {

            this._uiDatas.forEach((v,k)=>{
                Log.d(`待释放UI ${k}`)
            })

            if (data.bundles.length > 0) {
                Log.d(`待释放Bundle : ${data.bundles.toString()}`);
            }
            if (data.lazyInfo.size > 0) {
                data.lazyInfo.forEach((value, key, source) => {
                    Log.d(`--------------${key}待释放资源--------------`);
                    value.assets.forEach((info, key, source) => {
                        Log.d(JSON.stringify(info.debug()));
                    })
                });
            }

            Log.d(`远程待释放资源`);
            data.remote.assets.forEach((info, key, source) => {
                Log.d(JSON.stringify(info.debug()));
            });

        } else {
            Log.w(`未开户懒释放功能!!!!`);
        }
    }
}

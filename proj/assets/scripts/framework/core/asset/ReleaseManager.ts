
/**
 * 资源释放管理
 * DateTime = Mon Dec 13 2021 20:58:18 GMT+0800 (中国标准时间)
 * Author = zheng_fasheng
 */

import { Asset, assetManager, AssetManager, isValid, sp } from "cc";
import { Macro } from "../../defines/Macros";
import { Resource } from "./Resource";

const LOG_TAG = "[ReleaseManager] : ";

class LazyInfo {


    private name: string = "";
    constructor(name: string) {
        this.name = name;
    }

    private _assets: Map<string, Resource.Info> = new Map();

    /**@description 放入懒释放资源 */
    add(info: Resource.Info) {

        //管理器引用加1
        if (Array.isArray(info.data)) {
            Log.d(`${LOG_TAG}向${this.name}加入待释放目录:${info.url}`);
            for (let i = 0; i < info.data.length; i++) {
                if (info.data[i]) {
                    info.data[i].addRef();
                }
            }
        } else {
            if (info.data) {
                Log.d(`${LOG_TAG}向${this.name}加入待释放资源:${info.url}`);
                info.data.addRef();
            }
        }
        this._assets.set(info.url, info);
    }

    get(url: string): Asset | Asset[] | null {
        let info = this._assets.get(url);
        let result: Asset | Asset[] | null = null;
        if (info) {
            if (Array.isArray(info.data)) {
                for (let i = 0; i < info.data.length; i++) {
                    if (info.data[i]) {
                        info.data[i].decRef(false);
                    }
                }
                Log.d(`${LOG_TAG}向${this.name}获取待释放目录:${info.url}`);
                result = info.data;
            } else {
                if (isValid(info.data)) {
                    //获取后删除当前管理器的引用
                    info.data.decRef(false);
                    Log.d(`${LOG_TAG}向${this.name}获取待释放资源:${info.url}`);
                    result = info.data;
                }
            }
        }
        this._assets.delete(url);
        return result;
    }

    onLowMemory() {
        if (this._assets.size > 0) {
            Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载的资源`);
            if (this.name == Macro.BUNDLE_REMOTE) {
                this._assets.forEach((info, key, source) => {
                    if (info.data instanceof Asset) {
                        Log.d(`${LOG_TAG}bundle : ${this.name} 释放远程加载资源${info.url}`);
                        assetManager.releaseAsset(info.data as Asset);
                    }
                });
                this._assets.clear();
                return;
            }
            let bundle = assetManager.getBundle(this.name);
            if (bundle) {
                this._assets.forEach((info, url, source) => {
                    if (Array.isArray(info.data)) {
                        Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载目录${info.url}`);
                        for (let i = 0; i < info.data.length; i++) {
                            if (info.data[i]) {
                                info.data[i].decRef(false);
                                let path = `${info.url}/${info.data[i].name}`;
                                bundle?.release(path, info.type);
                                Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载资源${path}`);
                            }
                        }
                    } else {
                        if (isValid(info.data)) {
                            //获取后删除当前管理器的引用
                            info.data.decRef(false);
                            bundle?.release(info.url, info.type);
                            Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载资源${info.url}`);
                        }
                    }
                });
                this._assets.clear();
            } else {
                Log.w(`${LOG_TAG}释放bundle : ${this.name} 时，Bundle已经被释放，直接清空待释放数据`);
                this._assets.clear();
            }
        }
    }

    tryRemove(bundle:BUNDLE_TYPE){
        if ( this.name != bundle ){
            return;
        }
        this.onLowMemory();
    }

    get assets() {
        return this._assets;
    }
}

export class ReleaseManager implements ISingleton {
    static module: string = "【资源管理器】";
    isResident?: boolean = true;
    module: string = null!;
    /**@description 待释放资源 */
    private _lazyInfos: Map<string, LazyInfo> = new Map();
    /**@description 待释放bundle */
    private _bundles: Map<string, boolean> = new Map();
    /**@description 远程资源 */
    private _remote: LazyInfo = new LazyInfo(Macro.BUNDLE_REMOTE);

    private getBundle(bundle: BUNDLE_TYPE) {
        return Manager.bundleManager.getBundle(bundle);
    }

    private getBundleName(bundle: BUNDLE_TYPE) {
        return Manager.bundleManager.getBundleName(bundle);
    }

    release(info: Resource.Info) {
        let bundle = this.getBundle(info.bundle);
        if (bundle) {
            if (Manager.isLazyRelease) {
                let name = bundle.name
                //如果是懒释放，记录一下就行了
                let lazyInfo: LazyInfo | undefined;
                if (this._lazyInfos.has(name)) {
                    lazyInfo = this._lazyInfos.get(name);
                } else {
                    lazyInfo = new LazyInfo(name);
                    this._lazyInfos.set(name, lazyInfo);
                }
                if (lazyInfo) {
                    lazyInfo.add(info);
                }
            } else {
                if (Array.isArray(info.data)) {
                    for (let i = 0; i < info.data.length; i++) {
                        let path = `${info.url}/${info.data[i].name}`;
                        bundle.release(path, info.type);
                    }
                    Log.d(`${LOG_TAG}成功释放资源目录 : ${info.bundle}.${info.url}`);
                } else {
                    bundle.release(info.url, info.type);
                    Log.d(`${LOG_TAG}成功释放资源 : ${info.bundle}.${info.url}`);
                }
            }
        } else {
            Log.e(`${LOG_TAG}${info.bundle} no found`);
        }
    }

    get(bundle: BUNDLE_TYPE, url: string) {
        let temp = this.getBundle(bundle);
        if (temp) {
            let info = this._lazyInfos.get(temp.name);
            if (info) {
                return info.get(url);
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
        if (Manager.isLazyRelease) {
            if (temp) {
                Log.d(`${LOG_TAG}向释放管理器中添加待释放bundle : ${temp?.name}`);
                this._bundles.set(temp?.name, false);
            }
        } else {
            Log.d(`${LOG_TAG}释放Bundle : ${temp?.name}`);
            if (temp) assetManager.removeBundle(temp);
        }
    }

    onLoadBundle(bundle: string) {
        this._bundles.delete(bundle);
    }

    onLowMemory() {
        Log.d(`${LOG_TAG}------------收到内存警告，释放无用资源------------`);
        this._lazyInfos.forEach((info, key, source) => {
            info.onLowMemory();
        });

        Log.d(`${LOG_TAG}-------------释放无用bundle-------------`);
        this._bundles.forEach((value, bundle) => {
            let temp = assetManager.getBundle(bundle);
            if (temp) {
                Log.d(`释放无用bundle : ${bundle}`);
                assetManager.removeBundle(temp);
                this._bundles.delete(bundle);
            }
        });

        Log.d(`${LOG_TAG}-------------释放无用远程资源-------------`);
        this._remote.onLowMemory();
    }

    /**@description 尝试释放指定bundel的资源 */
    tryRemoveBundle(bundle:BUNDLE_TYPE){
        Log.d(`${LOG_TAG}--------------尝试释放${bundle}加载资源------------`);
        this._lazyInfos.forEach((info,key,source)=>{
            info.tryRemove(bundle);
        });
        let name = this.getBundleName(bundle);
        let temp = assetManager.getBundle(name);
        if (temp) {
            Log.d(`释放无用bundle : ${name}`);
            assetManager.removeBundle(temp);
            this._bundles.delete(name);
        }
    }

    getRemote(url: string) {
        return this._remote.get(url);
    }

    releaseRemote(info: Resource.Info) {
        if (Manager.isLazyRelease) {
            this._remote.add(info);
        } else {
            if (info.data instanceof Asset) {
                assetManager.releaseAsset(info.data as Asset);
            }
        }
    }

    debug(){
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
        if (Manager.isLazyRelease) {
            if (data.bundles.length > 0) {
                Log.d(`待释放Bundle : ${data.bundles.toString()}`);
            }
            if (data.lazyInfo.size > 0) {
                data.lazyInfo.forEach((value, key, source) => {
                    Log.d(`--------------${key}待释放资源--------------`);
                    value.assets.forEach((info, key, source) => {
                        Log.d(`${info.url}`);
                    })
                });
            }

            Log.d(`远程待释放资源`);
            data.remote.assets.forEach((info, key, source) => {
                Log.d(`${info.url}`);
            });

        } else {
            Log.w(`未开户懒释放功能!!!!`);
        }
    }
}

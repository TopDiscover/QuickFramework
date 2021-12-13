
/**
 * 资源释放管理
 * DateTime = Mon Dec 13 2021 20:58:18 GMT+0800 (中国标准时间)
 * Author = zheng_fasheng
 */

import { Asset, assetManager, AssetManager, isValid } from "cc";
import { Resource } from "./Resource";

const LOG_TAG = "[ReleaseManager] : ";

class LazyInfo {


    private name: string = "";
    constructor(name: string) {
        this.name = name;
    }

    private _assets: Map<string,Resource.Info> = new Map();

    /**@description 放入懒释放资源 */
    add(info : Resource.Info) {
        
        //管理器引用加1
        if ( Array.isArray(info.data) ){
            Log.d(`${LOG_TAG}向${this.name}加入待释放目录:${info.url}`);
            for ( let i = 0 ; i < info.data.length ; i++ ){
                if ( info.data[i] ){
                    info.data[i].addRef();
                }
            }
        }else{
            if ( info.data ){
                Log.d(`${LOG_TAG}向${this.name}加入待释放资源:${info.url}`);
                info.data.addRef();
            }
        }
        this._assets.set(info.url, info);
    }

    get(url: string): Asset | Asset[] | null {
        let info = this._assets.get(url);
        let result : Asset | Asset[] | null = null;
        if (info) {
            if ( Array.isArray(info.data) ){
                for( let i = 0 ; i < info.data.length ; i++ ){
                    if ( info.data[i] ){
                        info.data[i].decRef();
                    }
                }
                Log.d(`${LOG_TAG}向${this.name}获取待释放目录:${info.url}`);
                result = info.data;
            }else{
                if (isValid(info.data)) {
                    //获取后删除当前管理器的引用
                    info.data.decRef();
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
            let bundle = assetManager.getBundle(this.name);
            if (bundle) {
                this._assets.forEach((info, url, source) => {
                    if ( Array.isArray(info.data) ){
                        Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载目录${info.url}`);
                        for( let i = 0 ; i < info.data.length ; i++ ){
                            if ( info.data[i] ){
                                info.data[i].decRef();
                                let path = `${info.url}/${info.data[i].name}`;
                                bundle?.release(path,info.type);
                                Log.d(`${LOG_TAG}bundle : ${this.name} 释放加载资源${path}`);
                            }
                        }
                    }else{
                        if (isValid(info.data)) {
                            //获取后删除当前管理器的引用
                            info.data.decRef();
                            bundle?.release(info.url,info.type);
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
}

export class ReleaseManager {
    private static _instance: ReleaseManager = null!;
    public static Instance() {
        return this._instance || (this._instance = new ReleaseManager());
    }

    /**@description 待释放资源 */
    private _lazyInfos: Map<string, LazyInfo> = new Map();
    /**@description 待释放bundle */
    private _bundles: Map<string, boolean> = new Map();

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
                        bundle.release(path,info.type);
                    }
                    Log.d(`${LOG_TAG}成功释放资源目录 : ${info.bundle}.${info.url}`);
                } else {
                    bundle.release(info.url,info.type);
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
    }
}

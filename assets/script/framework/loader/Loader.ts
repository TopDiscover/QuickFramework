import { remoteCaches, resCaches } from "../cache/ResCaches";
import { ResourceCacheData, ResourceCacheStatus, ResourceInfo, ResourceData } from "../base/Defines";
import { getSingleton } from "../base/Singleton";
import { uiManager } from "../base/UIManager";


class CacheInfo {
    /**@description 资源引用关系 */
    ref: Set<string> = new Set<string>();
    /**@description 资源初始驻留次数，当为0时，且没有引用关系时，对资源进行释放操作 */
    refCount: number = 0;
    url: string = "";
    /**@description 是否常驻 */
    retain: boolean = false;
    /**@description 记录当前释放时的时间 */
    releaseTime: number = 0;
}

/**@description 资源加载管理 */
export function loader(){
    return getSingleton(Loader);
}

/**
 * @description 资源加载管理
 */
class Loader {

    private _logTag = `[Loader]: `;
    private static _instance: Loader = null;
    public static Instance() {
        return this._instance || (this._instance = new Loader());
    }

    /**@description 引擎默认资源名 */
    private _engineDefaultResourceNames = {
        "__builtin-editor-gizmo": true,
        "__builtin-editor-gizmo-line": true,
        "__builtin-editor-gizmo-unlit": true,
        "builtin-phong": true,
        "default_btn_disabled": true,
        "default_btn_normal": true,
        "default_btn_pressed": true,
        "default_editbox_bg": true,
        "default_panel": true,
        "default_progressbar": true,
        "default_progressbar_bg": true,
        "default_radio_button_off": true,
        "default_radio_button_on": true,
        "default_scrollbar": true,
        "default_scrollbar_bg": true,
        "default_scrollbar_vertical": true,
        "default_scrollbar_vertical_bg": true,
        "default_sprite": true,
        "default_sprite_splash": true,
        "default_toggle_checkmark": true,
        "default_toggle_disabled": true,
        "default_toggle_normal": true,
        "default_toggle_pressed": true,
    }

    /**@description 引擎默认资源url */
    private _engineDefaultResourceUrls = {};

    /**@description 资源加载完成后引用数据 */
    private _resMap: Map<string, CacheInfo> = new Map<string, CacheInfo>();

    /**@description 记录当前纹理图集对应的精灵帧，在释放图集时，必须要在用到这张图集的所有精灵全部释放后，才能对图集进行释放 */
    private _atlasMap: { [key: string]: {} } = {};

    /**@description 
     * 未加载完成时的引用数据,处理当两界面同时引用同一资源res，
     * A界面关闭时，B界面打开,由于B界面的res已经加载完成，A界面res未加载完成，
     * 此时B界面直接把加载完成后的数据引用-1操作而释放了res,
     * 等A界面加载时，由于js的还未回收res，res直接返回使用，但后一帧被释放
     * 造成访问已经释放的资源错误，渲染失败造成崩溃
     * 此时再释放过程中需要先对未加载完成的引用数据进行判断，如果当前还有界面在使用，或加载
     * 排除对res的释放
     */
    private _reference: Map<string, CacheInfo> = new Map<string, CacheInfo>();

    /**@description 当资源多长时间没在使用，释放资源 */
    private readonly RELEASE_TIME = 300;

    /**@description 待释放队列，不能直接释放，需要等渲染结束后才能释放<资源url,资源依赖url> */
    private _releaseQueue: Map<string, string[]> = new Map<string, string[]>();

    /**@description 加载资源 */
    private _loadRes(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void , completeCallback: (data: ResourceCacheData) => void) {
        let cache = resCaches().get(url);
        if (cache) {
            //加载中，或者是已经加载完成
            if (cache.isLoaded) {
                if (cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
                    if (CC_DEBUG) cc.warn(this._logTag, `资源:${url} 等待释放，但资源已经加载完成，此时有人又重新加载，不进行释放处理`);
                }
                //加载完成
                completeCallback(cache);
            } else {
                if (cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
                    if (CC_DEBUG) cc.warn(this._logTag, `资源:${url}等待释放，但资源处理加载过程中，此时有人又重新加载，不进行释放处理`);
                }
                //加载中
                cache.finishCb.push(completeCallback);
            }
            //重新复位资源状态
            //cc.log(this._logTag,`复位资源状态:${url}`);
            cache.status = ResourceCacheStatus.NONE;
        } else {
            //没有缓存信息
            cache = new ResourceCacheData();
            cache.url = url;
            cache.assetType = type;
            resCaches().set(url, cache);
            let res = cc.loader.getRes(url, type);
            cc.time(`加载资源 : ${cache.url}`);
            if (res) {
                this._onLoadComplete(cache, completeCallback, null, res);
            } else {
                if ( progressCallback ){
                    cc.loader.loadRes(cache.url,type,progressCallback,this._onLoadComplete.bind(this,cache,completeCallback));
                }else{
                    cc.loader.loadRes(cache.url, type, this._onLoadComplete.bind(this, cache, completeCallback));
                }
            }
        }
    }

    /**@description 加载完成回调 */
    private _onLoadComplete(cache: ResourceCacheData, completeCallback: (data: ResourceCacheData) => void, err, data: cc.Asset) {

        cache.isLoaded = true;
        //添加引用关系
        this.addDependsRecursively(cache.url, data);
        let tempCache = cache;
        if (err) {
            cc.error(`${this._logTag}加载资源失败:${cache.url} 原因:${err.message ? err.message : "未知"}`);
            cache.data = null;
            tempCache.data = null;
            resCaches().remove(cache.url);
            completeCallback(cache);
        }
        else {
            if (CC_DEBUG) cc.log(`${this._logTag}加载资源成功:${cache.url}`);
            cache.data = data;
            tempCache.data = data;
            completeCallback(cache);
        }

        //加载过程，有不同地方调用过来加载同一个资源的地方，都回调回去
        cache.doFinish(tempCache);
        cache.doGet(tempCache.data);

        if (cache.status == ResourceCacheStatus.WAITTING_FOR_RELEASE) {
            if (CC_DEBUG) cc.warn(this._logTag, `资源:${cache.url}加载完成，但缓存状态为等待销毁，销毁资源`);
            if (cache.data) {
                cache.status = ResourceCacheStatus.NONE;
                let info = new ResourceInfo;
                info.url = cache.url;
                info.type = cache.assetType;
                info.data = cache.data;
                this.releasePreReference(info);
                this.releaseAsset(info);
            }
        }

        cc.timeEnd(`加载资源 : ${cache.url}`);
    }

    /**
     * 获取资源缓存信息
     * @param key 要获取的资源url
     */
    private _getCacheInfo(key: string, isNoFoundCreate = true): CacheInfo {
        if (key && key.length > 0) {
            if (!this._resMap.has(key)) {
                if (isNoFoundCreate) {
                    this._resMap.set(key, new CacheInfo);
                }
                else {
                    return null;
                }
            }
            return this._resMap.get(key);
        }
        return null;
    }

    private _getPreReferenceCacheInfo(key: string, isNoFoundCreate = true): CacheInfo {
        if (key && key.length > 0) {
            if (!this._reference.has(key)) {
                if (isNoFoundCreate) {
                    this._reference.set(key, new CacheInfo);
                }
                else {
                    return null;
                }
            }
            return this._reference.get(key);
        }
        return null;
    }

    /**@description 保存图集依赖关系，即图集包含的精灵帧 */
    private _saveAtlasDepends(url: string, item) {
        if (item && item.content && item.content instanceof cc.SpriteAtlas) {
            let depends = cc.loader.getDependsRecursively(item.content);
            for (let i = 0; i < depends.length; i++) {
                let atlasValue = depends[i];
                if (!this._atlasMap[url]) {
                    this._atlasMap[url] = {};
                }
                this._atlasMap[url][atlasValue] = true;
            }
        }
    }

    /**@description 获取该资源的图集信息 */
    private getBelongAtlasInfo(assetUrl: string): { isBelong: boolean, url?: string, refs?: string[] } {
        let keys = Object.keys(this._atlasMap);
        for (let i = 0; i < keys.length; i++) {
            let values = this._atlasMap[keys[i]];
            if (assetUrl in values) {
                return { isBelong: true, url: keys[i], refs: Object.keys(values) };
            }
        }
        return { isBelong: false };
    }

    /**@description 是否有人正在引用 */
    private isNobodyReference(url: string) {
        let data = this._atlasMap[url];
        if (data) {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                let cacheInfo = this._getCacheInfo(keys[i]);
                if (!this._canRemove(cacheInfo)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**@description 添加资源引用依赖关系 */
    private addDependsRecursively(url: string, data: cc.Asset) {
        if (!data) return;
        let deps = cc.loader.getDependsRecursively(data);
        if (deps) {
            let refKey = deps[deps.length - 1];
            deps.forEach((value, index) => {
                if (!(this.containBuildtin(value))) {
                    let item = this._getResItem(value, null);
                    if (this._isEngineResource(item)) return;
                    this._saveAtlasDepends(url, item);
                    let cacheInfo = this._getCacheInfo(value);
                    if (cacheInfo) {
                        cacheInfo.ref.add(refKey);
                        cacheInfo.url = url;
                        cacheInfo.releaseTime = 0;
                        if (cacheInfo.refCount < 0) {
                            cacheInfo.refCount = 0;
                        }
                    }
                }
            });
        }
    }

    /**@description 未加载完成前的资源引用计数+1 */
    public retainPreReference(info: ResourceInfo) {
        if (info) {
            let cache = this._getPreReferenceCacheInfo(info.url);
            if (cache) {
                cache.url = info.url;
                cache.refCount++;
            }
        }
    }

    /**@description 未加载完成前的资源引用计数-1 */
    public releasePreReference(info: ResourceInfo) {
        if (info) {
            let cache = this._getPreReferenceCacheInfo(info.url, false);
            if (cache) {
                cache.refCount--;
                if (cache.refCount <= 0) {
                    this._reference.delete(info.url);
                }
            }
        }
    }

    /**
     * @description 驻留资源，即引用计数+1 
     * @param data 
     */
    public retainAsset(info: ResourceInfo) {
        if (arguments.length <= 0) {
            cc.error("参数错误")
            return null;
        }
        if (info.data) {
            let deps = cc.loader.getDependsRecursively(info.data);
            if (deps) {
                let refKey = deps[deps.length - 1];
                deps.forEach((value, index) => {
                    if (!(this.containBuildtin(value))) {
                        let item = this._getResItem(value, null);
                        if (this._isEngineResource(item)) return;
                        let cacheInfo = this._getCacheInfo(value);
                        if (cacheInfo) {
                            if (cacheInfo.retain) {
                                //已经设置为常驻
                            } else {
                                cacheInfo.retain = info.retain;
                            }
                            //排除引擎资源的引用关系
                            cacheInfo.ref.add(refKey);
                            cacheInfo.url = info.url;
                            cacheInfo.refCount++;
                            cacheInfo.releaseTime = 0;
                            if (cacheInfo.refCount <= 0) {
                                if (CC_DEBUG) cc.warn(`引用计数有误，重新修正 url : ${info.url} assetUrl : ${value}`);
                                cacheInfo.refCount = 1;
                            }
                            if (cacheInfo.retain) {
                                cacheInfo.refCount = 9999;
                            }
                        }
                    }
                });
            }
        }
        return null;
    }

    public onDirectorAfterDraw( cando : boolean ) {
        if ( !cando || this._releaseQueue.size <= 0) {
            return;
        }
        let now = Date.timeNowMillisecons();
        this._releaseQueue.forEach((depends: string[], url: string, source) => {
            if (depends.length <= 0) {
                if (CC_DEBUG) cc.log(`释放资源完成 url : ${url}`)
                this._releaseQueue.delete(url);
            } else {
                let preReferenceCache = this._getPreReferenceCacheInfo(url, false);
                let hasReference = false;
                if (preReferenceCache) {
                    hasReference = preReferenceCache.refCount > 0;
                }
                if (hasReference) {
                    //从释放列队中移除
                    if (CC_DEBUG) cc.warn(`资源正在使用中从释放队列中移除 url : ${url}`);
                    this._releaseQueue.delete(url);
                    return;
                }
                let index = depends.length;
                let isRelase = false;
                while (index--) {
                    let assetUrl = depends[index];
                    let cacheInfo = this._getCacheInfo(assetUrl, false);
                    if (this._canRemove(cacheInfo) && cacheInfo.releaseTime > 0 && now - cacheInfo.releaseTime > this.RELEASE_TIME) {
                        if (cacheInfo.retain) {
                            if (CC_DEBUG) cc.warn(`释放的资源包含常驻资源 url : ${url} assetUrl : ${assetUrl}`);
                            depends.splice(index, 1);
                            continue;
                        } else {

                            //释放资源
                            let dependItem = this._getResItem(assetUrl, null);
                            if (dependItem && dependItem.content instanceof cc.SpriteFrame) {
                                //检查纹理是否属于某张图集
                                let atlasInfo = this.getBelongAtlasInfo(assetUrl);
                                if (atlasInfo.isBelong) {
                                    //该精灵帧有图集正在使用，想看图集是否全部没有人再引用
                                    if (this.isNobodyReference(atlasInfo.url)) {
                                        //释放这里需要做出改变，删除掉整个加载的纹理图集
                                        if (CC_DEBUG) cc.log(`释放图集资源 : ${atlasInfo.url}`);
                                        cc.loader.release(atlasInfo.refs);
                                        //删除图集保存信息
                                        delete this._atlasMap[atlasInfo.url];
                                        //删除本地缓存
                                        resCaches().remove(atlasInfo.url);
                                        //删除引用关系
                                        this._resMap.delete(assetUrl);
                                        //删除依赖关系
                                        depends.splice(index, 1);
                                        isRelase = true;
                                    } else {
                                        //有人正在使用该大图集资源，从释放队列中删除
                                        if (CC_DEBUG) cc.warn(`资源正在使用中从释放队列中移除 url : ${url}`);
                                        this._releaseQueue.delete(url);
                                        break;
                                    }

                                } else {
                                    this._removeItem(dependItem);
                                    this._resMap.delete(assetUrl);
                                    depends.splice(index, 1);
                                    isRelase = true;
                                }
                            } else {
                                this._removeItem(dependItem);
                                this._resMap.delete(assetUrl);
                                depends.splice(index, 1);
                                isRelase = true;
                            }

                        }
                    } else {
                        //如果有一个没有达成删除，没必要再进行循环处理
                        break;
                    }
                }

                if (isRelase) {
                    if (depends.length > 0) {
                        if (CC_DEBUG) cc.error(`未能完成释放资源 url : ${url}`);
                    }
                    this._releaseQueue.delete(url);
                    if (CC_DEBUG) cc.log(`释放资源 url : ${url}`);
                    resCaches().remove(url);
                }
            }
        });
    }

    /**
     * @description 释放资源，即引用计数-1 
     * @param data 
     */
    public releaseAsset(info: ResourceInfo) {
        if ( info && info.data) {

            //先到本地缓存中查找该文件是否正在加载，如果是正在加载过程中，只改变状态，不进行释放
            let cache = resCaches().get(info.url, false);
            if (!cache) {
                return;
            } else {
                if (resCaches().isInvalid(cache)) {
                    if (CC_DEBUG) cc.warn(`资源已经被释放 url : ${info.url}`);
                    return;
                }
            }
            let isCanRemove = true;
            if (cache && !cache.isLoaded) {
                isCanRemove = false;
                cache.status = ResourceCacheStatus.WAITTING_FOR_RELEASE;
                if (CC_DEBUG) cc.warn(`${cache.url} 正在加载，等加载完成进行释放`);
            }
            if (isCanRemove) {
                if (CC_DEBUG) cc.log(`releaseAsset : ${info.url}`);
                //先查看未加载前的引用是否还有界面正在引用
                let preReferenceCache = this._getPreReferenceCacheInfo(info.url, false);
                let hasReference = false;
                if (preReferenceCache) {
                    hasReference = preReferenceCache.refCount > 0;
                }
                let deps = cc.loader.getDependsRecursively(info.data);
                if (deps) {
                    let refKey = deps[deps.length - 1];
                    let itemMyself = this._getResItem(refKey, null);
                    let isAtals = false;
                    let depends = [];
                    if (itemMyself && itemMyself.content instanceof cc.SpriteAtlas) {
                        //cc.error(`图集资源不作释放处理 url : ${info.url}`);
                        isAtals = true;
                    }
                    //先测试该资源是否可以释放
                    let cacheInfo = this._getCacheInfo(refKey, false);
                    if (cacheInfo) {
                        if (cacheInfo.retain) {
                            if (CC_DEBUG) cc.warn(`常驻资源 url : ${info.url}  assetUrl : ${refKey}`);
                            return;
                        } else {
                            isCanRemove = cacheInfo.refCount - 1 <= 0;
                            //只有自己可释放，才进行删除
                            for (let i = 0; i < deps.length; i++) {
                                let value = deps[i];
                                if (!this.containBuildtin(value)) {
                                    let cacheInfo = this._getCacheInfo(value, false);
                                    if (cacheInfo) {
                                        if (cacheInfo.retain) {
                                            cacheInfo.ref.delete(refKey);
                                            continue;
                                        } else {
                                            cacheInfo.ref.delete(refKey);
                                            cacheInfo.refCount--;
                                            cacheInfo.releaseTime = Date.timeNowMillisecons();
                                            if (this._canRemove(cacheInfo) && !hasReference && isCanRemove) {
                                                if (isAtals) {
                                                    depends.push(value);
                                                } else {
                                                    if (this._releaseQueue.has(info.url)) {
                                                        this._releaseQueue.get(info.url).push(value);
                                                    } else {
                                                        let depends = [];
                                                        depends.push(value);
                                                        this._releaseQueue.set(info.url, depends);
                                                    }
                                                }
                                            } else {
                                                if (CC_DEBUG) {
                                                    if (hasReference || isCanRemove) {
                                                        if (CC_DEBUG) cc.warn(`当前资源有界面正在使用中，不进行资源释放 url : ${info.url} assetUrl : ${value}`);
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                            if (isAtals) {
                                if (depends.length == deps.length) {
                                    //说明大图集可被完全释放
                                    this._releaseQueue.set(info.url, depends);
                                } else {
                                    //该图集正在使用中，无法释放
                                    if (CC_DEBUG) cc.warn(`图集正在使用中 url : ${info.url}`);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**@description 判断资源是否是引擎资源,如果是引擎资源，放到引擎资源排除释放列表中 */
    private _isEngineResource(item) {
        if (item) {
            if (item.content instanceof cc.Asset) {
                let isFinde = item.content.name in this._engineDefaultResourceNames;
                if (isFinde) {
                    //获取当前节点的依赖，排除引用资源
                    let deps = cc.loader.getDependsRecursively(item.content);
                    deps.forEach((value) => {
                        this._engineDefaultResourceUrls[value] = true;
                        if (CC_DEBUG) cc.warn(`添加引擎默认资源 name : ${item.content.name}  assetUrl : ${value} `);
                        //引擎的资源，从资源引用中删除
                        this._resMap.delete(value);
                    });
                    delete this._engineDefaultResourceNames[item.content.name];
                    return true;
                }
            }
        }
        return false;
    }

    /**@description 判断是否可以删除 */
    private _canRemove(cacheInfo: CacheInfo) {
        if (cacheInfo) {
            if ((cacheInfo.ref.size <= 0 && cacheInfo.refCount <= 0)) {
                return true;
            }
        }
        return false;
    }

    private _removeItem(item) {
        if (item) {
            if (item.uuid) {
                cc.loader.release(item.uuid);
                if (CC_DEBUG) cc.log(`${this._logTag}release item by uuid : ${item.uuid}`);
            } else {
                cc.loader.release(item.url);
                if (CC_DEBUG) cc.log(`${this._logTag}release item by url: ${item.url}`);
            }
            return true;
        }
        return false;
    }

    public loadRes(url: string , type : typeof cc.Asset , progressCallback: (completedCount: number, totalCount: number, item: any) => void , completeCallback : (data : ResourceCacheData)=>void);
    public loadRes(url: string, type: typeof cc.Asset, completeCallback: (data: ResourceCacheData) => void);
    public loadRes(value: ResourceData, completeCallback: (data: ResourceCacheData) => void);
    public loadRes() {
        if (arguments.length < 2) {
            if (CC_DEBUG) cc.error(this._logTag, `参数有误`);
            return;
        }
        if (typeof arguments[0] == "string") {
            if( arguments.length == 4 ){
                this._loadRes(arguments[0],arguments[1],arguments[2],arguments[3]);
            }else{
                this._loadRes(arguments[0], arguments[1],null, arguments[2]);
            }
            
        } else {
            let data: ResourceData = arguments[0];
            let completeCallback: (data: ResourceCacheData) => void = arguments[1];
            if (data.preloadView) {
                uiManager().preload(data.preloadView).then((view) => {
                    if (completeCallback) {
                        let cache = new ResourceCacheData();
                        cache.isLoaded = true;
                        cache.data = <any>view;
                        cache.url = data.preloadView.getPrefabUrl();
                        completeCallback(cache);
                    }
                });
            } else {
                this._loadRes(data.url, data.type, null,arguments[1]);
            }
        }
    }

    /**
     * @description 添加常驻预置体
     * @param prefab 
     */
    public addPersistResource(url: string, data: cc.Asset) {
        let info = new ResourceInfo;
        info.url = url;
        info.data = data;
        info.retain = true;
        this.retainAsset(info);
    }

    /**@description 是否是引擎资源 */
    private containBuildtin(url: string) {
        if (url && url in this._engineDefaultResourceUrls) {
            //if ( CC_DEBUG ) cc.warn(`引擎默认资源 assetUrl : ${url}`);
            return true;
        }
        return false;
    }

    /**
     * 从cc.loader中获取一个资源的item
     * @param url 查询的url
     * @param type 查询的资源类型
     */
    private _getResItem(url: string, type: typeof cc.Asset): any {
        let ccloader: any = cc.loader;
        let item = ccloader._cache[url];
        if (!item) {
            let uuid = ccloader._getResUuid(url, type, false);
            if (uuid) {
                let ref = ccloader._getReferenceKey(uuid);
                item = ccloader._cache[ref];
            }
        }
        return item;
    }

    /**@description 获取资源的路径 */
    public getResourcePath(data: cc.Asset) {
        let ccloader: any = cc.loader;
        return ccloader._getReferenceKey(data);
    }

    public showDependsRecursively() {
        cc.log("------  showDependsRecursively  ------");
        let content = [];
        let engineContent = [];
        this._resMap.forEach((cacheInfo, key, resMap) => {
            let ref = [];
            cacheInfo.ref.forEach((value, value2, source) => {
                ref.push(value);
            });
            let item = { url: cacheInfo.url, assetUrl: key, ref: ref, refCount: cacheInfo.refCount, retain: cacheInfo.retain };
            if (this.containBuildtin(key)) {
                engineContent.push(item);
            } else {
                content.push(item);
            }
        });

        if (content.length > 0) {
            cc.log(`------------- Current depends recursively -------------`);
            cc.log(JSON.stringify(content));
        }

        if (engineContent.length > 0) {
            cc.log(`------------- engine resource depends recursively -------------`);
            cc.log(JSON.stringify(engineContent));
        }

        if (this._releaseQueue.size > 0) {
            cc.log(`-------------Current release queue-------------------------`);
            content = [];
            this._releaseQueue.forEach((depends, url) => {
                let item = { url: url, depends: depends };
                content.push(item);
            });
            cc.log(JSON.stringify(content));
        }

        resCaches().showCaches();

        remoteCaches().showCaches();
    }

}
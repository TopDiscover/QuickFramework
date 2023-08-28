import { Resource } from "../core/asset/Resource";
import UIView from "../core/ui/UIView";
import { ButtonSpriteType } from "../defines/Enums";
import { Macro } from "../defines/Macros";

/**@description 添加加载本地的资源 */
export function addExtraLoadResource(view: UIView, info: Resource.Info) {
    let uiManager = App.uiManager;
    if (view == <any>(uiManager.retainMemory)) {
        uiManager.retainMemory.addLocal(info);
    }
    else if (view && view instanceof UIView) {
        uiManager.addLocal(info, view.className);
    } else {
        uiManager.garbage.addLocal(info);
    }
}

/**@description 添加加载远程的资源 */
export function addRemoteLoadResource(view: UIView, info: Resource.Info) {
    let uiManager = App.uiManager;
    if (view == <any>(uiManager.retainMemory)) {
        uiManager.retainMemory.addRemote(info);
    }
    else if (view && view instanceof UIView) {
        uiManager.addRemote(info, view.className);
    } else {
        uiManager.garbage.addRemote(info);
    }
}

/**@description 获取Bundle,如果没有传入，会默认指定当前View打开时的bundle,否则批定resources */
export function getBundle(config: { bundle?: BUNDLE_TYPE, view?: UIView }) {
    let bundle: BUNDLE_TYPE = config.bundle as BUNDLE_TYPE;
    if (config.bundle == undefined || config.bundle == null) {
        bundle = Macro.BUNDLE_RESOURCES;
        if (config.view) {
            bundle = config.view.bundle;
        }
    }
    return bundle;
}

function isValidComponent(component: cc.Component): boolean {
    if (cc.isValid(component) && component.node && cc.isValid(component.node)) {
        return true;
    }
    return false;
}

/**
 * @description 设置cc.Sprite组件精灵帧
 * @param {*} view 持有视图
 * @param {*} url url
 * @param {*} sprite Sprite组件
 * @param {*} spriteFrame 新的精灵帧
 * @param {*} complete 完成回调(data: cc.SpriteFrame) => void
 * @param {*} resourceType 资源类型 默认为ResourceType.Local
 * @param {*} retain 是否常驻内存 默认为false
 * @param {*} isAtlas 是否是大纹理图集加载 默认为false
 */
export function setSpriteSpriteFrame(data: {
    view: UIView,
    url: string,
    sprite: cc.Sprite,
    spriteFrame: cc.SpriteFrame,
    complete: (data: cc.SpriteFrame) => void,
    bundle: BUNDLE_TYPE,
    resourceType?: Resource.Type,
    retain?: boolean,
    isAtlas?: boolean,
    dirAsset?: cc.Asset[] | cc.Asset,
}) {
    if (data.resourceType == undefined || data.resourceType == null) {
        data.resourceType = Resource.Type.Local;
    }
    if (data.retain == undefined || data.retain == null) {
        data.retain = false;
    }
    if (data.isAtlas == undefined || data.isAtlas == null) {
        data.isAtlas = false;
    }
    if (!data.isAtlas) {
        //纹理只需要把纹理单独添加引用，不需要把spirteFrame也添加引用
        let info = new Resource.Info;
        info.type = cc.SpriteFrame;
        info.url = data.resourceType == Resource.Type.Local ? Resource.getKey(data.url, info.type) : data.url;
        info.data = data.spriteFrame;
        if (data.dirAsset) {
            info.data = data.dirAsset;
        }
        info.retain = data.retain;
        info.bundle = data.bundle;
        if (data.resourceType == Resource.Type.Remote) {
            addRemoteLoadResource(data.view, info);
        } else {
            addExtraLoadResource(data.view, info);
        }
    }

    if (data.spriteFrame && isValidComponent(data.sprite)) {
        let oldSpriteFrame = data.sprite.spriteFrame;
        let replaceData = cc.isValid(data.spriteFrame) ? data.spriteFrame : null;
        try {
            if (replaceData) data.sprite.spriteFrame = replaceData;
            if (data.complete) data.complete(replaceData);
        } catch (err) {
            let temp = cc.isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            data.sprite.spriteFrame = temp;
            if (data.complete) data.complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${data.url} : ${err ? err : "replace spriteframe error"}`);
        }
    } else {
        //完成回调
        if (data.complete && isValidComponent(data.sprite)) data.complete(data.spriteFrame);
    }
}

interface setSpriteFrameParam {
    button: cc.Button,
    memberName: ButtonSpriteType,
    view: UIView,
    url: string,
    spriteFrame: cc.SpriteFrame,
    complete: (type: string, data: cc.SpriteFrame) => void,
    bundle: BUNDLE_TYPE,
    isAtlas?: boolean,
    dirAsset?: cc.Asset | cc.Asset[],
}

/**
 * @description 设置按钮精灵帧
 * @param view 持有视图
 * @param url url 
 * @param button 
 * @param spriteFrame 新的spriteFrame
 * @param memberName 替换成员变量名
 * @param complete 完成回调
 * @param isAtlas 是否是从大纹理图集中加载的
 */
function _setSpriteFrame(data: setSpriteFrameParam) {

    if (!data.isAtlas) {
        let info = new Resource.Info;
        info.type = cc.SpriteFrame;
        info.url = Resource.getKey(data.url, info.type);
        info.data = data.spriteFrame;
        if (data.dirAsset) {
            info.data = data.dirAsset;
        }
        info.bundle = data.bundle;
        addExtraLoadResource(data.view, info);
    }

    if (data.spriteFrame && isValidComponent(data.button)) {
        let oldSpriteFrame: cc.SpriteFrame = data.button[data.memberName];
        try {
            let replaceData = cc.isValid(data.spriteFrame) ? data.spriteFrame : null;
            if (replaceData) data.button[data.memberName] = replaceData;
            if (data.complete) data.complete(data.memberName, replaceData);
        } catch (err) {
            let temp = cc.isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            data.button[data.memberName] = temp;
            if (data.complete) data.complete(data.memberName, null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${data.url} : ${err ? err : "replace spriteframe error"}`);
        }
    } else {
        if (data.complete && isValidComponent(data.button)) data.complete(data.memberName, data.spriteFrame);
    }

};

/**
 * @description 设置按钮精灵帧
 * @param button 按钮组件 
 * @param memberName 成员变量名 
 * @param view 持有视图
 * @param url url
 * @param spriteFrame 待替换的精灵帧 
 * @param complete 完成回调
 * @param isAtlas 是否是从大纹理图集中加载的 默认为false
 */
function _setButtonSpriteFrame(data: setSpriteFrameParam) {
    if (data.isAtlas == undefined || data.isAtlas == null) {
        data.isAtlas = false;
    }
    if (data.spriteFrame && isValidComponent(data.button)) {
        _setSpriteFrame(data);
    } else {
        //完成回调
        if (data.complete && isValidComponent(data.button)) data.complete(data.memberName, data.spriteFrame);
    }
}

/**
 * @description 根据类型设置按钮
 * @param button 
 * @param memberName 成员变量名
 * @param view 
 * @param url 
 * @param complete 
 */
function _setButtonWithType(
    button: cc.Button,
    memberName: ButtonSpriteType,
    view: UIView,
    url: string | { urls: string[], key: string },
    complete?: (type: string, spriteFrame: cc.SpriteFrame) => void,
    bundle?: BUNDLE_TYPE,
    dir?: string
) {
    if (url) {
        if (typeof url == "string") {
            if (dir) {
                App.cache.getCache(dir, cc.SpriteFrame, bundle, true).then(dirAsset => {
                    let __bundle = App.bundleManager.getBundle(bundle);
                    let spriteFrame: cc.SpriteFrame = __bundle.get(`${dir}/${url}`, cc.SpriteFrame);
                    if (dirAsset) {

                    } else {
                        Log.w(`未加载资源${dir}`);
                    }
                    _setButtonSpriteFrame({
                        button: button,
                        memberName: memberName,
                        view: view,
                        url: dir,
                        spriteFrame: spriteFrame,
                        complete: complete,
                        bundle: bundle,
                        dirAsset: dirAsset,
                    });
                })
                return;
            }
            App.cache.getCacheByAsync(url, cc.SpriteFrame, bundle).then((spriteFrame) => {
                _setButtonSpriteFrame({
                    button: button,
                    memberName: memberName,
                    view: view,
                    url: url,
                    spriteFrame: spriteFrame,
                    complete: complete,
                    bundle: bundle,
                });
            });
        } else {
            let urls = url.urls;
            let key = url.key;
            if (dir) {
                App.cache.getCache(dir, cc.SpriteAtlas, bundle, true).then(data => {
                    if (data) {
                        let __bundle = App.bundleManager.getBundle(bundle);
                        let isSuccess = false;
                        for (let i = 0; i < urls.length; i++) {
                            let atlas: cc.SpriteAtlas = __bundle.get(`${dir}/${urls[i]}`, cc.SpriteAtlas);
                            if (atlas && atlas.getSpriteFrame(key)) {
                                _setButtonSpriteFrame({
                                    button: button,
                                    memberName: memberName,
                                    view: view,
                                    url: dir,
                                    spriteFrame: atlas.getSpriteFrame(key),
                                    complete: complete,
                                    bundle: bundle,
                                    isAtlas: true,
                                    dirAsset: data,
                                });
                                isSuccess = true;
                                break;
                            }
                        }
                        if (!isSuccess) {
                            Log.w(`加载的资源中未找到:${bundle}/${dir}/${url}`);
                            _setButtonSpriteFrame({
                                button: button,
                                memberName: memberName,
                                view: view,
                                url: dir,
                                spriteFrame: null,
                                complete: complete,
                                bundle: bundle,
                                isAtlas: true,
                                dirAsset: null,
                            });
                        }
                    } else {
                        Log.w(`未加载资源${dir}`);
                        _setButtonSpriteFrame({
                            button: button,
                            memberName: memberName,
                            view: view,
                            url: dir,
                            spriteFrame: null,
                            complete: complete,
                            bundle: bundle,
                            isAtlas: true,
                            dirAsset: null,
                        });
                    }
                })
                return;
            }
            //在纹理图集中查找
            App.cache.getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource, bundle).then((data) => {
                if (data && data.isTryReload) {
                    //来到这里面，程序已经崩溃，无意义在处理
                } else {
                    _setButtonSpriteFrame({
                        button: button,
                        memberName: memberName,
                        view: view,
                        url: data.url,
                        spriteFrame: data.spriteFrame,
                        complete: complete,
                        bundle: bundle,
                        isAtlas: true
                    });
                }
            });
        }
    }
}

/**
 * @description 设置按钮精灵
 * @param button 按钮组件
 * @param config 配置信息
 */
export function setButtonSpriteFrame(button: cc.Button, config: {
    normalSprite?: string | { urls: string[], key: string },
    view: any,//UIView的子类
    pressedSprite?: string | { urls: string[], key: string },
    hoverSprite?: string | { urls: string[], key: string },
    disabledSprite?: string | { urls: string[], key: string },
    complete?: (type: string, spriteFrame: cc.SpriteFrame) => void,
    bundle?: BUNDLE_TYPE,
    dir?: string
}) {
    let bundle = getBundle(config);
    _setButtonWithType(button, ButtonSpriteType.Norml, config.view, config.normalSprite, config.complete, bundle, config.dir);
    _setButtonWithType(button, ButtonSpriteType.Pressed, config.view, config.pressedSprite, config.complete, bundle, config.dir);
    _setButtonWithType(button, ButtonSpriteType.Hover, config.view, config.hoverSprite, config.complete, bundle, config.dir);
    _setButtonWithType(button, ButtonSpriteType.Disable, config.view, config.disabledSprite, config.complete, bundle, config.dir);
}

/**
 * @description 设置特效
 * @param component 特效组件
 * @param config 配置信息
 * @param data 特效数据
 */
export function setParticleSystemFile(
    component: cc.ParticleSystem,
    config: { url: string, view: any, complete?: (file: cc.ParticleAsset) => void, bundle?: BUNDLE_TYPE },
    data: cc.ParticleAsset,
    dirAsset?: cc.Asset | cc.Asset[],
) {
    let info = new Resource.Info;
    info.type = cc.ParticleAsset;
    info.url = Resource.getKey(config.url, info.type);
    info.data = data;
    if (dirAsset) {
        info.data = dirAsset;
    }
    info.bundle = getBundle(config);
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(component)) {
        let oldFile = component.file;
        try {
            let replaceData = cc.isValid(data) ? data : null;
            if (replaceData) component.file = replaceData;
            if (config.complete) config.complete(replaceData);
        } catch (err) {
            let temp = cc.isValid(oldFile) ? oldFile : null;
            component.file = temp;
            if (config.complete) config.complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${config.url} : ${err ? err : "replace file error"}`);
        }
    } else {
        //完成回调
        if (config.complete && isValidComponent(component)) config.complete(data);
    }
}

/**
 * @description 设置字体
 * @param component 字体组件
 * @param config 配置信息
 * @param data 字体数据
 */
export function setLabelFont(
    component: cc.Label,
    config: { font: string, view: any, complete?: (font: cc.Font) => void, bundle?: BUNDLE_TYPE },
    data: cc.Font,
    dirAsset?: cc.Asset[] | cc.Asset) {
    let info = new Resource.Info;
    info.type = cc.Font;
    info.url = Resource.getKey(config.font, info.type);
    info.data = data;
    if (dirAsset) {
        info.data = dirAsset;
    }
    info.bundle = getBundle(config);
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(component)) {
        let oldFont = component.font;
        try {
            let replaceData = cc.isValid(data) ? data : null;
            if (replaceData) component.font = replaceData;
            if (config.complete) config.complete(replaceData);
        } catch (err) {
            let temp = cc.isValid(oldFont) ? oldFont : null;
            component.font = temp;
            if (config.complete) config.complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${config.font} : ${err ? err : "replace font error"}`);
        }
    } else {
        //完成回调
        if (config.complete && isValidComponent(component)) config.complete(data);
    }
}

/**
 * @description 设置spine动画数据
 */
export function setSkeletonSkeletonData(data: {
    component: sp.Skeleton,
    config: { url: string, view: any, complete: (data: sp.SkeletonData) => void, bundle?: BUNDLE_TYPE } |
    { view: any, path: string, name: string, complete: (data: sp.SkeletonData) => void, bundle?: BUNDLE_TYPE, isNeedCache?: boolean, retain?: boolean },
    data: sp.SkeletonData,
    resourceType?: Resource.Type,
    dirAsset?: cc.Asset | cc.Asset[],
}) {
    if (data.resourceType == undefined || data.resourceType == null) {
        data.resourceType = Resource.Type.Local;
    }

    let url = "";
    let retain = false;
    if (data.resourceType == Resource.Type.Remote) {
        let realConfig: { view: any, path: string, name: string, complete: (data: sp.SkeletonData) => void, isNeedCache?: boolean, retain?: boolean } = <any>data.config;
        url = `${realConfig.path}/${realConfig.name}`;
        retain = realConfig.retain ? true : false;
    } else {
        let realConfig: { url: string, view: any, complete: (data: sp.SkeletonData) => void } = <any>data.config;
        url = realConfig.url;
    }
    let info = new Resource.Info;
    info.type = sp.SkeletonData;
    info.url = Resource.getKey(url, info.type);
    info.data = data.data;
    if ( data.dirAsset ){
        info.data = data.dirAsset;
    }
    info.retain = retain;
    info.bundle = getBundle(data.config);
    if (data.resourceType == Resource.Type.Remote) {
        info.bundle = Macro.BUNDLE_REMOTE;
        info.url = url;
        addRemoteLoadResource(data.config.view, info);
    } else {
        addExtraLoadResource(data.config.view, info);
    }
    if (data.data && isValidComponent(data.component)) {
        let oldSkeletonData = data.component.skeletonData;
        try {
            let replaceData = cc.isValid(data.data) ? data.data : null;
            if (replaceData) data.component.skeletonData = replaceData;
            if (data.config.complete) data.config.complete(replaceData);
        } catch (err) {
            let temp = cc.isValid(oldSkeletonData) ? oldSkeletonData : null;
            data.component.skeletonData = temp;
            if (data.config.complete) data.config.complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${url} : ${err ? err : "replace skeletonData error"}`);
        }
    } else {
        //完成回调
        if (data.config.complete && isValidComponent(data.component)) data.config.complete(data.data);
    }
}

/**
 * @description 通过预置体创建Node
 * @param config 配置信息
 */
export function createNodeWithPrefab(config: { bundle?: BUNDLE_TYPE, url: string, view: any, complete: (node: cc.Node) => void }) {

    let url = config.url;
    let bundle = getBundle(config);
    let cache = App.cache.get(bundle, url, cc.Prefab);
    App.cache.getCacheByAsync(url, cc.Prefab, bundle).then((data) => {
        if (!cache) {
            let info = new Resource.Info;
            info.type = cc.Prefab;
            info.url = Resource.getKey(config.url, info.type);
            info.data = data;
            info.bundle = getBundle(config);
            addExtraLoadResource(config.view, info);
        }
        if (data && isValidComponent(config.view) && config.complete) {
            let node = cc.instantiate(data);
            config.complete(node);
        } else if (isValidComponent(config.view) && config.complete) {
            config.complete(null);
        }
    });
}

export function _loadDirRes(config: {
    bundle?: BUNDLE_TYPE,
    url: string,
    type: typeof cc.Asset,
    view: any,
    onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
    onComplete: (data: Resource.CacheData) => void
}) {
    let bundle = getBundle(config);
    let cache = App.cache.get(bundle, config.url, config.type);
    //这里要做一个防止重复加载操作，以免对加载完成后的引用计数多加次数
    App.asset.loadDir(bundle, config.url, config.type, config.onProgress, (data) => {

        if (!cache) {
            //如果已经有了，可能是从logic中加载过来的，不在进行引用计数操作
            let info = new Resource.Info;
            info.type = config.type;
            info.url = Resource.getKey(config.url, info.type);
            info.data = data.data;
            info.bundle = bundle;
            addExtraLoadResource(config.view, info)
        }

        if (config.onComplete) {
            config.onComplete(data);
        }
    });
}

export function _loadRes(config: {
    bundle?: BUNDLE_TYPE,
    url: string,
    type: typeof cc.Asset,
    onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
    onComplete: (data: any) => void,
    view: any,
    dir?:string,
}) {
    let bundle = getBundle(config);
    let cache = App.cache.get(bundle, config.url, config.type);
    if ( config.dir ){
        let __bundle = App.bundleManager.getBundle(bundle);
        let asset = __bundle.get(`${config.dir}/${config.url}`, config.type);
        if (config.onComplete) {
            config.onComplete(asset);
        }
        return;
    }
    App.asset.load(
        bundle,
        config.url,
        config.type,
        config.onProgress,
        (data) => {
            if (!cache) {
                let info = new Resource.Info;
                info.type = config.type;
                info.url = Resource.getKey(config.url, info.type);
                info.data = data.data;
                info.bundle = bundle;
                addExtraLoadResource(config.view, info);
            }
            if (config.onComplete) {
                config.onComplete(data ? data.data : null);
            }
        }
    )
}

export function loadDragonDisplay(comp: dragonBones.ArmatureDisplay,
    config: {
        assetUrl: string,
        atlasUrl: string,
        view: UIView,
        complete: (asset: dragonBones.DragonBonesAsset, atlas: dragonBones.DragonBonesAtlasAsset) => void,
        bundle?: BUNDLE_TYPE,
        dir?: string,
    }) {
    let bundle = getBundle(config);
    if (config.dir) {
        App.cache.getCache(config.dir, dragonBones.DragonBonesAsset, bundle, true).then(asset => {
            if (asset) {
                let __bundle = App.bundleManager.getBundle(bundle);
                asset = __bundle.get(`${config.dir}/${config.assetUrl}`, dragonBones.DragonBonesAsset);
                let info = new Resource.Info;
                info.type = dragonBones.DragonBonesAsset;
                info.url = Resource.getKey(config.dir, info.type);
                info.data = asset;
                info.bundle = getBundle(config);
                addExtraLoadResource(config.view, info);
                App.cache.getCache(config.dir, dragonBones.DragonBonesAtlasAsset, bundle, true).then(atlas => {
                    if (atlas) {
                        let __bundle = App.bundleManager.getBundle(bundle);
                        atlas = __bundle.get(`${config.dir}/${config.atlasUrl}`, dragonBones.DragonBonesAtlasAsset);
                        if (cc.sys.isBrowser) {
                            let info = new Resource.Info;
                            info.type = dragonBones.DragonBonesAtlasAsset;
                            info.url = Resource.getKey(config.dir, info.type);
                            info.data = atlas;
                            info.bundle = getBundle(config);
                            addExtraLoadResource(config.view, info);
                            comp.dragonAsset = asset;
                            comp.dragonAtlasAsset = atlas;
                            if (config.complete) {
                                config.complete(asset, atlas);
                            }
                        }
                    } else {
                        Log.w(`未加载资源${config.dir}`);
                        if (config.complete) {
                            config.complete(asset, null);
                        }
                    }
                })
            } else {
                Log.w(`未加载资源${config.dir}`);
                if (config.complete) {
                    config.complete(null, null);
                }
            }
        })
        return;
    }
    App.cache.getCacheByAsync(config.assetUrl, dragonBones.DragonBonesAsset, bundle).then((asset) => {
        if (asset) {
            let info = new Resource.Info;
            info.type = dragonBones.DragonBonesAsset;
            info.url = Resource.getKey(config.assetUrl, info.type);
            info.data = asset;
            info.bundle = getBundle(config);
            addExtraLoadResource(config.view, info);
            App.cache.getCacheByAsync(config.atlasUrl, dragonBones.DragonBonesAtlasAsset, bundle).then((atlas) => {
                if (atlas) {
                    if (cc.sys.isBrowser) {
                        let info = new Resource.Info;
                        info.type = dragonBones.DragonBonesAtlasAsset;
                        info.url = Resource.getKey(config.atlasUrl, info.type);
                        info.data = atlas;
                        info.bundle = getBundle(config);
                        addExtraLoadResource(config.view, info);
                    }

                    comp.dragonAsset = asset;
                    comp.dragonAtlasAsset = atlas;
                    if (config.complete) {
                        config.complete(asset, atlas);
                    }
                } else {
                    if (config.complete) {
                        config.complete(asset, null);
                    }
                }
            });
        } else {
            if (config.complete) {
                config.complete(null, null);
            }
        }
    });
}
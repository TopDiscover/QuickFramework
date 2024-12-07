import { Asset, AssetManager, BUNDLE_TYPE, Component, instantiate, isValid, Sprite, SpriteFrame, Node, Button, ParticleSystem2D, ParticleAsset, Label, Font, sp, Prefab, dragonBones, sys, SpriteAtlas } from "cc";
import { Resource } from "../core/asset/Resource";
import UIView from "../core/ui/UIView";
import { ButtonSpriteType } from "../defines/Enums";
import { Macro } from "../defines/Macros";

/**@description 添加加载本地的资源 */
export function addExtraLoadResource(view: UIView, cache: Resource.Cache) {
    let uiManager = App.uiManager;
    if (view == <any>(uiManager.retainMemory)) {
        uiManager.retainMemory.addLocal(cache);
    }
    else if (view && view instanceof UIView) {
        uiManager.addLocal(cache, view.className);
    } else {
        uiManager.garbage.addLocal(cache);
    }
}

/**@description 添加加载远程的资源 */
export function addRemoteLoadResource(view: UIView, cache: Resource.Cache) {
    let uiManager = App.uiManager;
    if (view == <any>(uiManager.retainMemory)) {
        uiManager.retainMemory.addRemote(cache);
    }
    else if (view && view instanceof UIView) {
        uiManager.addRemote(cache, view.className);
    } else {
        uiManager.garbage.addRemote(cache);
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

function isValidComponent(component: Component): boolean {
    if (isValid(component) && component.node && isValid(component.node)) {
        return true;
    }
    return false;
}

export function getAsset<T extends Asset>(dir: string, url: string, bundle: BUNDLE_TYPE, type: { prototype: T }) {
    let __bundle = App.bundleManager.getBundle(bundle)!;
    return __bundle.get(`${dir}/${url}`, type as any) as T;
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
    sprite: Sprite,
    spriteFrame: SpriteFrame,
    complete: (data: SpriteFrame) => void,
    bundle: BUNDLE_TYPE,
    resourceType?: Resource.Type,
    retain?: boolean,
    isAtlas?: boolean,
    cache: Resource.Cache,
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
    if (!data.cache) {
        Log.e(`加载${data.url}图片错误`);
        if (data.complete && isValidComponent(data.sprite)) data.complete(null!);
        return;
    }
    if (!data.isAtlas) {
        if (data.resourceType == Resource.Type.Remote) {
            addRemoteLoadResource(data.view, data.cache);
        } else {
            addExtraLoadResource(data.view, data.cache);
        }
    }

    if (data.spriteFrame && isValidComponent(data.sprite)) {
        let oldSpriteFrame = data.sprite.spriteFrame;
        let replaceData = isValid(data.spriteFrame) ? data.spriteFrame : null;
        try {
            if (replaceData) data.sprite.spriteFrame = replaceData;
            if (data.complete) data.complete(replaceData!);
        } catch (err) {
            let temp = isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            data.sprite.spriteFrame = temp;
            if (data.complete) data.complete(null!);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${data.url} : ${err ? err : "replace spriteframe error"}`);
        }
    } else {
        //完成回调
        if (data.complete && isValidComponent(data.sprite)) data.complete(data.spriteFrame);
    }
}

interface setSpriteFrameParam {
    button: Button,
    memberName: ButtonSpriteType,
    view: UIView,
    url: string,
    spriteFrame: SpriteFrame,
    complete: (type: string, data: SpriteFrame) => void,
    bundle: BUNDLE_TYPE,
    isAtlas?: boolean,
    cache: Resource.Cache,
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

    if (!data.cache) {
        if (data.complete && isValidComponent(data.button)) data.complete(data.memberName, null!);
        return;
    }
    if (!data.isAtlas) {
        addExtraLoadResource(data.view, data.cache);
    }

    if (data.spriteFrame && isValidComponent(data.button)) {
        let oldSpriteFrame: SpriteFrame = data.button[data.memberName]!;
        try {
            let replaceData = isValid(data.spriteFrame) ? data.spriteFrame : null;
            if (replaceData) data.button[data.memberName] = replaceData;
            if (data.complete) data.complete(data.memberName, replaceData!);
        } catch (err) {
            let temp = isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            data.button[data.memberName] = temp;
            if (data.complete) data.complete(data.memberName, null!);
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
    button: Button,
    memberName: ButtonSpriteType,
    view: UIView,
    url: string | { urls: string[], key: string },
    complete?: (type: string, spriteFrame: SpriteFrame) => void,
    bundle?: BUNDLE_TYPE,
) {
    let onComplete = ([cache, data, url, isAtlas]: [Resource.Cache, SpriteFrame, string, boolean]) => {
        _setButtonSpriteFrame({
            button: button,
            memberName: memberName,
            view: view,
            url: url,
            spriteFrame: data,
            complete: complete!,
            bundle: bundle!,
            cache: cache,
            isAtlas: isAtlas
        });
    }
    if (url) {
        if (typeof url == "string") {
            url = `${url}/spriteFrame`;
            App.cache.getCacheByAsync(url, SpriteFrame, bundle!, (data) => {
                onComplete([data.cache, data.asset as SpriteFrame, url as string, false]);
            });
        } else {
            //在纹理图集中查找
            App.cache.getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource, bundle!, (data) => {
                if (data && data.isTryReload) {
                    //来到这里面，程序已经崩溃，无意义在处理
                    complete && complete(memberName, null!);
                } else {
                    onComplete([data.cache, data.spriteFrame, data.url as string, true]);
                }
            });
        }
    } else {
        complete && complete(memberName, null!);
    }
}

/**
 * @description 设置按钮精灵
 * @param button 按钮组件
 * @param config 配置信息
 */
export function setButtonSpriteFrame(button: Button, config: {
    normalSprite?: string | { urls: string[], key: string },
    view: any,//UIView的子类
    pressedSprite?: string | { urls: string[], key: string },
    hoverSprite?: string | { urls: string[], key: string },
    disabledSprite?: string | { urls: string[], key: string },
    complete?: (type: string, spriteFrame: SpriteFrame) => void,
    bundle?: BUNDLE_TYPE,
}) {
    let bundle = getBundle(config);
    _setButtonWithType(button, ButtonSpriteType.Norml, config.view, config.normalSprite!, config.complete, bundle);
    _setButtonWithType(button, ButtonSpriteType.Pressed, config.view, config.pressedSprite!, config.complete, bundle);
    _setButtonWithType(button, ButtonSpriteType.Hover, config.view, config.hoverSprite!, config.complete, bundle);
    _setButtonWithType(button, ButtonSpriteType.Disable, config.view, config.disabledSprite!, config.complete, bundle);
}

/**
 * @description 设置特效
 * @param component 特效组件
 * @param config 配置信息
 * @param data 特效数据
 */
export function setParticleSystemFile(
    component: ParticleSystem2D,
    config: { url: string, view: any, complete?: (file: ParticleAsset) => void, bundle?: BUNDLE_TYPE },
    data: ParticleAsset,
    cache: Resource.Cache,
) {
    if (!cache) {
        //完成回调
        if (config.complete && isValidComponent(component)) config.complete(null!);
        return;
    }
    addExtraLoadResource(config.view, cache);
    if (data && isValidComponent(component)) {
        let oldFile = component.file;
        try {
            let replaceData = isValid(data) ? data : null;
            if (replaceData) component.file = replaceData;
            if (config.complete) config.complete(replaceData!);
        } catch (err) {
            let temp = isValid(oldFile) ? oldFile : null;
            component.file = temp;
            if (config.complete) config.complete(null!);
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
    component: Label,
    config: { font: string, view: any, complete?: (font: Font) => void, bundle?: BUNDLE_TYPE },
    data: Font,
    cache: Resource.Cache) {
    if (!cache) {
        //完成回调
        if (config.complete && isValidComponent(component)) config.complete(null!);
        return;
    }
    addExtraLoadResource(config.view, cache);
    if (data && isValidComponent(component)) {
        let oldFont = component.font;
        try {
            let replaceData = isValid(data) ? data : null;
            if (replaceData) component.font = replaceData;
            if (config.complete) config.complete(replaceData!);
        } catch (err) {
            let temp = isValid(oldFont) ? oldFont : null;
            component.font = temp;
            if (config.complete) config.complete(null!);
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
    config: { url: string, view: any, complete?: (data: sp.SkeletonData) => void, bundle?: BUNDLE_TYPE } |
    { view: any, path: string, name: string, complete?: (data: sp.SkeletonData) => void, bundle?: BUNDLE_TYPE, isNeedCache?: boolean, retain?: boolean },
    data: sp.SkeletonData,
    resourceType?: Resource.Type,
    cache: Resource.Cache,
}) {
    if (!data.cache) {
        if (data.config.complete && isValidComponent(data.component)) data.config.complete(null!);
        return;
    }
    if (data.resourceType == undefined || data.resourceType == null) {
        data.resourceType = Resource.Type.Local;
    }
    if (data.resourceType == Resource.Type.Remote) {
        addRemoteLoadResource(data.config.view, data.cache);
    } else {
        addExtraLoadResource(data.config.view, data.cache);
    }
    if (data.data && isValidComponent(data.component)) {
        let oldSkeletonData = data.component.skeletonData;
        try {
            let replaceData = isValid(data.data) ? data.data : null;
            if (replaceData) data.component.skeletonData = replaceData;
            if (data.config.complete) data.config.complete(replaceData!);
        } catch (err) {
            let temp = isValid(oldSkeletonData) ? oldSkeletonData : null;
            data.component.skeletonData = temp!;
            if (data.config.complete) data.config.complete(null!);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${data.cache.key} : ${err ? err : "replace skeletonData error"}`);
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
export function createNodeWithPrefab(config: {
    bundle?: BUNDLE_TYPE,
    url: string,
    view: any,
    complete?: (node: Node) => void,
}) {

    let onComplete = ([cache, data]: [Resource.Cache, Prefab]) => {
        if (cache) {
            addExtraLoadResource(config.view, cache);
        }
        if (data && isValidComponent(config.view)) {
            let node = instantiate(data);
            if (config.complete) config.complete(node);
        } else if (isValidComponent(config.view)) {
            if (config.complete) config.complete(null!);
        } else {
            if (config.complete) config.complete(null!);
        }
    }
    let url = config.url;
    let bundle = getBundle(config);
    App.cache.getCacheByAsync(url, Prefab, bundle, (data) => {
        onComplete([data.cache, data.asset as Prefab]);
    });
}

export function _loadDirRes(config: {
    bundle?: BUNDLE_TYPE,
    url: string,
    type: typeof Asset,
    view: any,
    onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void,
    onComplete?: (data: Resource.Cache) => void,
}) {
    let bundle = getBundle(config);

    let onComplete = (cache: Resource.Cache) => {
        if (cache) {
            addExtraLoadResource(config.view, cache);
        }
        if (config.onComplete) {
            config.onComplete(cache);
        }
    }
    //这里要做一个防止重复加载操作，以免对加载完成后的引用计数多加次数
    App.asset.loadDir(bundle, config.url, config.type, config.onProgress!, (cache) => {
        onComplete(cache);
    });
}

export function _loadRes<T extends Asset>(config: {
    bundle?: BUNDLE_TYPE,
    url: string,
    type: typeof Asset,
    onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void,
    onComplete?: (data: any) => void,
    view: any,
}) {
    let bundle = getBundle(config);
    let onComplete = (data: Resource.CacheResult<T>) => {
        if (data.cache) {
            addExtraLoadResource(config.view, data.cache);
        }
        if (config.onComplete) {
            config.onComplete(data.asset as T);
        }
    }

    if ( config.type == SpriteFrame){
        config.url = `${config.url}/spriteFrame`;
    }

    App.cache.getCacheByAsync(config.url, config.type, bundle, (data) => {
        onComplete(data as any)
    })
}

export function loadDragonDisplay(comp: dragonBones.ArmatureDisplay,
    config: {
        assetUrl: string,
        atlasUrl: string,
        view: UIView,
        complete?: (asset: dragonBones.DragonBonesAsset, atlas: dragonBones.DragonBonesAtlasAsset) => void,
        bundle?: BUNDLE_TYPE,
    }) {

    let result: { asset: dragonBones.DragonBonesAsset, atlas: dragonBones.DragonBonesAtlasAsset } = { asset: null!, atlas: null! };

    let bundle = getBundle(config);

    let onAssetComplete = ([assetCache, data]: [Resource.Cache, dragonBones.DragonBonesAsset]) => {
        if (assetCache) {
            addExtraLoadResource(config.view, assetCache);
        }
    }

    let onAtlasComplete = ([atlasCache, atlas, asset]: [Resource.Cache, dragonBones.DragonBonesAtlasAsset, dragonBones.DragonBonesAsset]) => {
        if (atlas) {
            addExtraLoadResource(config.view, atlasCache);
            comp.dragonAsset = asset;
            comp.dragonAtlasAsset = atlas;
            if (config.complete) {
                config.complete(asset, atlas);
            }
            result.asset = asset;
            result.atlas = atlas;
        } else {
            if (config.complete) {
                config.complete(asset, null!);
            }
            result.asset = asset;
        }
    }
    App.cache.getCacheByAsync(config.assetUrl, dragonBones.DragonBonesAsset, bundle, (dataAsset) => {
        if (dataAsset.asset) {
            onAssetComplete([dataAsset.cache, dataAsset.asset as dragonBones.DragonBonesAsset]);
            App.cache.getCacheByAsync(config.atlasUrl, dragonBones.DragonBonesAtlasAsset, bundle, (dataAtlas) => {
                onAtlasComplete([dataAtlas.cache, dataAtlas.asset as dragonBones.DragonBonesAtlasAsset, dataAsset.asset as dragonBones.DragonBonesAsset]);
            });
        } else {
            if (config.complete) {
                config.complete(null!, null!);
            }
        }
    });
}
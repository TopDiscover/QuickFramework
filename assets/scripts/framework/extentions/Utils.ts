import UIView from "../ui/UIView";
import { ResourceInfo, ResourceType, BUNDLE_RESOURCES, BUNDLE_REMOTE, BUNDLE_TYPE, ResourceCacheData } from "../base/Defines";
import { Manager } from "../Framework";
import { Button, Component, Font, isValid, Label, ParticleAsset, ParticleSystem, ParticleSystem2D, Sprite, SpriteFrame, sp, Node, Prefab, instantiate, Asset, AssetManager } from "cc";

/**@description 添加加载本地的资源 */
export function addExtraLoadResource(view: UIView, info: ResourceInfo) {
    let uiManager = Manager.uiManager;
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
export function addRemoteLoadResource(view: UIView, info: ResourceInfo) {
    let uiManager = Manager.uiManager;
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
export function getBundle(config: { bundle?: BUNDLE_TYPE, view?: UIView }):BUNDLE_TYPE {
    let bundle = config.bundle;
    if (config.bundle == undefined || config.bundle == null) {
        bundle = BUNDLE_RESOURCES;
        if (config.view) {
            bundle = config.view.bundle;
        }
    }
    return bundle as BUNDLE_TYPE;
}

function isValidComponent(component: Component): boolean {
    if (isValid(component) && component.node && isValid(component.node)) {
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
 * @param {*} completeCallback 完成回调(data: cc.SpriteFrame) => void
 * @param {*} resourceType 资源类型 默认为ResourceType.Local
 * @param {*} retain 是否常驻内存 默认为false
 * @param {*} isAtlas 是否是大纹理图集加载 默认为false
 */
export function setSpriteSpriteFrame(
    view: UIView,
    url: string,
    sprite: Sprite,
    spriteFrame: SpriteFrame,
    completeCallback: (data: SpriteFrame | null) => void,
    bundle: BUNDLE_TYPE,
    resourceType: ResourceType = ResourceType.Local,
    retain: boolean = false,
    isAtlas: boolean = false) {

    if (!isAtlas) {
        //纹理只需要把纹理单独添加引用，不需要把spirteFrame也添加引用
        let info = new ResourceInfo;
        info.url = url;
        info.type = SpriteFrame;
        info.data = spriteFrame;
        info.retain = retain;
        info.bundle = bundle;
        if (resourceType == ResourceType.Remote) {
            addRemoteLoadResource(view, info);
        } else {
            addExtraLoadResource(view, info);
        }
    }

    if (spriteFrame && isValidComponent(sprite)) {
        let oldSpriteFrame = sprite.spriteFrame;
        let replaceData = isValid(spriteFrame) ? spriteFrame : null;
        try {
            if (replaceData) sprite.spriteFrame = replaceData;
            if (completeCallback) completeCallback(replaceData);
        } catch (error) {
            let temp = isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            sprite.spriteFrame = temp;
            if (completeCallback) completeCallback(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            error(`${url} : ${error ? error : "replace spriteframe error"}`);
        }
    } else {
        //完成回调
        if (completeCallback && isValidComponent(sprite)) completeCallback(spriteFrame);
    }
}

export enum ButtonSpriteMemberName {
    Norml = "normalSprite",
    Pressed = "pressedSprite",
    Hover = "hoverSprite",
    Disable = "disabledSprite",
}

/**
 * @description 设置按钮精灵帧
 * @param view 持有视图
 * @param url url 
 * @param button 
 * @param spriteFrame 新的spriteFrame
 * @param memberName 替换成员变量名
 * @param completeCallback 完成回调
 * @param isAtlas 是否是从大纹理图集中加载的
 */
function _setSpriteFrame(
    view: UIView,
    url: string,
    button: Button,
    spriteFrame: SpriteFrame,
    memberName: string,
    completeCallback: (type: string, data: SpriteFrame | null) => void,
    isAtlas: boolean,
    bundle: BUNDLE_TYPE) {

    if (!isAtlas) {
        let info = new ResourceInfo;
        info.url = url;
        info.type = SpriteFrame;
        info.data = spriteFrame;
        info.bundle = bundle;
        addExtraLoadResource(view, info);
    }

    if (spriteFrame && isValidComponent(button)) {
        let oldSpriteFrame: SpriteFrame = (<any>button)[memberName];
        try {
            let replaceData = isValid(spriteFrame) ? spriteFrame : null;
            if (replaceData) (<any>button)[memberName] = replaceData;
            if (completeCallback) completeCallback(memberName, replaceData);
        } catch (error) {
            let temp = isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            (<any>button)[memberName] = temp;
            if (completeCallback) completeCallback(memberName, null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            error(`${url} : ${error ? error : "replace spriteframe error"}`);
        }
    } else {
        if (completeCallback && isValidComponent(button)) completeCallback(memberName, spriteFrame);
    }

};

/**
 * @description 设置按钮精灵帧
 * @param button 按钮组件 
 * @param memberName 成员变量名 
 * @param view 持有视图
 * @param url url
 * @param spriteFrame 待替换的精灵帧 
 * @param completeCallback 完成回调
 * @param isAtlas 是否是从大纹理图集中加载的 默认为false
 */
function _setButtonSpriteFrame(
    button: Button,
    memberName: ButtonSpriteMemberName,
    view: UIView,
    url: string,
    spriteFrame: SpriteFrame,
    completeCallback: (type: string, data: SpriteFrame | null) => void,
    bundle: BUNDLE_TYPE,
    isAtlas: boolean = false) {

    if (spriteFrame && isValidComponent(button)) {
        _setSpriteFrame(view, url, button, spriteFrame, memberName, completeCallback, isAtlas, bundle);
    } else {
        //完成回调
        if (completeCallback && isValidComponent(button)) completeCallback(memberName, spriteFrame);
    }
}

/**
 * @description 根据类型设置按钮
 * @param button 
 * @param memberName 成员变量名
 * @param view 
 * @param url 
 * @param completeCallback 
 */
function _setButtonWithType(
    button: Button,
    memberName: ButtonSpriteMemberName,
    view: UIView,
    url: string | { urls: string[], key: string },
    completeCallback?: (type: string, spriteFrame: SpriteFrame | null) => void,
    bundle?: BUNDLE_TYPE
) {
    if (url) {
        if (typeof url == "string") {
            Manager.cacheManager.getCacheByAsync(url, SpriteFrame, bundle as BUNDLE_TYPE).then((spriteFrame) => {
                _setButtonSpriteFrame(button, memberName, view, url, spriteFrame, completeCallback as any, bundle as BUNDLE_TYPE);
            });
        } else {
            //在纹理图集中查找
            Manager.cacheManager.getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource, bundle as BUNDLE_TYPE).then((data) => {
                if (data && data.isTryReload) {
                    //来到这里面，程序已经崩溃，无意义在处理
                } else {
                    _setButtonSpriteFrame(button, memberName, view, data.url, data.spriteFrame as SpriteFrame, completeCallback as any, bundle as BUNDLE_TYPE, true);
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
export function setButtonSpriteFrame(button: Button, config: {
    normalSprite?: string | { urls: string[], key: string },
    view: any,//UIView的子类
    pressedSprite?: string | { urls: string[], key: string },
    hoverSprite?: string | { urls: string[], key: string },
    disabledSprite?: string | { urls: string[], key: string },
    completeCallback?: (type: string, spriteFrame: SpriteFrame | null) => void,
    bundle?: BUNDLE_TYPE
}) {
    let bundle = getBundle(config);
    _setButtonWithType(button, ButtonSpriteMemberName.Norml, config.view, config.normalSprite as any, config.completeCallback, bundle);
    _setButtonWithType(button, ButtonSpriteMemberName.Pressed, config.view, config.pressedSprite as any, config.completeCallback, bundle);
    _setButtonWithType(button, ButtonSpriteMemberName.Hover, config.view, config.hoverSprite as any, config.completeCallback, bundle);
    _setButtonWithType(button, ButtonSpriteMemberName.Disable, config.view, config.disabledSprite as any, config.completeCallback, bundle);
}

/**
 * @description 设置特效
 * @param component 特效组件
 * @param config 配置信息
 * @param data 特效数据
 */
export function setParticleSystemFile(
    component: ParticleSystem2D,
    config: { url: string, view: any, completeCallback?: (file: ParticleAsset | null) => void, bundle: BUNDLE_TYPE },
    data: ParticleAsset
) {
    let info = new ResourceInfo;
    info.url = config.url;
    info.type = ParticleAsset;
    info.data = data;
    info.bundle = getBundle(config);
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(component)) {
        let oldFile = component.file;
        try {
            let replaceData = isValid(data) ? data : null;
            if (replaceData) component.file = replaceData;
            if (config.completeCallback) config.completeCallback(replaceData);
        } catch (error) {
            let temp = isValid(oldFile) ? oldFile : null;
            component.file = temp;
            if (config.completeCallback) config.completeCallback(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            error(`${config.url} : ${error ? error : "replace file error"}`);
        }
    } else {
        //完成回调
        if (config.completeCallback && isValidComponent(component)) config.completeCallback(data);
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
    config: { font: string, view: any, completeCallback?: (font: Font | null) => void, bundle: BUNDLE_TYPE },
    data: Font) {
    let info = new ResourceInfo;
    info.url = config.font;
    info.type = Font;
    info.data = data;
    info.bundle = getBundle(config);
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(component)) {
        let oldFont = component.font;
        try {
            let replaceData = isValid(data) ? data : null;
            if (replaceData) component.font = replaceData;
            if (config.completeCallback) config.completeCallback(replaceData);
        } catch (error) {
            let temp = isValid(oldFont) ? oldFont : null;
            component.font = temp;
            if (config.completeCallback) config.completeCallback(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            error(`${config.font} : ${error ? error : "replace font error"}`);
        }
    } else {
        //完成回调
        if (config.completeCallback && isValidComponent(component)) config.completeCallback(data);
    }
}

/**
 * @description 设置spine动画数据
 * @param component spine组件
 * @param config 配置信息
 * @param data 动画数据
 */
export function setSkeletonSkeletonData(
    component: sp.Skeleton,
    config: { url: string, view: any, completeCallback: (data: sp.SkeletonData | null) => void, bundle: BUNDLE_TYPE } |
    { view: any, path: string, name: string, completeCallback: (data: sp.SkeletonData | null) => void, bundle: BUNDLE_TYPE, isNeedCache?: boolean, retain?: boolean },
    data: sp.SkeletonData,
    resourceType: ResourceType = ResourceType.Local) {
    let url = "";
    let retain = false;
    if (resourceType == ResourceType.Remote) {
        let realConfig: { view: any, path: string, name: string, completeCallback: (data: sp.SkeletonData | null) => void, isNeedCache?: boolean, retain?: boolean } = <any>config;
        url = `${realConfig.path}/${realConfig.name}`;
        retain = realConfig.retain ? true : false;
    } else {
        let realConfig: { url: string, view: any, completeCallback: (data: sp.SkeletonData | null) => void } = <any>config;
        url = realConfig.url;
    }
    let info = new ResourceInfo;
    info.url = url;
    info.type = sp.SkeletonData;
    info.data = data;
    info.retain = retain;
    info.bundle = getBundle(config);
    if (resourceType == ResourceType.Remote) {
        info.bundle = BUNDLE_REMOTE;
        addRemoteLoadResource(config.view, info);
    } else {
        addExtraLoadResource(config.view, info);
    }
    if (data && isValidComponent(component)) {
        let oldSkeletonData = component.skeletonData;
        try {
            let replaceData = isValid(data) ? data : null;
            if (replaceData) component.skeletonData = replaceData;
            if (config.completeCallback) config.completeCallback(replaceData);
        } catch (error) {
            let temp = isValid(oldSkeletonData) ? oldSkeletonData : null;
            component.skeletonData = temp as sp.SkeletonData;
            if (config.completeCallback) config.completeCallback(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            error(`${url} : ${error ? error : "replace skeletonData error"}`);
        }
    } else {
        //完成回调
        if (config.completeCallback && isValidComponent(component)) config.completeCallback(data);
    }
}

/**
 * @description 通过预置体创建Node
 * @param config 配置信息
 */
export function createNodeWithPrefab(config: { bundle: BUNDLE_TYPE, url: string, view: any, completeCallback: (node: Node | null) => void }) {

    let url = config.url;
    let bundle = getBundle(config);
    let cache = Manager.cacheManager.get(bundle, url);
    Manager.cacheManager.getCacheByAsync(url, Prefab, bundle).then((data) => {
        if (!cache) {
            let info = new ResourceInfo;
            info.url = config.url;
            info.type = Prefab;
            info.data = data;
            info.bundle = getBundle(config);
            addExtraLoadResource(config.view, info);
        }
        if (data && isValidComponent(config.view) && config.completeCallback) {
            let node = instantiate(data);
            config.completeCallback(node);
        } else if (isValidComponent(config.view) && config.completeCallback) {
            config.completeCallback(null);
        }
    });
}

export function _loadDirRes(config: {
    bundle?: BUNDLE_TYPE,
    url: string,
    type: typeof Asset,
    view: any,
    onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void,
    onComplete: (data: ResourceCacheData) => void
}) {
    let bundle = getBundle(config);
    let cache = Manager.cacheManager.get(bundle, config.url);
    //这里要做一个防止重复加载操作，以免对加载完成后的引用计数多加次数
    Manager.assetManager.loadDir(bundle, config.url, config.type, config.onProgress as any, (data) => {

        if (!cache) {
            //如果已经有了，可能是从logic中加载过来的，不在进行引用计数操作
            let info = new ResourceInfo;
            info.url = config.url;
            info.type = config.type;
            info.data = data.data as any;
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
    type: typeof Asset,
    onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void,
    onComplete: (data: any) => void,
    view: any,
}) {
    let bundle = getBundle(config);
    let cache = Manager.cacheManager.get(bundle, config.url);
    Manager.assetManager.load(
        bundle,
        config.url,
        config.type,
        config.onProgress as any,
        (data) => {
            if (!cache) {
                let info = new ResourceInfo;
                info.url = config.url;
                info.type = config.type;
                info.data = data.data as any;
                info.bundle = bundle;
                addExtraLoadResource(config.view, info);
            }
            if (config.onComplete) {
                config.onComplete(data);
            }
        }
    )
}
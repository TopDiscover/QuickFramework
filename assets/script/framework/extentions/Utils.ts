import UIView from "../ui/UIView";
import { resCaches } from "../cache/ResCaches";
import { ResourceInfo, ResourceType } from "../base/Defines";
import { uiManager } from "../base/UIManager";

/*
 * @Author: your name
 * @Date: 2020-03-20 10:07:02
 * @LastEditTime: 2020-04-10 15:29:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ddz\assets\framework\extentions\Utils.ts
 */

/**@description 添加加载本地的资源 */
export function addExtraLoadResource(view: UIView, info: ResourceInfo) {
    if (view == <any>(uiManager().retainMemory)) {
        uiManager().retainMemory.addLocal(info);
    }
    else if (view && view instanceof UIView) {
        uiManager().addLocal(info, view.className);
    } else {
        uiManager().garbage.addLocal(info);
    }
}

/**@description 计录当前对资源引用的url地址,以防止在A界面关闭，B界面打开时，且在使用同一资源时，
 * 由于B界面资源未加载完成进行资源的引用+1操作，A界面已经提前对资源进行-1操作释放，造成资源被释放问题 */
export function addExtraLoadResourceReference(view: UIView, info: ResourceInfo) {
    if (view == <any>(uiManager().retainMemory)) {
        uiManager().retainMemory.addReference(info);
    }
    else if (view && view instanceof UIView) {
        uiManager().addReference(info, view.className);
    } else {
        uiManager().garbage.addReference(info);
    }
}

/**@description 添加加载远程的资源 */
export function addRemoteLoadResource(view: UIView, info: ResourceInfo) {
    if (view == <any>(uiManager().retainMemory)) {
        uiManager().retainMemory.addRemote(info);
    }
    else if (view && view instanceof UIView) {
        uiManager().addRemote(info, view.className);
    } else {
        uiManager().garbage.addRemote(info);
    }
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
 * @param {*} completeCallback 完成回调(data: cc.SpriteFrame) => void
 * @param {*} resourceType 资源类型 默认为ResourceType.Local
 * @param {*} retain 是否常驻内存 默认为false
 * @param {*} isAtlas 是否是大纹理图集加载 默认为false
 */
export function setSpriteSpriteFrame(
    view: UIView,
    url: string,
    sprite: cc.Sprite,
    spriteFrame: cc.SpriteFrame,
    completeCallback: (data: cc.SpriteFrame) => void,
    resourceType: ResourceType = ResourceType.Local,
    retain: boolean = false,
    isAtlas: boolean = false) {

    if (!isAtlas) {
        //纹理只需要把纹理单独添加引用，不需要把spirteFrame也添加引用
        let info = new ResourceInfo;
        info.url = url;
        info.type = cc.SpriteFrame;
        info.data = spriteFrame;
        info.retain = retain;
        if (resourceType == ResourceType.Remote) {
            addRemoteLoadResource(view, info);
        } else {
            addExtraLoadResource(view, info);
        }
    }

    if (spriteFrame && isValidComponent(sprite)) {
        let oldSpriteFrame = sprite.spriteFrame;
        let replaceData = cc.isValid(spriteFrame) ? spriteFrame : null;
        try {
            if (replaceData) sprite.spriteFrame = replaceData;
            if (completeCallback) completeCallback(replaceData);
        } catch (error) {
            let temp = cc.isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            sprite.spriteFrame = temp;
            if (completeCallback) completeCallback(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            cc.error(`${url} : ${error ? error : "replace spriteframe error"}`);
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
    button: cc.Button,
    spriteFrame: cc.SpriteFrame,
    memberName: string,
    completeCallback: (type: string, data: cc.SpriteFrame) => void,
    isAtlas: boolean) {

    if (!isAtlas) {
        let info = new ResourceInfo;
        info.url = url;
        info.type = cc.SpriteFrame;
        info.data = spriteFrame;
        addExtraLoadResource(view, info);
    }

    if (spriteFrame && isValidComponent(button)) {
        let oldSpriteFrame: cc.SpriteFrame = button[memberName];
        try {
            let replaceData = cc.isValid(spriteFrame) ? spriteFrame : null;
            if (replaceData) button[memberName] = replaceData;
            if (completeCallback) completeCallback(memberName, replaceData);
        } catch (error) {
            let temp = cc.isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            button[memberName] = temp;
            if (completeCallback) completeCallback(memberName, null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            cc.error(`${url} : ${error ? error : "replace spriteframe error"}`);
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
    button: cc.Button,
    memberName: ButtonSpriteMemberName,
    view: UIView,
    url: string,
    spriteFrame: cc.SpriteFrame,
    completeCallback: (type: string, data: cc.SpriteFrame) => void,
    isAtlas: boolean = false) {

    if (spriteFrame && isValidComponent(button)) {
        _setSpriteFrame(view, url, button, spriteFrame, memberName, completeCallback, isAtlas);
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
    button: cc.Button,
    memberName: ButtonSpriteMemberName,
    view: UIView,
    url: string | { urls: string[], key: string },
    completeCallback?: (type: string, spriteFrame: cc.SpriteFrame) => void
) {
    if (url) {
        if (typeof url == "string") {
            let info = new ResourceInfo;
            info.type = cc.SpriteFrame;
            info.url = url;
            addExtraLoadResourceReference(view, info);
            resCaches().getCacheByAsync(url, cc.SpriteFrame).then((spriteFrame) => {
                _setButtonSpriteFrame(button, memberName, view, url, spriteFrame, completeCallback);
            });
        } else {
            //在纹理图集中查找
            resCaches().getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource).then((data) => {
                if (data && data.isTryReload) {
                    //来到这里面，程序已经崩溃，无意义在处理
                } else {
                    _setButtonSpriteFrame(button, memberName, view, data.url, data.spriteFrame, completeCallback, true);
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
    completeCallback?: (type: string, spriteFrame: cc.SpriteFrame) => void
}) {
    _setButtonWithType(button, ButtonSpriteMemberName.Norml, config.view, config.normalSprite, config.completeCallback);
    _setButtonWithType(button, ButtonSpriteMemberName.Pressed, config.view, config.pressedSprite, config.completeCallback);
    _setButtonWithType(button, ButtonSpriteMemberName.Hover, config.view, config.hoverSprite, config.completeCallback);
    _setButtonWithType(button, ButtonSpriteMemberName.Disable, config.view, config.disabledSprite, config.completeCallback);
}

/**
 * @description 设置特效
 * @param component 特效组件
 * @param config 配置信息
 * @param data 特效数据
 */
export function setParticleSystemFile(
    component: cc.ParticleSystem,
    config: { url: string, view: any, completeCallback?: (file: cc.ParticleAsset) => void },
    data: cc.ParticleAsset
) {
    let info = new ResourceInfo;
    info.url = config.url;
    info.type = cc.ParticleAsset;
    info.data = data;
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(component)) {
        let oldFile = component.file;
        try {
            let replaceData = cc.isValid(data) ? data : null;
            if (replaceData) component.file = replaceData;
            if (config.completeCallback) config.completeCallback(replaceData);
        } catch (error) {
            let temp = cc.isValid(oldFile) ? oldFile : null;
            component.file = temp;
            if (config.completeCallback) config.completeCallback(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            cc.error(`${config.url} : ${error ? error : "replace file error"}`);
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
    component: cc.Label,
    config: { font: string, view: any, completeCallback?: (font: cc.Font) => void },
    data: cc.Font) {
    let info = new ResourceInfo;
    info.url = config.font;
    info.type = cc.Font;
    info.data = data;
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(component)) {
        let oldFont = component.font;
        try {
            let replaceData = cc.isValid(data) ? data : null;
            if (replaceData) component.font = replaceData;
            if (config.completeCallback) config.completeCallback(replaceData);
        } catch (error) {
            let temp = cc.isValid(oldFont) ? oldFont : null;
            component.font = temp;
            if (config.completeCallback) config.completeCallback(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            cc.error(`${config.font} : ${error ? error : "replace font error"}`);
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
    config: { url: string, view: any, completeCallback: (data: sp.SkeletonData) => void } |
    { view: any, path: string, name: string, completeCallback: (data: sp.SkeletonData) => void, isNeedCache?: boolean, retain?: boolean },
    data: sp.SkeletonData,
    resourceType: ResourceType = ResourceType.Local) {
    let url = "";
    let retain = false;
    if (resourceType == ResourceType.Remote) {
        let realConfig: { view: any, path: string, name: string, completeCallback: (data: sp.SkeletonData) => void, isNeedCache?: boolean, retain?: boolean } = <any>config;
        url = `${realConfig.path}/${realConfig.name}`;
        retain = realConfig.retain ? true : false;
    } else {
        let realConfig: { url: string, view: any, completeCallback: (data: sp.SkeletonData) => void } = <any>config;
        url = realConfig.url;
    }
    let info = new ResourceInfo;
    info.url = url;
    info.type = sp.SkeletonData;
    info.data = data;
    info.retain = retain;
    if (resourceType == ResourceType.Remote) {
        addRemoteLoadResource(config.view, info);
    } else {
        addExtraLoadResource(config.view, info);
    }
    if (data && isValidComponent(component)) {
        let oldSkeletonData = component.skeletonData;
        try {
            let replaceData = cc.isValid(data) ? data : null;
            if (replaceData) component.skeletonData = replaceData;
            if (config.completeCallback) config.completeCallback(replaceData);
        } catch (error) {
            let temp = cc.isValid(oldSkeletonData) ? oldSkeletonData : null;
            component.skeletonData = temp;
            if (config.completeCallback) config.completeCallback(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            cc.error(`${url} : ${error ? error : "replace skeletonData error"}`);
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
export function createNodeWithPrefab(config: { url: string, view: any, completeCallback: (node: cc.Node) => void }, data: cc.Prefab) {
    let info = new ResourceInfo;
    info.url = config.url;
    info.type = cc.Prefab;
    info.data = data;
    addExtraLoadResource(config.view, info);
    if (data && isValidComponent(config.view) && config.completeCallback) {
        let node = cc.instantiate(data);
        config.completeCallback(node);
    }
}
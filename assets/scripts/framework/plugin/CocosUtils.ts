import { Resource } from "../core/asset/Resource";
import UIView from "../core/ui/UIView";
import { ButtonSpriteType } from "../defines/Enums";
import { Macro } from "../defines/Macros";

/**@description 添加加载本地的资源 */
export function addExtraLoadResource(view: UIView, info: Resource.Info) {
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
export function addRemoteLoadResource(view: UIView, info: Resource.Info) {
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
export function getBundle( config : { bundle? : BUNDLE_TYPE , view? : UIView}){
    let bundle : BUNDLE_TYPE = config.bundle as BUNDLE_TYPE;
    if ( config.bundle == undefined || config.bundle == null ){
        bundle = Macro.BUNDLE_RESOURCES;
        if( config.view ){
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
export function setSpriteSpriteFrame(
    view: UIView,
    url: string,
    sprite: cc.Sprite,
    spriteFrame: cc.SpriteFrame,
    complete: (data: cc.SpriteFrame) => void,
    bundle:BUNDLE_TYPE,
    resourceType: Resource.Type = Resource.Type.Local,
    retain: boolean = false,
    isAtlas: boolean = false) {

    if (!isAtlas) {
        //纹理只需要把纹理单独添加引用，不需要把spirteFrame也添加引用
        let info = new Resource.Info;
        info.url = url;
        info.type = cc.SpriteFrame;
        info.data = spriteFrame;
        info.retain = retain;
        info.bundle = bundle;
        if (resourceType == Resource.Type.Remote) {
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
            if (complete) complete(replaceData);
        } catch (err) {
            let temp = cc.isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            sprite.spriteFrame = temp;
            if (complete) complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${url} : ${err ? err : "replace spriteframe error"}`);
        }
    } else {
        //完成回调
        if (complete && isValidComponent(sprite)) complete(spriteFrame);
    }
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
function _setSpriteFrame(
    view: UIView,
    url: string,
    button: cc.Button,
    spriteFrame: cc.SpriteFrame,
    memberName: string,
    complete: (type: string, data: cc.SpriteFrame) => void,
    isAtlas: boolean,
    bundle:BUNDLE_TYPE) {

    if (!isAtlas) {
        let info = new Resource.Info;
        info.url = url;
        info.type = cc.SpriteFrame;
        info.data = spriteFrame;
        info.bundle = bundle;
        addExtraLoadResource(view, info);
    }

    if (spriteFrame && isValidComponent(button)) {
        let oldSpriteFrame: cc.SpriteFrame = button[memberName];
        try {
            let replaceData = cc.isValid(spriteFrame) ? spriteFrame : null;
            if (replaceData) button[memberName] = replaceData;
            if (complete) complete(memberName, replaceData);
        } catch (err) {
            let temp = cc.isValid(oldSpriteFrame) ? oldSpriteFrame : null;
            button[memberName] = temp;
            if (complete) complete(memberName, null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${url} : ${err ? err : "replace spriteframe error"}`);
        }
    } else {
        if (complete && isValidComponent(button)) complete(memberName, spriteFrame);
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
function _setButtonSpriteFrame(
    button: cc.Button,
    memberName: ButtonSpriteType,
    view: UIView,
    url: string,
    spriteFrame: cc.SpriteFrame,
    complete: (type: string, data: cc.SpriteFrame) => void,
    bundle: BUNDLE_TYPE,
    isAtlas: boolean = false) {

    if (spriteFrame && isValidComponent(button)) {
        _setSpriteFrame(view, url, button, spriteFrame, memberName, complete, isAtlas,bundle);
    } else {
        //完成回调
        if (complete && isValidComponent(button)) complete(memberName, spriteFrame);
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
    bundle ?: BUNDLE_TYPE
) {
    if (url) {
        if (typeof url == "string") {
            Manager.cacheManager.getCacheByAsync(url, cc.SpriteFrame,bundle).then((spriteFrame) => {
                _setButtonSpriteFrame(button, memberName, view, url, spriteFrame, complete,bundle);
            });
        } else {
            //在纹理图集中查找
            Manager.cacheManager.getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource,bundle).then((data) => {
                if (data && data.isTryReload) {
                    //来到这里面，程序已经崩溃，无意义在处理
                } else {
                    _setButtonSpriteFrame(button, memberName, view, data.url, data.spriteFrame, complete,bundle, true);
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
    bundle?:BUNDLE_TYPE
}) {
    let bundle = getBundle(config);
    _setButtonWithType(button, ButtonSpriteType.Norml, config.view, config.normalSprite, config.complete,bundle);
    _setButtonWithType(button, ButtonSpriteType.Pressed, config.view, config.pressedSprite, config.complete,bundle);
    _setButtonWithType(button, ButtonSpriteType.Hover, config.view, config.hoverSprite, config.complete,bundle);
    _setButtonWithType(button, ButtonSpriteType.Disable, config.view, config.disabledSprite, config.complete,bundle);
}

/**
 * @description 设置特效
 * @param component 特效组件
 * @param config 配置信息
 * @param data 特效数据
 */
export function setParticleSystemFile(
    component: cc.ParticleSystem,
    config: { url: string, view: any, complete?: (file: cc.ParticleAsset) => void , bundle?:BUNDLE_TYPE},
    data: cc.ParticleAsset
) {
    let info = new Resource.Info;
    info.url = config.url;
    info.type = cc.ParticleAsset;
    info.data = data;
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
    config: { font: string, view: any, complete?: (font: cc.Font) => void , bundle?:BUNDLE_TYPE },
    data: cc.Font) {
    let info = new Resource.Info;
    info.url = config.font;
    info.type = cc.Font;
    info.data = data;
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
 * @param component spine组件
 * @param config 配置信息
 * @param data 动画数据
 */
export function setSkeletonSkeletonData(
    component: sp.Skeleton,
    config: { url: string, view: any, complete: (data: sp.SkeletonData) => void , bundle?:BUNDLE_TYPE} |
    { view: any, path: string, name: string, complete: (data: sp.SkeletonData) => void, bundle?:BUNDLE_TYPE , isNeedCache?: boolean, retain?: boolean },
    data: sp.SkeletonData,
    resourceType: Resource.Type = Resource.Type.Local) {
    let url = "";
    let retain = false;
    if (resourceType == Resource.Type.Remote) {
        let realConfig: { view: any, path: string, name: string, complete: (data: sp.SkeletonData) => void, isNeedCache?: boolean, retain?: boolean } = <any>config;
        url = `${realConfig.path}/${realConfig.name}`;
        retain = realConfig.retain ? true : false;
    } else {
        let realConfig: { url: string, view: any, complete: (data: sp.SkeletonData) => void } = <any>config;
        url = realConfig.url;
    }
    let info = new Resource.Info;
    info.url = url;
    info.type = sp.SkeletonData;
    info.data = data;
    info.retain = retain;
    info.bundle = getBundle(config);
    if (resourceType == Resource.Type.Remote) {
        info.bundle = Macro.BUNDLE_REMOTE;
        addRemoteLoadResource(config.view, info);
    } else {
        addExtraLoadResource(config.view, info);
    }
    if (data && isValidComponent(component)) {
        let oldSkeletonData = component.skeletonData;
        try {
            let replaceData = cc.isValid(data) ? data : null;
            if (replaceData) component.skeletonData = replaceData;
            if (config.complete) config.complete(replaceData);
        } catch (err) {
            let temp = cc.isValid(oldSkeletonData) ? oldSkeletonData : null;
            component.skeletonData = temp;
            if (config.complete) config.complete(null);
            //把数据放到全局的垃圾回收中 //好像有点不行，
            Log.e(`${url} : ${err ? err : "replace skeletonData error"}`);
        }
    } else {
        //完成回调
        if (config.complete && isValidComponent(component)) config.complete(data);
    }
}

/**
 * @description 通过预置体创建Node
 * @param config 配置信息
 */
export function createNodeWithPrefab(config: { bundle?:BUNDLE_TYPE , url: string, view: any, complete: (node: cc.Node) => void }) {
    
    let url = config.url;
    let bundle = getBundle(config);
    let cache = Manager.cacheManager.get(bundle,url);
    Manager.cacheManager.getCacheByAsync(url, cc.Prefab,bundle).then((data) => {
        if (!cache) {
            let info = new Resource.Info;
            info.url = config.url;
            info.type = cc.Prefab;
            info.data = data;
            info.bundle = getBundle(config);
            addExtraLoadResource(config.view, info);
        }
        if (data && isValidComponent(config.view) && config.complete) {
            let node = cc.instantiate(data);
            config.complete(node);
        } else if( isValidComponent(config.view) && config.complete){
            config.complete(null);
        }
    });
}

export function _loadDirRes( config:{ 
    bundle?:BUNDLE_TYPE,
    url : string , 
    type : typeof cc.Asset, 
    view : any, 
    onProgress?:(finish:number,total:number,item:cc.AssetManager.RequestItem) => void , 
    onComplete:(data:Resource.CacheData)=>void}){
        let bundle = getBundle(config);
        let cache = Manager.cacheManager.get(bundle,config.url);
        //这里要做一个防止重复加载操作，以免对加载完成后的引用计数多加次数
        Manager.assetManager.loadDir(bundle,config.url,config.type,config.onProgress,(data)=>{
            
            if( !cache ){
                //如果已经有了，可能是从logic中加载过来的，不在进行引用计数操作
                let info = new Resource.Info;
                info.url = config.url;
                info.type = config.type;
                info.data = data.data;
                info.bundle = bundle;
                addExtraLoadResource(config.view, info)
            }
            
            if (config.onComplete) {
                config.onComplete(data);
            }
        });
    }

export function _loadRes(config:{
    bundle?: BUNDLE_TYPE,
    url: string,
    type: typeof cc.Asset,
    onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
    onComplete: (data:any) => void,
    view : any,
}){
    let bundle = getBundle(config);
    let cache = Manager.cacheManager.get(bundle,config.url);
    Manager.assetManager.load(
        bundle,
        config.url,
        config.type,
        config.onProgress,
        (data)=>{
            if( !cache ){
                let info = new Resource.Info;
                info.url = config.url;
                info.type = config.type;
                info.data = data.data;
                info.bundle = bundle;
                addExtraLoadResource(config.view,info);
            }
            if(config.onComplete){
                config.onComplete(data);
            }
        }
    )
}

export function loadDragonDisplay(comp: dragonBones.ArmatureDisplay, config: { assetUrl: string, atlasUrl: string, view: UIView, complete: (asset: dragonBones.DragonBonesAsset, atlas: dragonBones.DragonBonesAtlasAsset) => void, bundle?: BUNDLE_TYPE }) {
    let bundle = getBundle(config);
    Manager.cacheManager.getCacheByAsync(config.assetUrl, dragonBones.DragonBonesAsset, bundle).then((asset) => {
        if (asset) {
            let info = new Resource.Info;
            info.url = config.assetUrl;
            info.type = dragonBones.DragonBonesAsset;
            info.data = asset;
            info.bundle = getBundle(config);
            addExtraLoadResource(config.view, info);
            Manager.cacheManager.getCacheByAsync(config.atlasUrl, dragonBones.DragonBonesAtlasAsset, bundle).then((atlas) => {
                if (atlas) {
                    if (cc.sys.isBrowser) {
                        let info = new Resource.Info;
                        info.url = config.atlasUrl;
                        info.type = dragonBones.DragonBonesAtlasAsset;
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
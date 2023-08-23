import {
    addExtraLoadResource, setSpriteSpriteFrame, setButtonSpriteFrame,
    setParticleSystemFile, setLabelFont, setSkeletonSkeletonData,
    createNodeWithPrefab,getBundle,_loadDirRes,_loadRes, loadDragonDisplay
} from "./CocosUtils";
import { Resource } from "../core/asset/Resource";
import { Macro } from "../defines/Macros";

/**@description 对cc.Node 扩展一个临时存储的用户自定义数据 */
if (typeof Reflect == "object") {
    //在浏览器中已经有反射
    Reflect.defineProperty(cc.Node.prototype, "userData", {
        value: null,
        writable: true,
    });
} else {
    cc.Node.prototype.userData = null;
}

/**
 * @description 从网络加载图片，推荐使用第二种方式
 * @param url 网络地址，如 : http://tools.itharbors.com/res/logo.png
 * @param complete 加载完成回调
 * @param defaultSpriteFrame 加载图片失败后，使用的默认图片,当传入string时，会动态加载该默认图片
 * @param isNeedCache 是否需要缓存到本地,如果不需要，每次都会从网络拉取资源,默认都会缓存到本地
 * @param config.retain 远程加载的资源是否驻留在内存中,默认都不驻留内存
 * @example
 * 示例1：
 * let sprite = imageNode.getComponent(cc.Sprite);
 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", defaultSpriteFrame : HALL("textures/avatar_default_0.png"), view : this,complete : (data)=>{
 * 		if ( data ) { do something }
 * }});
 * 
 * 示例2:
 * let sprite = imageNode.getComponent(cc.Sprite);
 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", defaultSpriteFrame : HALL("textures/avatar_default_0.png"), view : this});
 * 
 * 示例3：
 * let sprite = imageNode.getComponent(cc.Sprite);
 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", view : this});
 * }
 */

//config : {url: string, view : any , complete?: (data: cc.SpriteFrame) => void, defaultSpriteFrame?: string , isNeedCache ?: boolean }
cc.Sprite.prototype.loadRemoteImage = function (config) {
    let me = this;
    if (config.isNeedCache == undefined || config.isNeedCache == null) {
        config.isNeedCache = true;
    }
    let isRetain = false;
    if (config.retain) {
        isRetain = true;
    }
    me.loadUrl = config.url;
    let defaultBundle = getBundle({bundle:config.defaultBundle,view:config.view})
    App.asset.remote.loadImage(config.url, config.isNeedCache).then((data) => {
        if ( me.loadUrl == data?.nativeUrl ){
            //防止时间调用加载不同url时，以当前记录的url为最终
            if (data) {
                setSpriteSpriteFrame(config.view, config.url, me, data, config.complete,Macro.BUNDLE_REMOTE, Resource.Type.Remote, isRetain);
            } else {
                if (config.defaultSpriteFrame) {
                    if (typeof config.defaultSpriteFrame == "string") {
                        //动态加载了一张图片，把资源通知管理器
                        App.cache.getCacheByAsync(config.defaultSpriteFrame,cc.SpriteFrame,defaultBundle).then((spriteFrame) => {
                            setSpriteSpriteFrame(config.view, config.defaultSpriteFrame, me, spriteFrame, config.complete,defaultBundle);
                        });
                    }
                }
                if (config.complete && cc.isValid(me)) config.complete(data);
            }
        }
    });
};

/**
 * @description 加载本地图片
 * @param url 图片路径 {urls:string[],key:string} urls 为纹理名如果有此纹理会打包成多张，此时需要传入所有纹理的地址，key指纹理中名字
 * @param view 所属视图，UIView的子类
 * @param complete 完成回调
 * @example
 * 示例1：
 * sprite.getComponent(cc.Sprite).loadImage({url:{urls:["plist/fish_30","plist/fish_30_1","plist/fish_30_2"],key:"fishMove_030_28"},view:this});
 * 示例2：
 * sprite.getComponent(cc.Sprite).loadImage({url:"hall/a",view:this});
 */
//loadImage( config : { url : string | {urls:string[],key:string} , view : any , complete?:(data : SpriteFrame)=>void});
cc.Sprite.prototype.loadImage = function (config) {

    let me = this;
    let view = config.view;
    let url = config.url;
    let complete = config.complete;
    let bundle = getBundle(config);
    if (typeof url == "string") {
        App.cache.getCacheByAsync(url, cc.SpriteFrame,bundle).then((spriteFrame) => {
            setSpriteSpriteFrame(view, url as string, me, spriteFrame, complete,bundle);
        });
    } else {
        //在纹理图集中查找
        App.cache.getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource,bundle).then((data) => {
            if ( data && data.isTryReload ){
               //来到这里面程序已经崩溃了，无意义在处理了
            }else{
                setSpriteSpriteFrame(view, data.url, me, data.spriteFrame, complete,bundle,Resource.Type.Local,false,true);
            }
        });
    }
}

/**
 * @description 扩展方法
 * @param remotePath 远程资源路径
 * @param name 远程Spine文件名，不再后缀
 * @param complete 完成回调
 * @param isNeedCache 是否需要缓存到本地,如果不需要，每次都会从网络拉取资源,默认都会缓存到本地
 * @param config.retain 远程加载的资源是否驻留在内存中,默认都不驻留内存
 * @example
 * var skeleton = node.addComponent(sp.Skeleton);
 *
 * let path = "https://bc-test1.oss-cn-shenzhen.aliyuncs.com/image/action";
 * let name = "nnoh_v4";
 * skeleton.loadRemoteSkeleton({view : this , path : path, name : name, complete : (data:sp.SkeletonData)=>{
 *    if (data) {
 *        skeleton.animation = 'loop';
 *        skeleton.premultipliedAlpha = false;
 *    }
 * }});
 */

sp.Skeleton.prototype.loadRemoteSkeleton = function (config) {
    let me = this;
    if (config.isNeedCache == undefined || config.isNeedCache == null) {
        config.isNeedCache = true;
    }
    App.asset.remote.loadSkeleton(config.path, config.name, config.isNeedCache).then((data) => {
        setSkeletonSkeletonData(me, config, data, Resource.Type.Remote);
    });
}

/**
 * @description 加载动画
 * @example
 * action.loadSkeleton({url:"hall/vip/vipAction/vip_10",view:this,complete:(data)=>{
 *	if ( data ){
 *		action.animation = "loop";
 *		action.loop = true;
 *		action.premultipliedAlpha = false;
 *	}
 * }});
 */
sp.Skeleton.prototype.loadSkeleton = function (config) {
    let me = this;
    let url = config.url;
    let bundle = getBundle(config);
    App.cache.getCacheByAsync(url, sp.SkeletonData,bundle).then((data) => {
        setSkeletonSkeletonData(me, config, data);
    });
}

/**
 * @description 加载按钮
 * @example
 * let button = cc.find("button",this.node);
 * button.getComponent(cc.Button).loadButton({normalSprite : "hall/a",view:this});
 * button.getComponent(cc.Button).loadButton({normalSprite : "hall/b",pressedSprite : "hall/c",view:this});
 */
cc.Button.prototype.loadButton = function (config) {
    setButtonSpriteFrame(this, config);
}

/**
 * @description 加载龙骨动画
 */
dragonBones.ArmatureDisplay.prototype.loadDisplay = function(config) {
    loadDragonDisplay(this,config);
}

/**
 * @description 加载特效文件 view 为null时，加载之前不会释
 * @example
 * let node = new cc.Node();
 * let par = node.addComponent(cc.ParticleSystem);
 * par.loadFile({url:GAME_RES( "res/action/DDZ_win_lizi" ),view:null});
 * this.node.addChild(node);
 */
cc.ParticleSystem.prototype.loadFile = function (config) {
    let me = this;
    let url = config.url;
    let bundle = getBundle(config);
    App.cache.getCacheByAsync(url, cc.ParticleAsset,bundle).then((data) => {
        setParticleSystemFile(me, config, data);
    });
}

cc.Label.prototype.forceDoLayout = function () {
    //2.2.0
    if (this._forceUpdateRenderData) {
        this._forceUpdateRenderData();
    }
    //2.2.0以下版本
    else if (this._updateRenderData) {
        this._updateRenderData(true);
    }
}

/**
 * @description 加载字体
 * @example
 * let content = cc.find("content",this.node); 
 * content.getComponent(cc.Label).loadFont({font:roomPath + dfFont,view:this});
 */
 cc.Label.prototype.loadFont = function (config) {
    let font = config.font;
    let me = this;
    let bundle = getBundle(config);
    App.cache.getCacheByAsync(font, cc.Font,bundle).then((data) => {
        setLabelFont(me, config, data);
    });
}

/**@description 通过预置体路径创建节点 
 * @param config 配置信息
 * @param config.url 预置体路径
 * @param config.view 预置视图资源管理器，继承自UIView
 * @param config.complete 创建完成回调 
 * @example 
 * cc.createPrefab({url :GAME_RES("res/animations/shzDealerCommon"),view:this,complete:(node)=>{
 *     if ( node ){
 *         // to do 
 *     }
 * }});
 */
window.createPrefab = function (config:any) {
    createNodeWithPrefab(config);
}

/**
 * @description 扩展一个在界面中加载指定目录的接口
 * @param config 配置信息
 * @param config.url 资源路径
 * @param config.view 资源持有者,继承自UIView
 * @param config.onComplete 加载完成回调 data为ResourceCacheData，用之前先判断当前返回的data.data是否是数组
 * @param config.onProgress 加载进度
 * @param config.bundle 可不填，默认为view指向的bundle
 * @param config.type 加载的资源类型
 * */
window.loadDirRes = function (config:any) {
    _loadDirRes(config)
}

/**
 * @description 扩展一个在界面加载指定资源接口
 * @param config 配置信息
 * @param config.bundle 可不填，默认为view指向的bundle
 * @param config.url 资源路径
 * @param config.type 加载的资源类型
 * @param config.onProgress 加载进度
 * @param config.onComplete 加载完成回调 data为ResourceCacheData
 * @param config.view 资源持有者,继承自UIView
 */
window.loadRes = function (config:any) {
    _loadRes(config);
}

/**
 * @description 强制节点在当前帧进行一次布局 
 * @example
 * cc.updateAlignment(this.node);
 * */
cc.updateAlignment = function (node) {
    if (node) {
        //强制当前节点进行本帧强制布局
        let backcc : any = cc;
        if (backcc._widgetManager) {
            backcc._widgetManager.updateAlignment(node);
        } else {
            if (CC_DEBUG) Log.e(this._logTag, `引擎变化,原始引擎版本2.1.2，找不到cc._widgetManager`);
        }
    }
}

if( !cc.randomRangeInt ){
    cc.randomRangeInt = function ( min , max){
        let value = (max- min) * Math.random() + min;
        let result = Math.floor(value);
        return result;
    }
}

if( !cc.randomRange ){
    cc.randomRange = function ( min , max){
        let value = (max- min) * Math.random() + min;
        return value;
    }
}

(cc.Tween as any).getfinalAction = function(tween:any){
    return tween._finalAction;
}

export function CocosExtentionInit() {
    if (CC_EDITOR) {
        Log.d("Cocos扩展初始化");
    }
}
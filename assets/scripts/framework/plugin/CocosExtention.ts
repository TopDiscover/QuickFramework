import WebEditBoxImpl from "./WebEditBoxImpl";
import {
    addExtraLoadResource, setSpriteSpriteFrame, setButtonSpriteFrame,
    setParticleSystemFile, setLabelFont, setSkeletonSkeletonData,
    createNodeWithPrefab,getBundle,_loadDirRes,_loadRes
} from "./Utils";
import { Resource } from "../core/asset/Resource";
import { Macro } from "../defines/Macros";
import { Sprite , Node, isValid , SpriteFrame, sp, Button, Label, Font, ParticleSystem2D , ParticleAsset, EditBox, AssetManager, Asset } from "cc";
import { EDITOR } from "cc/env";

/**@description 对cc.Node 扩展一个临时存储的用户自定义数据 */
if (typeof Reflect == "object") {
    //在浏览器中已经有反射
    Reflect.defineProperty(Node.prototype, "userData", {
        value: null,
        writable: true,
    });
} else {
    Node.prototype.userData = null;
}

Reflect.defineProperty(Node.prototype, "zIndex", {
    get: function () {
        let self : any = this;
        if( typeof self._zIndex =="number"){
            return self._zIndex;
        }
        else{
            self._zIndex = 0;
            return self._zIndex;
        }
    },
    set: function (v) {
        let self: any = this;
        self._zIndex = v;
    }
});

/**
 * @description 从网络加载图片，推荐使用第二种方式
 * @param url 网络地址，如 : http://tools.itharbors.com/res/logo.png
 * @param completeCallback 加载完成回调
 * @param defaultSpriteFrame 加载图片失败后，使用的默认图片,当传入string时，会动态加载该默认图片
 * @param isNeedCache 是否需要缓存到本地,如果不需要，每次都会从网络拉取资源,默认都会缓存到本地
 * @param config.retain 远程加载的资源是否驻留在内存中,默认都不驻留内存
 * @example
 * 示例1：
 * let sprite = imageNode.getComponent(cc.Sprite);
 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", defaultSpriteFrame : HALL("textures/avatar_default_0.png"), view : this,completeCallback : (data)=>{
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

//config : {url: string, view : any , completeCallback?: (data: cc.SpriteFrame) => void, defaultSpriteFrame?: string , isNeedCache ?: boolean }
let prototype:any = Sprite.prototype;
prototype.loadRemoteImage = function (config: any) {
    let me = this;
    if (config.isNeedCache == undefined || config.isNeedCache == null) {
        config.isNeedCache = true;
    }
    let isRetain = false;
    if (config.retain) {
        isRetain = true;
    }
    let defaultBundle = getBundle({ bundle: config.defaultBundle, view: config.view })
    Manager.assetManager.remote.loadImage(config.url, config.isNeedCache).then((data) => {
        if (data) {
            setSpriteSpriteFrame(config.view, config.url, me, data, config.completeCallback, Macro.BUNDLE_REMOTE, Resource.Type.Remote, isRetain);
        } else {
            if (config.defaultSpriteFrame) {
                if (typeof config.defaultSpriteFrame == "string") {
                    //动态加载了一张图片，把资源通知管理器
                    Manager.cacheManager.getCacheByAsync(config.defaultSpriteFrame, SpriteFrame, defaultBundle).then((spriteFrame) => {
                        setSpriteSpriteFrame(config.view, config.defaultSpriteFrame, me, spriteFrame, config.completeCallback, defaultBundle);
                    });
                }
            }
            if (config.completeCallback && isValid(me)) config.completeCallback(data);
        }
    });
};

/**
 * @description 加载本地图片
 * @param url 图片路径 {urls:string[],key:string} urls 为纹理名如果有此纹理会打包成多张，此时需要传入所有纹理的地址，key指纹理中名字
 * @param view 所属视图，UIView的子类
 * @param completeCallback 完成回调
 * @example
 * 示例1：
 * sprite.getComponent(cc.Sprite).loadImage({url:{urls:["plist/fish_30","plist/fish_30_1","plist/fish_30_2"],key:"fishMove_030_28"},view:this});
 * 示例2：
 * sprite.getComponent(cc.Sprite).loadImage({url:"hall/a",view:this});
 */
//loadImage( config : { url : string | {urls:string[],key:string} , view : any , completeCallback?:(data : SpriteFrame)=>void});
prototype.loadImage = function (config: any) {

    let me = this;
    let view = config.view;
    let url = config.url;
    let completeCallback = config.completeCallback;
    let bundle = getBundle(config);
    if (typeof url == "string") {
        Manager.cacheManager.getCacheByAsync(url, SpriteFrame, bundle).then((spriteFrame) => {
            setSpriteSpriteFrame(view, url, me, spriteFrame, completeCallback, bundle);
        });
    } else {
        //在纹理图集中查找
        Manager.cacheManager.getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource, bundle).then((data) => {
            if (data && data.isTryReload) {
                //来到这里面程序已经崩溃了，无意义在处理了
            } else {
                setSpriteSpriteFrame(view, data.url, me, data.spriteFrame as SpriteFrame, completeCallback, bundle, Resource.Type.Local, false, true);
            }
        });
    }
}

/**
 * @description 扩展方法
 * @param remotePath 远程资源路径
 * @param name 远程Spine文件名，不再后缀
 * @param completeCallback 完成回调
 * @param isNeedCache 是否需要缓存到本地,如果不需要，每次都会从网络拉取资源,默认都会缓存到本地
 * @param config.retain 远程加载的资源是否驻留在内存中,默认都不驻留内存
 * @example
 * var skeleton = node.addComponent(sp.Skeleton);
 *
 * let path = "https://bc-test1.oss-cn-shenzhen.aliyuncs.com/image/action";
 * let name = "nnoh_v4";
 * skeleton.loadRemoteSkeleton({view : this , path : path, name : name, completeCallback : (data:sp.SkeletonData)=>{
 *    if (data) {
 *        skeleton.animation = 'loop';
 *        skeleton.premultipliedAlpha = false;
 *    }
 * }});
 */

prototype = sp.Skeleton.prototype;
prototype.loadRemoteSkeleton = function (config: any) {
    let me = this;
    if (config.isNeedCache == undefined || config.isNeedCache == null) {
        config.isNeedCache = true;
    }
    Manager.assetManager.remote.loadSkeleton(config.path, config.name, config.isNeedCache).then((data) => {
        setSkeletonSkeletonData(me, config, data as sp.SkeletonData, Resource.Type.Remote);
    });
}

/**
 * @description 加载动画
 * @example
 * action.loadSkeleton({url:"hall/vip/vipAction/vip_10",view:this,completeCallback:(data)=>{
 *	if ( data ){
 *		action.animation = "loop";
 *		action.loop = true;
 *		action.premultipliedAlpha = false;
 *	}
 * }});
 */
prototype.loadSkeleton = function (config: any) {
    let me = this;
    let url = config.url;
    let bundle = getBundle(config);
    Manager.cacheManager.getCacheByAsync(url, sp.SkeletonData, bundle).then((data) => {
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
prototype = Button.prototype;
prototype.loadButton = function (config: any) {
    setButtonSpriteFrame(this, config);
}

/**
 * @description 加载字体
 * @example
 * let content = cc.find("content",this.node); 
 * content.getComponent(cc.Label).loadFont({font:roomPath + dfFont,view:this});
 */
prototype = Label.prototype;
prototype.loadFont = function (config: any) {
    let font = config.font;
    let me = this;
    let bundle = getBundle(config);
    Manager.cacheManager.getCacheByAsync(font, Font, bundle).then((data) => {
        setLabelFont(me, config, data);
    });
}

/**@description 强制label在当前帧进行绘制 */
prototype.forceDoLayout = function () {
    //2.2.0
    if (this._forceUpdateRenderData) {
        this._forceUpdateRenderData();
    }
    //2.2.0以下版本
    else if (this._updateRenderData) {
        this._updateRenderData(true);
    }
}


Reflect.defineProperty(Label.prototype, "language", {
    get: function () {
        return (<any>this)._language;
    },
    set: function (v) {
        //该游戏允许在游戏中进行语言包切换,当设置的值为 null | [] 时，清除language的事件绑定
        let self: any = this;
        let updateLanguage = (v: any, cb: any) => {
            if (v && ((Array.isArray(v) && v.length > 0) || !!v)) {
                let value: any = null;
                if (Array.isArray(v)) {
                    value = v;
                } else {
                    value = [v];
                }
                cb && cb(true);
                self._language = [].concat(value);
                self.string = Manager.language.get(value);
            } else {
                cb && cb(false);
                self._language = null;
                self.string = "";
            }
        }
        if (Macro.ENABLE_CHANGE_LANGUAGE) {
            updateLanguage(v, (isUsing: boolean) => {
                if (isUsing) {
                    if (!!!self._isUsinglanguage) {
                        self._isUsinglanguage = true;
                        Manager.eventDispatcher.addEventListener(Macro.CHANGE_LANGUAGE, self._onChangeLanguage, self);
                    }
                } else {
                    if (self._language) {
                        Manager.eventDispatcher.removeEventListener(Macro.CHANGE_LANGUAGE, self);
                    }
                }
            })
        } else {
            updateLanguage(v, null);
        }
    }
});

prototype = Label.prototype;
if (!EDITOR && Macro.ENABLE_CHANGE_LANGUAGE) {
    prototype._onChangeLanguage = function () {
        this.language = this.language;
    }

    let __label_onDestroy__ = prototype.onDestroy;
    prototype.onDestroy = function () {
        if (this._isUsinglanguage) {
            Manager.eventDispatcher.removeEventListener(Macro.CHANGE_LANGUAGE, this);
        }
        __label_onDestroy__ && __label_onDestroy__.call(this);
    }

    let __label_onLoad__ = prototype.onLoad;
    prototype.onLoad = function () {
        if (this.string.indexOf(Macro.USING_LAN_KEY) > -1) {
            this.language = [this.string];
        }
        __label_onLoad__ && __label_onLoad__.call(this);
    }

}


/**
 * @description 加载特效文件 view 为null时，加载之前不会释
 * @example
 * let node = new cc.Node();
 * let par = node.addComponent(cc.ParticleSystem);
 * par.loadFile({url:GAME_RES( "res/action/DDZ_win_lizi" ),view:null});
 * this.node.addChild(node);
 */
prototype = ParticleSystem2D.prototype;
prototype.loadFile = function (config: any) {
    let me = this;
    let url = config.url;
    let bundle = getBundle(config);
    Manager.cacheManager.getCacheByAsync(url, ParticleAsset, bundle).then((data) => {
        setParticleSystemFile(me, config, data);
    });
}

//全局函数扩展


let _window:any = window;
let _cc = _window["cc"];
/**@description 通过预置体路径创建节点 
 * @param config 配置信息
 * @param config.url 预置体路径
 * @param config.view 预置视图资源管理器，继承自UIView
 * @param config.completeCallback 创建完成回调 
 * @example 
 * cc.createPrefab({url :GAME_RES("res/animations/shzDealerCommon"),view:this,completeCallback:(node)=>{
 *     if ( node ){
 *         // to do 
 *     }
 * }});
 */
_cc.createPrefab = function (config: any) {
    createNodeWithPrefab(config);
}
/**@description 通过预置体路径创建节点 请使用全局的导入
 	 * @param config 配置信息
 	 * @param config.url 预置体路径
	 * @param config.view 预置视图资源管理器，继承自UIView
	 * @param config.completeCallback 创建完成回调 
	 * @param config.bundle 可不填，默认为打开UIView时指向的Bundle
	 * @example 
	 * createPrefab({url :GAME_RES("res/animations/shzDealerCommon"),view:this,completeCallback:(node)=>{
	 *     if ( node ){
	 *         // to do 
	 *     }
	 * }});
	 */
export function createPrefab(config: { 
    url: string, 
    view: UIView, 
    completeCallback: (node: Node) => void ,
    bundle?:BUNDLE_TYPE}):void{
    _cc.createPrefab(config);
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
 _cc.loadDirRes = function (config:any) {
    _loadDirRes(config)
}
/**
* @description 扩展一个在界面中加载指定目录的接口 请使用全局的导入
* @param config 配置信息
* @param config.url 资源路径
* @param config.view 资源持有者,继承自UIView
* @param config.onComplete 加载完成回调 data为ResourceCacheData，用之前先判断当前返回的data.data是否是数组
* @param config.onProgress 加载进度
* @param config.bundle 可不填，默认为view指向的bundle
* @param config.type 加载的资源类型
* */
export function loadDirRes( config:{ 
    bundle?:BUNDLE_TYPE,
    url : string , 
    type : typeof Asset, 
    view : any, 
    onProgress?:(finish:number,total:number,item:AssetManager.RequestItem) => void , 
    onComplete:(data:Resource.CacheData)=>void
    }):void{
    _cc.loadDirRes(config);  
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
_cc.loadRes = function (config:any) {
    _loadRes(config);
}
/**
* @description 扩展一个在界面加载指定资源接口 请使用全局的导入
* @param config 配置信息
* @param config.bundle 可不填，默认为view指向的bundle
* @param config.url 资源路径
* @param config.type 加载的资源类型
* @param config.onProgress 加载进度
* @param config.onComplete 加载完成回调 data为ResourceCacheData
* @param config.view 资源持有者,继承自UIView
*/
export function loadRes( config:{
    bundle?: BUNDLE_TYPE,
    url: string,
    type: typeof Asset,
    onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void,
    onComplete: (data:any) => void,
    view : any
 }):void{
    _cc.loadRes(config);
 }

 /**@description 临时的替换方案，效率太底 */
_cc.updateZIndex = function (node : Node) {
    if( node.children.length > 1 ){
        node.children.sort((a,b)=>{
            return a.zIndex - b.zIndex;
        });
        node._updateSiblingIndex();
    }
}
 /**@description 临时的替换方案，效率太底 */
export function updateZIndex( node : Node ){
    _cc.updateZIndex(node);
}

export function CocosExtentionInit() {
    if (!EDITOR) {
        //对引擎输入框进行修改 
        if (Manager.adaptor.isBrowser) {
            (<any>EditBox)._EditBoxImpl = WebEditBoxImpl;
        }
        Log.d("Cocos扩展初始化");
    }
}

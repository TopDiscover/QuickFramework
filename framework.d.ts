declare type UIView = import("./assets/scripts/framework/core/ui/UIView").default;
declare module cc {
	export function dump(...args);
	//相当于console.info //引擎已经设置为只读，没办法在取一个一样的名字
	export function message(...args);

	/**@description 相当于console.time */
	export function time(...args);

	/**@description 相当于console.timeEnd */
	export function timeEnd(...args);

	export interface Node {
		/**@description 用户自定义数据 */
		userData: any;
	}

	/**
	 * @description 通过预置体路径创建节点 
	 * @param config 配置信息
	 * @param config.url 预置体路径
	 * @param config.view 预置视图资源管理器，继承自UIView
	 * @param config.completeCallback 创建完成回调 
	 * @param config.bundle 可不填，默认为打开UIView时指向的Bundle
	 * @example 
	 * cc.createPrefab({url :GAME_RES("res/animations/shzDealerCommon"),view:this,completeCallback:(node)=>{
	 *     if ( node ){
	 *         // to do 
	 *     }
	 * }});
	 **/
	export function createPrefab(config: { url: string, view: UIView, completeCallback: (node: cc.Node) => void, bundle?: BUNDLE_TYPE });

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
	export function loadDir(config: {
		bundle?: BUNDLE_TYPE,
		url: string,
		type: typeof cc.Asset,
		view: UIView,
		onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
		onComplete: (data: td.Resource.CacheData) => void
	});

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
	export function load(config: {
		bundle?: BUNDLE_TYPE,
		url: string,
		type: typeof cc.Asset,
		onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void,
		onComplete: (data: td.Resource.CacheData) => void,
		view: UIView,
	});

	export interface Sprite {
		/**
		 * @description 从网络加载图片，推荐使用第二种方式
		 * @param url 网络地址，如 : http://tools.itharbors.com/res/logo.png
		 * @param completeCallback 加载完成回调
		 * @param defaultSpriteFrame 加载图片失败后，使用的默认图片,当传入string时，会动态加载该默认图片
		 * @param defaultBundle 若指定了defaultSpriteFrame，不指定defaultBundle ,优先使用view.bundle,否则则为resources目录
		 * @param isNeedCache 是否需要缓存到本地,如果不需要，每次都会从网络拉取资源,默认都会缓存到本地
		 * @param config.retain 远程加载的资源是否驻留在内存中,默认都不驻留内存
		 * @example
		 * 示例1：
		 * let sprite = imageNode.getComponent(cc.Sprite);
		 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", defaultSpriteFrame : HALL("avatar_default_0.png"), view : this,completeCallback : (data)=>{
		 * 		if ( data ) { do something }
		 * }});
		 * 
		 * 示例2:
		 * let sprite = imageNode.getComponent(cc.Sprite);
		 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", defaultSpriteFrame : HALL("avatar_default_0.png"), view : this});
		 * 
		 * 示例3：
		 * let sprite = imageNode.getComponent(cc.Sprite);
		 * sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", view : this});
		 * }
		 */
		loadRemoteImage(config: {
			url: string,
			view: UIView,
			completeCallback?: (data: cc.SpriteFrame) => void,
			defaultSpriteFrame?: string,
			defaultBundle?: BUNDLE_TYPE,
			isNeedCache?: boolean,
			retain?: boolean
		});

		/**
		 * @description 加载本地图片
		 * @param url 图片路径 {urls:string[],key:string} urls 为纹理名如果有此纹理会打包成多张，此时需要传入所有纹理的地址，key指纹理中名字
		 * @param view 所属视图，UIView的子类
		 * @param completeCallback 完成回调
		 * @param config.bundle 可不填，默认为打开UIView时指向的Bundle
		 * @example
		 * 示例1：
		 * sprite.getComponent(cc.Sprite).loadImage({url:{urls:["plist/fish_30","plist/fish_30_1","plist/fish_30_2"],key:"fishMove_030_28"},view:this});
		 * 示例2：
		 * sprite.getComponent(cc.Sprite).loadImage({url:"hall/a",view:this});
		 */
		loadImage(config: {
			url: string | { urls: string[], key: string },
			view: UIView,
			completeCallback?: (data: SpriteFrame) => void,
			bundle?: BUNDLE_TYPE
		});
	}

	export interface Button {
		/**
		 * @description 加载按钮
		 * @param config.bundle 可不填，默认为打开UIView时指向的Bundle
		 * @example
		 * 示例1：
		 * let button = cc.find("button",this.node);
		 * button.getComponent(cc.Button).loadButton({normalSprite : "hall/a",view:this});
		 * button.getComponent(cc.Button).loadButton({normalSprite : "hall/b",pressedSprite : "hall/c",view:this});
		 * 示例2：
		 * button.getComponent(cc.Button).loadButton({view:this,
		 *	normalSprite:{urls:["gameComm/chipsetting/chipInfo"],key:"chip0_1"},
		 *	pressedSprite:{urls:["gameComm/chipsetting/chipInfo"],key:"chip0_2"},
		 *	hoverSprite : {urls:["gameComm/chipsetting/chipInfo"],key:"chip1_1"},
		 *	disabledSprite : {urls:["gameComm/chipsetting/chipInfo"],key:"chip1_2"},
		 * }); 
		 * completeCallback.type => ButtonSpriteFrameType
		 */
		loadButton(config: {
			normalSprite?: string | { urls: string[], key: string },
			view: UIView,//UIView的子类
			pressedSprite?: string | { urls: string[], key: string },
			hoverSprite?: string | { urls: string[], key: string },
			disabledSprite?: string | { urls: string[], key: string },
			completeCallback?: (type: string, spriteFrame: SpriteFrame) => void,
			bundle?: BUNDLE_TYPE
		});
	}

	export interface Label {
		/**
		  * @description 加载字体
		  * @param config.bundle 可不填，默认为打开UIView时指向的Bundle
		  * @example
		  * let content = cc.find("content",this.node); 
		  * content.getComponent(cc.Label).loadFont({font:"font/DFYUANW7-GB2312",view:this});
		  */
		loadFont(config: { font: string, view: UIView, completeCallback?: (font: Font) => void, bundle?: BUNDLE_TYPE });

		/**@description 强制label在当前帧进行绘制 */
		forceDoLayout();

		/**
		 * @description 设置语言包路径,假设语言包为
		 * @example 示例
		 * export let i18n = {
		 * language : cc.sys.LANGUAGE_CHINESE,
		 * tips : "您好",
		 * test : "测试 : {0}-->{1}-->{2}"
		 * }
		 * node.getComponent(cc.Label).language = "i18n.tips"; //string显示为：您好
		 * node.getComponent(cc.Label).language = ["i18n.tips"];//string显示为：您好
		 * node.getComponent(cc.Label).language = ["i18n.test",100,200,300];//string显示为：100-->200-->300
		 * node.getConponent(cc.Label).language = null;//清除语言路径信息,如果在不需要使用语言包路径时，使用赋值空清除
		 * */
		language: (string | number)[] | string;
	}


	/**
	   * @description 强制节点在当前帧进行一次布局 
	   * @example
	 * cc.updateAlignment(this.node);
	 * */
	export function updateAlignment(node: cc.Node): void;

	export interface ParticleSystem {

		/**
			 * @description 加载特效文件 view 为null时，加载之前不会释
		 * @param config.bundle 可不填，默认为打开UIView时指向的Bundle
		 * @example
		 * let node = new cc.Node();
		 * let par = node.addComponent(cc.ParticleSystem);
		 * par.loadFile({url:GAME_RES( "res/action/DDZ_win_lizi" ),view:null});
		 * this.node.addChild(node);
		 */
		loadFile(config: { url: string, view: UIView, completeCallback?: (file: ParticleAsset) => void, bundle?: BUNDLE_TYPE });

	}
}

declare namespace sp {
	export interface Skeleton {
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
		loadRemoteSkeleton(config: {
			view: UIView,
			path: string,
			name: string,
			completeCallback: (data: sp.SkeletonData) => void,
			isNeedCache?: boolean,
			retain?: boolean
		});

		/**
		 * @description 加载动画
		 * @param config.bundle 可不填，默认为打开UIView时指向的Bundle
		 * @example
		 * action.loadSkeleton({url:"hall/vip/vipAction/vip_10",view:this,completeCallback:(data)=>{
		 *	if ( data ){
		 *		action.animation = "loop";
		 *		action.loop = true;
		 *		action.premultipliedAlpha = false;
		 *	}
		 * }});
		 */
		loadSkeleton(config: { url: string, view: UIView, completeCallback: (data: sp.SkeletonData) => void, bundle?: BUNDLE_TYPE });
	}
}

declare type BUNDLE_TYPE = string | cc.AssetManager.Bundle;

declare function require(any);

/**
 * @description 发事件 参考framework/extentions/extentions dispatch 方法
 * @param name 
 * @param data 
 */
declare function dispatch(name: string, data?: any): void;

declare interface Date {
	/**
	 * @description 格式当前时间 
	 * @example 
	 * let now = new Date();
	 * let str = now.format("yyyy:MM:dd hh:mm:ss"); //2019:11:07 10:19:51
	 * str = now.format("yyyy/MM/dd");//2019/11/07
	 * str = now.format("hh:mm:ss");//10:19:51
	 * */
	format(format: string): string;
}

declare interface DateConstructor {
	/**
	 * @description 返回当前时间的秒数
	 * @example 
	 * Date.timeNow()
	 *  */
	timeNow(): number;
	/**
	 * @description 返回当前时间的毫秒数 
	 * @example 
	 * Date.timeNowMillisecons()
	 * */
	timeNowMillisecons(): number;
}

declare interface StringConstructor {
	/**
	 * @description 格式化字符串
	 * @example
	 * String.format("{0}-->{1}-->{2}","one","two","three") | String.format("{0}-->{1}-->{2}",["one","two","three"])
	 * => "one-->two-->three"
	 * */
	format(...args: any[]): string;
}

declare function md5(data: any): any;

/**@description utf-8 Uint8Array转字符串 */
declare function Utf8ArrayToString(data: Uint8Array): string;
/**@description utf-8 字符串转Uint8Array */
declare function StringToUtf8Array(data: string): Uint8Array;

declare interface IFullScreenAdapt {
	/**@description 全屏幕适配 调用 */
	onFullScreenAdapt(): void;
}

/**@description 提示弹出框配置 */
declare interface AlertConfig {
	/**@description 用来标识弹出框，后面可指定tag进行关闭所有相同tag的弹出框 */
	tag?: string | number,
	/**@description 提示内容 richText只能二先1 */
	text?: string,
	/**@description 标题,默认为 : 温馨提示 */
	title?: string,
	/**@description 确定按钮文字 默认为 : 确定*/
	confirmString?: string,
	/**@description 取消按钮文字 默认为 : 取消*/
	cancelString?: string,
	/**@description 确定按钮回调 有回调则显示按钮，无回调则不显示*/
	confirmCb?: (isOK: boolean) => void,
	/**@description 取消按钮回调 有回调则显示按钮，无回调则不显示*/
	cancelCb?: (isOK: boolean) => void,
	/**@description 富文件显示内容 跟text只能二选1 */
	richText?: string,
	/**@description true 回调后在关闭弹出 false 关闭弹出框在回调 默认为 : false */
	immediatelyCallback?: boolean,
	/**@description 是否允许该tag的弹出框重复弹出，默认为true 会弹出同类型的多个 */
	isRepeat?: boolean,
	/**@description 用户自定义数据 */
	userData?: any,
}

/**
 * @description 处理游戏事件接口声明
 * cc.game.EVENT_ENGINE_INITED
 * cc.game.EVENT_GAME_INITED
 * cc.game.EVENT_HIDE
 * cc.game.EVENT_RESTART
 * cc.game.EVENT_SHOW
 **/
declare interface GameEventInterface {

	/**@description 进入后台 cc.game.EVENT_HIDE*/
	onEnterBackground(): void;

	/**
	 * @description 进入前台 cc.game.EVENT_SHOW
	 * @param inBackgroundTime 在后台运行的总时间，单位秒
	 */
	onEnterForgeground(inBackgroundTime: number): void;
}

declare interface Singleton<T> {
	new(): T;
	/**
	 *@description 单例统一实现 
	 */
	Instance(): T;
}

/**@description 获取根据类型获取单列 */
declare function getSingleton<T>(SingletonClass: Singleton<T>): T;

declare interface UIClass<T extends UIView> {
	new(): T;
	/**
	 *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer 
	 */
	getPrefabUrl(): string;
}
declare type Entry = import("./assets/scripts/framework/core/entry/Entry").Entry;
declare interface EntryClass<T extends Entry>{
	new():T;
	/**@description 当前bundle名 */
    bundle : string;
	/**@description 主入口,即主包，主入口只能有一个 */
    isMain : boolean;
};
declare type EntryDelegate = import("./assets/scripts/framework/core/entry/EntryDelegate").EntryDelegate;
declare type Message = import("./assets/scripts/framework/core/net/message/Message").Message;
declare type Service = import("./assets/scripts/framework/core/net/service/Service").Service;
/**@description 语言包相关 */
declare namespace Language {
	export interface Data {
		language: string;
	}
	/** 
	 * @description 数据代理
	 * 如果是公共总合，name使用 td.COMMON_LANGUAGE_NAME
	 **/
	export interface DataSourceDelegate {
		name: string;
		data(language: string): Data;
	}
}

declare let Manager: import("./assets/Application")._Manager;
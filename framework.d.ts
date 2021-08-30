
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
	export function createPrefab(config: { url: string, view: import("./assets/scripts/framework/core/ui/UIView").UIView, completeCallback: (node: cc.Node) => void, bundle?: BUNDLE_TYPE });

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
		view: import("./assets/scripts/framework/core/ui/UIView").UIView,
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
		view: import("./assets/scripts/framework/core/ui/UIView").UIView,
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
			view: import("./assets/scripts/framework/core/ui/UIView").UIView,
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
			view: import("./assets/scripts/framework/core/ui/UIView").UIView,
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
			view: import("./assets/scripts/framework/core/ui/UIView").UIView,//UIView的子类
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
		loadFont(config: { font: string, view: import("./assets/scripts/framework/core/ui/UIView").UIView, completeCallback?: (font: Font) => void, bundle?: BUNDLE_TYPE });

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
		loadFile(config: { url: string, view: import("./assets/scripts/framework/core/ui/UIView").UIView, completeCallback?: (file: ParticleAsset) => void, bundle?: BUNDLE_TYPE });

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
			view: import("./assets/scripts/framework/core/ui/UIView").UIView,
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
		loadSkeleton(config: { url: string, view: import("./assets/scripts/framework/core/ui/UIView").UIView, completeCallback: (data: sp.SkeletonData) => void, bundle?: BUNDLE_TYPE });
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
 *      cc.game.EVENT_ENGINE_INITED
		cc.game.EVENT_GAME_INITED
		cc.game.EVENT_HIDE
		cc.game.EVENT_RESTART
		cc.game.EVENT_SHOW
 */

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
/**@description 创建命名空间并返回 默认为td */
declare function createNamespace(namespace?: string): any;
/**@description 设置值到该命名空间下，默认为td */
declare function toNamespace(key: string, value: any, namespace?: string): void;
/**
 * @description 专用进入完成Logic事件LogicEvent.ENTER_COMPLETE
 * @param data 数据
 */
declare function dispatchEnterComplete(data: td.Logic.EventData): void;

declare namespace td {

	/**@description 语言包相关 */
	namespace Language {
		interface Data {
			language: string;
		}
		/** 
		 * @description 数据代理
		 * 如果是公共总合，name使用 td.COMMON_LANGUAGE_NAME
		 **/
		interface DataSourceDelegate {
			name: string;
			data(language: string): Data;
		}
		/**@description 语言变更 */
		export const CHANGE_LANGUAGE = "Event_CHANGE_LANGUAGE";
	}

	/**@description 替换按钮纹理类型 */
	enum ButtonSpriteType {
		Norml = "normalSprite",
		Pressed = "pressedSprite",
		Hover = "hoverSprite",
		Disable = "disabledSprite",
	}

	/**@description 热更新相关 */
	namespace HotUpdate {
		interface Manifest {
			/**@description 大厅版本 */
			version?: string,
			/**@description 子游戏版本 大厅的manifest不包含该字段 */
			subVersion?: string,
			/**@description 资源服务器地址 */
			packageUrl?: string,
			/**@description 远程project.manifest地址 */
			remoteManifestUrl?: string,
			/**@description 远程version.manifest地址 */
			remoteVersionUrl?: string,
			/**@description 包含资源 */
			assets?: any,
			searchPaths?: any
		}

		/**@description 下载信息 */
		interface DownLoadInfo {
			/**@description 下载当前数据大小 */
			downloadedBytes: number,
			/**@description 下载数据总大小 */
			totalBytes: number,
			/**@description 当前下载文件数量 */
			downloadedFiles: number,
			/**@description 当前下载的总文件数量 */
			totalFiles: number,
			/**@description 下载总进入 */
			percent: number,
			/**@description 下载当前文件的进度 */
			percentByFile: number,
			/**@description 下载Code */
			code: Code,
			/**@description 下载State */
			state: State,
			/**@description 是否需要重启 */
			needRestart: boolean
		}
		/**@description 提示下载弹出框事件数据 */
		interface MessageData {
			state: State;
			/**@description 下载的bundle */
			bundle: string;
			/**@description 下载的bundle名，如大厅 */
			name: string;
			/**@description 是否点击了确定按钮 true为下载 */
			isOk: boolean;
		}

		/**@description 下载事件 */
		export enum Event {
			/**@description 热更新事件*/
			HOTUPDATE_DOWNLOAD = "HOTUPDATE_DOWNLOAD",
			/**@description 下载进度 */
			DOWNLOAD_PROGRESS = "DOWNLOAD_PROGRESS",
			/**@description 提示下载弹出框事件 */
			DOWNLOAD_MESSAGE = "DOWNLOAD_MESSAGE",
		}
		export enum Code {
			/**@description 找不到本地mainfest文件*/
			ERROR_NO_LOCAL_MANIFEST,
			/**@description 下载manifest文件错误 */
			ERROR_DOWNLOAD_MANIFEST,
			/**@description 解析manifest文件错误 */
			ERROR_PARSE_MANIFEST,
			/**@description 找到新版本 */
			NEW_VERSION_FOUND,
			/**@description 当前已经是最新版本 */
			ALREADY_UP_TO_DATE,
			/**@description 更新下载进度中 */
			UPDATE_PROGRESSION,
			/**@description 资源更新中 */
			ASSET_UPDATED,
			/**@description 更新错误 */
			ERROR_UPDATING,
			/**@description 更新完成 */
			UPDATE_FINISHED,
			/**@description 更新失败 */
			UPDATE_FAILED,
			/**@description 解压资源失败 */
			ERROR_DECOMPRESS,

			//以下是js中扩展的字段，上面是引擎中已经有的字段
			/**@description 正检测更新中 */
			CHECKING,
		}
		export enum State {
			/**@description 未初始化 */
			UNINITED,
			/**@description 找到manifest文件 */
			UNCHECKED,
			/**@description 准备下载版本文件 */
			PREDOWNLOAD_VERSION,
			/**@description 下载版本文件中 */
			DOWNLOADING_VERSION,
			/**@description 版本文件下载完成 */
			VERSION_LOADED,
			/**@description 准备加载project.manifest文件 */
			PREDOWNLOAD_MANIFEST,
			/**@description 下载project.manifest文件中 */
			DOWNLOADING_MANIFEST,
			/**@description 下载project.manifest文件完成 */
			MANIFEST_LOADED,
			/**@description 需要下载更新 */
			NEED_UPDATE,
			/**@description 准备更新 */
			READY_TO_UPDATE,
			/**@description 更新中 */
			UPDATING,
			/**@description 解压中 */
			UNZIPPING,
			/**@description 已经是最新版本 */
			UP_TO_DATE,
			/**@description 更新失败 */
			FAIL_TO_UPDATE,

			/**自定定义扩展 */
			/**@description 尝试重新下载失败文件 */
			TRY_DOWNLOAD_FAILED_ASSETS,
		}

		export class BundleConfig {
			/**@description Bundle名 如:hall*/
			bundle: string;
			/**@description Bundle名 如:大厅  */
			name: string;
			index: number;
			/**@description 加载bundle完成后，发出的Logic事件默认为td.Logic.Event.ENTER_GAME */
			event: string;
			/**@description 是否需要提示弹出框提示升级 默认false*/
			isNeedPrompt: boolean;
			/**
			 * 
			 * @param name bundle名 如：大厅
			 * @param bundle Bundle名 如:hall
			 * @param index 游戏index,可根据自己需要决定需不需要
			 * @param event 加载bundle完成后，派发事件
			 * @param isNeedPrompt 是否需要弹出提示升级的弹出框 默认false
			 */
			constructor(
				name: string,
				bundle: string,
				index: number,
				event?: string,
				isNeedPrompt?: boolean);
		}
	}

	/**@description 逻辑模块 */
	namespace Logic {
		/**@description 逻辑事件类型 */
		export enum Type {
			/**@description 未知 */
			UNKNOWN = "UNKNOWN",
			/**@description 大厅 */
			HALL = "HALL",
			/**@description 游戏场景 */
			GAME = "GAME",
			/**@description 登录场景 */
			LOGIN = "LOGIN",
			/**@description 房间列表 */
			ROOM_LIST = "ROOM_LIST",
		}
		/**@description 逻辑事件定义 */
		export enum Event {
			/**@description 进行指定场景完成 */
			ENTER_COMPLETE = "ENTER_COMPLETE",

			/**@description 进入大厅*/
			ENTER_HALL = "ENTER_HALL",

			/**@description 进入游戏 */
			ENTER_GAME = "ENTER_GAME",

			/**@description 返回登录界面 */
			ENTER_LOGIN = "ENTER_LOGIN",

			/**@description 进入房间列表 */
			ENTER_ROOM_LIST = "ENTER_ROOM_LIST"
		}
		/**@description 逻辑派发数据接口 */
		export interface EventData {
			type: Type;
			/**@description 需要排除的界面，除这些界面之外的其它界面将会关闭 */
			views: (UIClass<import("./assets/scripts/framework/core/ui/UIView").UIView> | string | import("./assets/scripts/framework/core/ui/UIView").UIView)[];

			/**@description 其它用户数据 */
			data?: any;
		}
	}

	/**@description Http相关枚举定义 */
	export namespace Http {
		/**@description http错误类型 */
		export enum ErrorType {
			/**@description 错误的Url地地址*/
			UrlError,
			/**@description 请求超时 */
			TimeOut,
			/**@description 请求错误 */
			RequestError,
		}

		/**@description http 请求类型 */
		export enum RequestType {
			POST = "POST",
			GET = "GET",
		}

		/**@description http 错误 */
		export interface Error {
			type: ErrorType,
			reason: any,
		}
	}

	/**@description 日志输出相关 */
	namespace Log {
		/**@description 日志等级 */
		export enum Level {
			LOG = 0X00000001,
			DUMP = 0X00000010,
			WARN = 0X00000100,
			ERROR = 0X00001000,
			ALL = LOG | DUMP | WARN | ERROR,
		}
	}

	/**@description 资源相关 */
	namespace Resource {
		/**@description 资源加载器错误 */
		export enum LoaderError {
			/**@description 加载中 */
			LOADING,
			/** @description 未找到或设置加载资源*/
			NO_FOUND_LOAD_RESOURCE,
			/**@description 完美加载 */
			SUCCESS,
		}
		/**@description 资源缓存类型 */
		export enum CacheStatus {
			/**@description 无状态 */
			NONE,
			/**@description 等待释放 */
			WAITTING_FOR_RELEASE,
		}
		/**@description 资源类型 */
		export enum Type {
			/**@description 本地 */
			Local,
			/**@description 远程资源 */
			Remote,
		}
		/**@description 资源信息 */
		export class Info {
			url: string = "";
			type: typeof cc.Asset = null;
			data: cc.Asset | cc.Asset[] = null;
			/**@description 是否常驻内存，远程加载资源有效 */
			retain: boolean = false;
			bundle: BUNDLE_TYPE = null;
			/**@description 默认为本地资源 */
			resourceType: Resource.Type = td.Resource.Type.Local;
		}
		export class CacheData {
			/**@description 是否已经加载完成 */
			isLoaded: boolean = false;
			/**@description 加载完成数据 
			 * cc.Prefab 
			 * cc.SpriteAtlas 
			 * cc.SpriteFrame 
			 * cc.AudioClip 
			 * cc.Font 
			 * sp.SkeletonData 
			 * cc.ParticleAsset 
			 * cc.Texture2D
			 * cc.JsonAsset
			 * */
			data: cc.Asset | cc.Asset[] = null;

			info: Info = new Info();

			status: CacheStatus = CacheStatus.NONE;

			/**@description 在加载过程中有地方获取,加载完成后再回调 */
			getCb: ((data: any) => void)[] = [];

			/**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
			finishCb: ((data: any) => void)[] = [];

			doGet(data): void;

			doFinish(data): void;

			get isInvalid(): boolean;
		}

		export interface Data {
			/**@description resources 目录url 与 type 必须成对出现*/
			url?: string,
			/**@description 资源类型 与 url 必须成对出现 目前支持预加载的资源有cc.Prefab | cc.SpriteFrame | sp.SkeletonData*/
			type?: typeof cc.Asset,
			/**
			 * @description 预加载界面，不需要对url type赋值 
			 * 如GameView游戏界面，需要提前直接加载好界面，而不是只加载预置体，
			 * 在网络消息来的时间，用预置体加载界面还是需要一定的时间，
			 * 从而会造成消息处理不是顺序执行 
			 * */
			preloadView?: UIClass<import("./assets/scripts/framework/core/ui/UIView").UIView>,
			bundle?: BUNDLE_TYPE,
			/**@description 如果是加载的目录，请用dir字段 */
			dir?: string,
		}
	}

	/**@description 界面视图状态 */
	enum ViewStatus {
		/**@description 等待关闭 */
		WAITTING_CLOSE,
		/**@description 等待隐藏 */
		WATITING_HIDE,
		/**@description 无状态 */
		WAITTING_NONE,
	}

	/**@description 网络相关 */
	namespace Net {
		/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */
		export type HandleFunc = (handleTypeData: any) => number;
		export interface ListenerData {
			mainCmd: number, // main cmd
			subCmd: number, //sub cmd
			func: HandleFunc, //处理函数
			type: typeof import("./assets/scripts/framework/core/net/message/Message").Message, //解包类型
			isQueue: boolean,//是否进入消息队列，如果不是，收到网络消息返回，会立即回调处理函数
			data?: any, //解包后的数据
			target?: any, //处理者
		}
		type Type = "ws" | "wss";
		/**@description 网络事件 */
		export enum NetEvent {
			/**@description 网络打开 */
			ON_OPEN = "NetEvent_ON_OPEN",
			/**@description 网络关闭 */
			ON_CLOSE = "NetEvent_ON_CLOSE",
			/**@description 网络错误 */
			ON_ERROR = "NetEvent_ON_ERROR",
			/**@description 应用层主动调用网络层close */
			ON_CUSTOM_CLOSE = "NetEvent_ON_CUSTOM_CLOSE",
		}
		export interface ServiceEvent{
			service: import("./assets/scripts/framework/core/net/service/Service").Service;
			event : Event;
		}
	}

	/**@description 全局配置命名空间 可使用toNamespace进行对数据的合并*/
	namespace Config {
		/**@description 是否显示调试按钮 */
		export const isShowDebugButton: boolean;

		/**@description 公共Prefabs预置路径 */
		export const CommonPrefabs: {
			tips: string,
			uiLoading: string,
			loading: string,
			alert: string,
		}

		/**@description 公共音效路径 */
		export const audioPath: {
			dialog: string,
			button: string,
		}

		/**@description 是否跳过热更新检测 */
		export const isSkipCheckUpdate: boolean;

		/**@description 测试热更新服务器地址 */
		export const TEST_HOT_UPDATE_URL_ROOT: string;//"http://192.168.0.104:9945/hotupdate";

		/**@description Loading动画显示超时回调默认超时时间 默认30 */
		export const LOADING_TIME_OUT: number;

		/**@description Loading提示中切换显示内容的时间间隔 默认3 */
		export const LOADING_CONTENT_CHANGE_INTERVAL: number;

		/**@description 加载界面超时时间,如果在LOAD_VIEW_TIME_OUT秒未加载出，提示玩家加载界面超时,默认20 */
		export const LOAD_VIEW_TIME_OUT: number;

		/**@description UILoading显示默认时间，即在打开界面时，如果界面在LOAD_VIEW_DELAY之内未显示，就会弹出一的加载界面的进度 
		 * 在打开界面时，也可直接指定delay的值
		 * @example  
		 * Manager.uiManager.open({ type : LoginLayer, zIndex: ViewZOrder.zero, delay : 0.2});
		 */
		export const LOAD_VIEW_DELAY: number;

		/**@description 大厅bundle名 */
		export const BUNDLE_HALL: string;

		/**@description 重连的超时时间 */
		export const RECONNECT_TIME_OUT: number;

		/**@description 进入后台最大时间（单位秒）大于这个时间时就会进入重连*/
		export const MAX_INBACKGROUND_TIME: number;
		/**@description 进入后台最小时间（单位秒）大于这个时间时就会进入重连*/
		export const MIN_INBACKGROUND_TIME: number;

		/**@description 网络重连弹出框tag */
		export const RECONNECT_ALERT_TAG: number;
	}

	export namespace Macro {
		/**@description 公共语言包数据名 */
		export const COMMON_LANGUAGE_NAME: string;
		/**@description 网络数据全以大端方式进行处理 */
		export const USING_LITTLE_ENDIAN: boolean;
		/**@description 主包bundle名 */
		export const BUNDLE_RESOURCES: string;
		/**@description 远程资源包bundle名 */
		export const BUNDLE_REMOTE: string;
		/**@description 是否允许游戏启动后切换语言 */
		export const ENABLE_CHANGE_LANGUAGE: boolean;
		/**@description 语言包路径使用前缀 */
		export const USING_LAN_KEY: string;
	}

	/**
	   * @description 界面层级定义
	   */
	export namespace ViewZOrder {

		/**@description 最底层 */
		export const zero = 0;

		/**@description 小喇叭显示层 */
		export const Horn = 10;

		/**@description ui层 */
		export const UI = 100;

		/**@description 提示 */
		export const Tips = 300;

		/**@description 提示弹出框 */
		export const Alert = 299;

		/**@description Loading层 */
		export const Loading = 600;

		/**@description 界面加载动画层，暂时放到最高层，加载动画时，界面未打开完成时，不让玩家点击其它地方 */
		export const UILoading = 700;
	}

	/**@description 适配相关 */
	namespace Adaptor {
		/**@description 屏幕适配 */
		export const ADAPT_SCREEN = "Event_ADAPT_SCREEN";
	}

	export interface UIClass<T extends import("./assets/scripts/framework/core/ui/UIView").UIView> {
		new(): T;
		/**
		 *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer 
		 */
		getPrefabUrl(): string;
	}

	export class FramewokManager {
		/**@description 常驻资源指定的模拟view */
		readonly retainMemory: import("./assets/scripts/framework/core/ui/UIManager").ViewDynamicLoadData;
		/**@description 语言包 */
		readonly language: import("./assets/scripts/framework/core/language/Language").Language;
		/**@description 事件派发器 */
		readonly eventDispatcher: import("./assets/scripts/framework/core/event/EventDispatcher").EventDispatcher;
		/**@description 界面管理器 */
		readonly uiManager: import("./assets/scripts/framework/core/ui/UIManager").UIManager;
		/**@description 本地仓库 */
		readonly localStorage: import("./assets/scripts/framework/core/storage/LocalStorage").LocalStorage;
		/**@description 资源管理器 */
		readonly assetManager: import("./assets/scripts/framework/core/asset/AssetManager").AssetManager;
		/**@description 资源缓存管理器 */
		readonly cacheManager: import("./assets/scripts/framework/core/asset/CacheManager").CacheManager;
		/**@description 适配相关 */
		readonly adaptor: import("./assets/scripts/framework/core/adaptor/Adaptor").Adaptor;
		/**@description 对象池管理器 */
		readonly nodePoolManager: import("./assets/scripts/framework/core/nodePool/NodePoolManager").NodePoolManager;
		/**@description 小提示 */
		readonly tips: import("./assets/scripts/common/component/Tips").Tips;
		/**@description 界面加载时的全屏Loading,显示加载进度 */
		readonly uiLoading: import("./assets/scripts/common/component/UILoading").UILoading;
		/**@description websocket wss 证书url地址 */
		wssCacertUrl: string;
		/**@description 提示框 */
		readonly alert: import("./assets/scripts/common/component/Alert").Alert;
		/**@description 公共loading */
		readonly loading: import("./assets/scripts/common/component/Loading").Loading;
		/**@description 逻辑控制器管理器 */
		readonly logicManager: import("./assets/scripts/framework/core/logic/LogicManager").LogicManager;
		/**@description 游戏数据 自行设置 */
		gameData: import("./assets/scripts/framework/data/GameData").GameData;
		/**@description 游戏网络控制器 自行设置 */
		gameController: any;
		/**@description 当前游戏GameView, GameView进入onLoad赋值 */
		gameView: import("./assets/scripts/framework/core/ui/GameView").default;
		/**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
		readonly globalAudio: import("./assets/scripts/common/component/GlobalAudio");
		/**@description bundle管理器 */
		readonly bundleManager: import("./assets/scripts/framework/core/asset/BundleManager").BundleManager;
		/**@description 网络Service管理器 */
		readonly serviceManager: import("./assets/scripts/common/manager/ServiceManager").ServiceManager;
		/**@description 大厅网络管理器 */
		readonly hallNetManager: import("./assets/scripts/framework/core/net/service/NetManager").NetManager;
		/**@description 全局网络管理器 */
		readonly netManager: import("./assets/scripts/framework/core/net/service/NetManager").NetManager;
		/**@description 热更新管理器 */
		readonly hotupdate: import("./assets/scripts/framework/core/hotupdate/HotupdateManager").HotupdateManager;
		/**
		  * @description 把语言包转换成i18n.xxx形式
		  * @param param 语言包配置
		  * @param bundle bundle
		  * @example
		  * export let TANK_LAN_ZH = {
		  * language: cc.sys.LANGUAGE_CHINESE,
		  * data: {
		  * title: `坦克大战`,
		  * player: '单人模式 ',
		  * palyers: '双人模式',
		  * }
		  * }
		  * //以上是坦克大战的语言包,assetBundle为tankBattle
		  * Manager.makeLanguage("title","tankBattle"); //=> i18n.tankBattle.title 指向游戏特定的语言包
		  * Manager.makeLanguage("title"); //=> i18n.title 指向的大厅的公共语言包
		  */
		makeLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE = BUNDLE_RESOURCES): (string | number)[] | string;
		/**
		  * @description 获取语言包 
		  */
		getLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE): string;
	}
}

declare let Manager: td.FramewokManager;
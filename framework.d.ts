
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

	/**@description 通过预置体路径创建节点 
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
	 */
	export function createPrefab(config: { url: string, view: td.UIView, completeCallback: (node: cc.Node) => void, bundle?: BUNDLE_TYPE });

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
		view: td.UIView,
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
		view: td.UIView,
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
			view: td.UIView,
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
			view: td.UIView,
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
			view: td.UIView,//UIView的子类
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
		loadFont(config: { font: string, view: td.UIView, completeCallback?: (font: Font) => void, bundle?: BUNDLE_TYPE });

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
		loadFile(config: { url: string, view: td.UIView, completeCallback?: (file: ParticleAsset) => void, bundle?: BUNDLE_TYPE });

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
			view: td.UIView,
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
		loadSkeleton(config: { url: string, view: td.UIView, completeCallback: (data: sp.SkeletonData) => void, bundle?: BUNDLE_TYPE });
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

/**@description 提示代理 */
declare interface Tips {
	/**
	 * @description tips提示
	 * @param msg 提示内容
	 */
	show(msg: string): void;
	/**@description 预加载预置体 */
	preloadPrefab(): void;
	finishShowItem(node: cc.Node): void;
}

/**@description 界面加载动画，web端在下载界面时，如果超过了一定时间，需要弹出动画，告诉用户当前加载界面的进度 */
declare interface UILoading {
	/**
	 * @description 显示全屏幕加载动画
	 * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
	 */
	show(delay: number, name: string): void;
	/**
	 * @description 更新进度，0-100
	 * @param progress 0-100
	 */
	updateProgress(progress: number): void;
	hide(): void;
	/**@description 预加载预置体 */
	preloadPrefab(): void;
}

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

		/**@description 语言包具体实现 */
		export class Impl {
			/**@description 添加数据代理 */
			addSourceDelegate(delegate: DataSourceDelegate): void;
			/**@description 删除数据代理 */
			removeSourceDelegate(delegate: DataSourceDelegate): void;
			/**
			 * @description 改变语言包
			 * @param language 语言包类型
			 **/
			change(language: string): void;
			get(args: (string | number)[]): any;
			/**@description 获取语言包名 */
			getLanguage(): string;
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
			views: (UIClass<UIView> | string | UIView)[];

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
			preloadView?: UIClass<UIView>,
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
		export class Message {
			/**@description 消息主cmd码 */
			mainCmd: number;
			/**@description 消息子cmd码 */
			subCmd: number;
			/**@description 发送或接收的消息流 */
			buffer: Uint8Array;
			/**@description 打包数据 */
			encode(): boolean;
			/**@description 解析数据 */
			decode(data: Uint8Array): boolean;
		}
		/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */
		export type HandleFunc = (handleTypeData: any) => number;
		export interface ListenerData {
			mainCmd: number, // main cmd
			subCmd: number, //sub cmd
			func: HandleFunc, //处理函数
			type: typeof Message, //解包类型
			isQueue: boolean,//是否进入消息队列，如果不是，收到网络消息返回，会立即回调处理函数
			data?: any, //解包后的数据
			target?: any, //处理者
        }
        type Type = "ws" | "wss";
        /**@description 网络事件 */
        export enum Event {
            /**@description 网络打开 */
            ON_OPEN = "NetEvent_ON_OPEN",
            /**@description 网络关闭 */
            ON_CLOSE = "NetEvent_ON_CLOSE",
            /**@description 网络错误 */
            ON_ERROR = "NetEvent_ON_ERROR",
            /**@description 应用层主动调用网络层close */
            ON_CUSTOM_CLOSE = "NetEvent_ON_CUSTOM_CLOSE",
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
		export class Impl {
			isShowKeyboard: boolean;
			/**@description 全屏适配 */
			public fullScreenAdapt(node: cc.Node, adapter?: IFullScreenAdapt): void;
			/**@description 是否需要做适配操作，当分辨率发生变化，只要ScreenAdaptType 不是None的情况 */
			public get isNeedAdapt(): boolean;
			public onLoad(node: cc.Node): void;
			public onDestroy(): void;
			/**@description 浏览器适配初始化 */
			public initBrowserAdaptor(): void;
			get isBrowser(): boolean;
		}
    }

	export class EventComponent extends cc.Component {
		/**
		  * @description 注册网络事件 ，在onLoad中注册，在onDestroy自动移除
		  * @param manCmd 
		  * @param subCmd 
		  * @param func 处理函数
		  * @param handleType 消息解析类型
		  * @param isQueue 是否加入队列
		  */
		registerEvent(manCmd: number, subCmd: number, func: (data: any) => void, handleType?: any, isQueue?: boolean): void;
		/**
		 * 注册事件 ，在onLoad中注册，在onDestroy自动移除
		 * @param eventName 
		 * @param func 
		 */
		registerEvent(eventName: string, func: (data: any) => void): void;
		/**
		  * @description 注册网络事件 ，在onLoad中注册，在onDestroy自动移除
		  * @param manCmd 
		  * @param subCmd 
		  * @param func 处理函数
		  * @param handleType 消息解析类型 如果不注册类型，返回的是服务器未进行解析的源数据，需要自己进行解包处理
		  * @param isQueue 是否加入队列
		  */
		addEvent(manCmd: number, subCmd: number, func: (data: any) => void, handleType?: any, isQueue?: boolean): void;
		/**
		 * 注册事件 ，在onLoad中注册，在onDestroy自动移除
		 * @param eventName 
		 * @param func 
		 */
		addEvent(eventName: string, func: (data: any) => void): void;
		/**
		  * @description 删除注册网络事件
		  * @param manCmd 主cmd
		  * @param subCmd 子cmd
		  */
		removeEvent(manCmd: number, subCmd: number): void;
		/**
		 * @description 删除普通事件
		 * @param eventName 事件名
		 */
		removeEvent(eventName: string): void;
		// protected bindingEvents(): void;
		onLoad(): void;
		onDestroy(): void;
	}

	export class AudioComponent extends EventComponent {
		/**@description 音频控件资源拥有者，该对象由UIManager打开的界面 */
		owner: UIView
		/**@description 背景音乐音量 */
		musicVolume: number;
		/**@description 音效音量 */
		effectVolume: number;
		/**@description 音效开关 */
		isEffectOn: boolean;
		/**@description 背景音乐开关 */
		isMusicOn: boolean;
		/**@description 当前播放的背景音乐 */
		curMusicUrl: string;
		curBundle: BUNDLE_TYPE;
		/**@description 存储 */
		save(): void;
		/**@description 停止 */
		stopEffect(effectId: number = null): void;
		stopAllEffects(): void;
		stopMusic(): void;
		playMusic(url: string, bundle: BUNDLE_TYPE, loop: boolean = true): Promise<{
			url: string;
			isSuccess: boolean;
		}>;
		playEffect(url: string, bundle: BUNDLE_TYPE, loop: boolean = false): Promise<number>;
		onEnterBackground(): void;
		onEnterForgeground(inBackgroundTime: number): void;
	}

	export class UIView extends EventComponent implements IFullScreenAdapt {
		static getPrefabUrl(): string;
		/**@description 当前传入参数，即通过UI管理器打开时的传入参数 */
		get args(): any[];
		/**指向当前View打开时的bundle */
		bundle: BUNDLE_TYPE;
		/**@description 类名，请不要设置，由管理器进行设置 */
		className: string;
		close(): void;
		/**@description args为open代入的参数 */
		show(args: any[]): void;
		hide(): void;
		/**@description 动画显示界面 
		  *@param isOverrideShow 是否是重写show调用的,如果是重写show调用了,必将此参数设置为true,否则会产生死循环递归调用 
		  *@param completeCallback 完成回调
		  *@example 
		  *  示例： 通常在init/onLoad函数中调用 showWithAction,
		  *  但如果需要界面通过hide隐藏，而不是关闭界面时，下一次显示时
		  *  管理器直接调用了show,没有执行界面的打开动画，如果还需要界面打开动画
		  *  需要按如下方式重写show方法
		  *  show( args : any[] ){
		  *      super.show(args);
		  *      this.showWithAction(true);
		  *      //to do => 
		  *  }
		  */
		showWithAction(isOverrideShow = false, completeCallback?: () => void): void;
		/**@description 动画隐藏界面 
		  *@param isOverrideHide 是否是重写hide调用的,如果是重写hide调用了,必将此参数设置为true,否则会产生死循环递归调用 
		  *@param completeCallback 完成回调
		  */
		hideWithAction(completeCallback?: () => void): void;
		/**@description 动画关闭界面 
		  *@param completeCallback 完成回调
		  */
		closeWithAction(completeCallback?: () => void): void;
		/**
		  * @description 启用物理返回键按钮
		  * @param isEnabled true 启用，
		  * @example 重写onKeyBack方法
		  */
		setEnabledKeyBack(isEnabled: boolean): void;
		isEnabledKeyBack(): boolean;
		onKeyUp(ev: cc.Event.EventKeyboard): void;
		onKeyBack(ev: cc.Event.EventKeyboard): void;
		audioHelper: AudioComponent;
		enableFrontAndBackgroundSwitch: boolean;
		onEnterForgeground(inBackgroundTime: number): void;
		onEnterBackground(): void;
	}

	export class ViewDynamicLoadData {
		name: string;
		constructor(name?: string);
		/**@description 添加动态加载的本地资源 */
		addLocal(info: Resource.Info, className?: string): void;
		/**@description 添加动态加载的远程资源 */
		addRemote(info: Resource.Info, className?: string): void;
		/**@description 清除远程加载资源 */
		clear(): void;
	}

	export interface UIClass<T extends UIView> {
		new(): T;
		/**
		 *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer 
		 */
		getPrefabUrl(): string;
	}

	export class RemoteLoader {
		loadImage(url: string, isNeedCache: boolean): Promise<cc.SpriteFrame>;
		loadSkeleton(path: string, name: string, isNeedCache: boolean): Promise<sp.SkeletonData>;
		/**@description 由主游戏控制器驱动，在下载远程资源时，设置一个上限下载任务数据，以免同一时间任务数量过大 */
		update(): void;
	}

	export class RemoteCaches {
		/**
		 * @description 获取远程缓存数据
		 * @param type 远程奖状类型
		 * @param url 远程地址
		 */
		public get(url: string): Resource.CacheData;
		public getSpriteFrame(url: string): Resource.CacheData;
		public setSpriteFrame(url: string, data: any): cc.SpriteFrame;
		set(url: string, data: Resource.CacheData): void;
		retainAsset(info: Resource.Info): void;
		releaseAsset(info: Resource.Info): void;
		remove(url: string): void;
		showCaches(): void;
	}
	export class CacheManager {
		/**@description 远程资源缓存管理器 */
		public get remoteCaches(): RemoteCaches;
		getBundleName(bundle: BUNDLE_TYPE): string;
		get(bundle: BUNDLE_TYPE, path: string, isCheck: boolean = true): Resource.CacheData;
		set(bundle: BUNDLE_TYPE, path: string, data: Resource.CacheData): void;
		/**
		 * @description 
		 * @param bundle bundle
		 * @param path path
		 */
		remove(bundle: BUNDLE_TYPE, path: string): boolean;
		removeWithInfo(info: Resource.Info): boolean;
		removeBundle(bundle: BUNDLE_TYPE): void;
		/**
		  * @description 如果资源正在加载中，会等待资源加载完成后返回，否则直接返回null
		  * @param url 
		  * @param type 资源类型
		  * @param bundle
		  */
		getCache<T extends cc.Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<T>;
		/**
		  * @description 异步获取资源，如果资源未加载，会加载完成后返回
		  * @param url 
		  * @param type 
		  * @param bundle 
		  */
		getCacheByAsync<T extends cc.Asset>(url: string, type: { prototype: T }, bundle: BUNDLE_TYPE): Promise<T>;
		getSpriteFrameByAsync(urls: string[], key: string, view: UIView, addExtraLoadResource: (view: UIView, info: Resource.Info) => void, bundle: BUNDLE_TYPE): Promise<{
			url: string;
			spriteFrame: cc.SpriteFrame;
			isTryReload?: boolean;
		}>;
		/**@description 打印当前缓存资源 */
		printCaches(): void;
	}
	export class NodePool {
		constructor(name: string);
		name: string;
		/**
		   * @description 用来克隆的节点，在get时，如果发现对象池中不存在，会直接用此节点进行克隆
		   * 注意，设置的克隆对象会从父节点移除，但不会进行cleanup操作
		   * 在clear时，对该克隆节点进行释放操作
		   * */
		cloneNode: cc.Node;
		/**@description 当前对象池数据大小 */
		get size(): number;
		/**@description 销毁对象池中缓存的所有节点 */
		clear(): void;
		/**
		   * @description 向缓冲池中存入一个不需要的节点对象
		   * 这个函数会自动将目标节点从父节点移除，但不会进行 cleanup 操作
		   * 
		   */
		put(obj: cc.Node): void;
		/**
		   * @description 从对象池中取缓冲节点
		   * */
		get(): cc.Node;
	}
	/**
	   * 对象池管理器
	   */
	export class NodePoolManager {
		/**
		   * @description 创建对象池
		   * @param type 对象池类型
		   */
		createPool(type: string): NodePool;
		/**
		   * @description 删除对象池 
		   * @param type 对象池类型
		   * */
		deletePool(type: string | NodePool): void;
		/**
		   * @description 获取对象池
		   * @param type 对象池类型 
		   * @param isCreate 当找不到该对象池时，会默认创建一个对象池
		   * */
		getPool(type: string, isCreate = true): NodePool;
	}

	export class Alert {
		preloadPrefab(): void;
		show(config: AlertConfig): boolean;
		/**
		* @description 关闭当前显示的 
		* @param tag 可不传，关闭当前的弹出框，否则关闭指定tag的弹出框
		*/
		close(tag?: string | number)
		/**@description 当前显示的弹出框是否是tag */
		isCurrentShow(tag: string | number): boolean;
		/**@description 获取当前显示弹出的配置 */
		currentShow(tag?: string | number): AlertConfig;
		/**@description 是否有该类型的弹出框 */
		isRepeat(tag: string | number): boolean;
		closeAll(): void;
		finishAlert(): void;
	}

	export class Loading {
		/**@description 显示超时回调 */
		timeOutCb: () => void = null;
		preloadPrefab(): void;
		/**
		  * @description 显示Loading
		  * @param content 提示内容
		  * @param timeOutCb 超时回调
		  * @param timeout 显示超时时间
		  */
		show(content: string | string[], timeOutCb?: () => void, timeout?: number): this;
		hide(): void;
	}

	export class LogicManager {
		push(logicType: any): void;
		onLoad(node: cc.Node): void;
		onDestroy(node: cc.Node): void;
	}

	/**@description 游戏内数据的公共基类 */
	export class GameData {

		/**@description 当前的asset bundle name */
		get bundle();

		/**@description 清除数据 */
		clear();

		/**@description 游戏类型 */
		gameType();
	}

	export class GameView extends UIView {

	}

	export class GlobalAudio extends AudioComponent {
		playDialogOpen(): void;
		playButtonClick(): void;
	}

	export class BundleConfig {
		/**@description Bundle名 如:hall*/
		bundle: string = "";
		/**@description Bundle名 如:大厅  */
		name: string = "";
		index = 0;
		/**@description 加载bundle完成后，发出的bundle事件 */
		event: string;
		/**@description 是否需要提示弹出框提示升级 */
		isNeedPrompt: boolean = false;
		/**
		 * 
		 * @param name bundle名 如：大厅
		 * @param bundle Bundle名 如:hall
		 * @param index 游戏index,可根据自己需要决定需不需要
		 * @param event 加载bundle完成后，派发事件
		 * @param isNeedPrompt 是否需要弹出提示升级的弹出框
		 */
		constructor(name: string, bundle: string, index: number, event?: string, isNeedPrompt: boolean = false);
	}

	export class BundleManager {
		/**@description 删除已经加载的bundle */
		removeLoadedBundle(): void;
		/**@description 删除所有加载子游戏的bundle */
		removeLoadedGamesBundle(): void;
		/**
		* 外部接口 进入Bundle
		* @param config 配置
		*/
		enterBundle(config: BundleConfig): void;
	}

	export class Reconnect {
		static preloadPrefab(): void;
		/**@description 是否启用 */
		enabled: boolean;
		constructor(service: CommonService);
		async show(content?: string): void;
		hide(): void;
		hideNode(): void;
		showNode(content: string): void;
	}

	export class CommonService implements GameEventInterface {
		/**@description 进入后台的最大允许时间，超过了最大值，则进入网络重连 */
		maxEnterBackgroundTime: number;
		/**
		* @description 连接网络
		*/
		connect(): void;
		/**@description 网络重连 */
		reconnect: Reconnect;
	}

	export class ServiceManager implements GameEventInterface {
		/**
		  * @description 如果自己项目有多个网络Service，
		  * 可直接在这里添加，由ServiceManager统一处理 
		  * */
		onLoad(): void;
		/**@description 网络事件调度 */
		update(): void;
		/**@description 主场景销毁,关闭所有连接 */
		onDestroy(): void;
		/**@description 关闭当前所有连接 */
		close(): void;
		/**@description 尝试重连 */
		tryReconnect(service: CommonService, isShowTips: boolean = false): void;
		/**@description 重连成功 */
		onReconnectSuccess(service: CommonService): void;
		/**@description 进入后台 cc.game.EVENT_HIDE*/
		onEnterBackground();

		/**
		 * @description 进入前台 cc.game.EVENT_SHOW
		 * @param inBackgroundTime 在后台运行的总时间，单位秒
		 */
		onEnterForgeground(inBackgroundTime: number);
	}

	export class NetManager {
		constructor(name: string);
		onLoad(node: cc.Node): void;
		onDestroy(node: cc.Node): void;
		/**@description 网络控制器注册 Controller<T>的子类 */
		register(controllerType: any): void;
		/**@description 添加网络控制组件 */
		addNetControllers(): void;
		/**@description 移除网络控制组件 */
		removeNetControllers(): void;
	}

	export class HotupdateManager {
		/**@description 通用的热更新地址，当在子游戏或大厅未指定热更新地址时，都统一使用服务器传回来的默认全局更新地址 */
		get commonHotUpdateUrl(): string;
		/**@description 检测更新回调 */
		checkCallback: (code: HotUpdate.Code, state: HotUpdate.State) => void = null;
		/**@description bundle版本信息 */
		bundlesConfig: { [key: string]: HotUpdate.BundleConfig }
		/**@description 获取Bundle名 */
		getBundleName(gameName: string): HotUpdate.BundleConfig;
		/**@description 重新下载 下载失败的资源 */
		downloadFailedAssets(): void;
		/**@description 检查大厅是否需要更新 */
		checkHallUpdate(callback: (code: HotUpdate.Code, state: HotUpdate.State) => void): void;
		/**
		* @description 检测子游戏更新
		* @param gameName 子游戏名
		* @param callback 检测完成回调
		*/
		checkGameUpdate(gameName: string, callback: (code: HotUpdate.Code, state: HotUpdate.State) => void): void;
		/**@description 执行热更新*/
		hotUpdate(): void;
	}

	export class FramewokManager {
		/**@description 常驻资源指定的模拟view */
		readonly retainMemory: ViewDynamicLoadData;
		/**@description 语言包 */
		readonly language: Language.Impl;
		/**@description 事件派发器 */
		readonly eventDispatcher: import("./assets/scripts/framework/support/event/EventDispatcher").EventDispatcher;
		/**@description 界面管理器 */
		readonly uiManager: import("./assets/scripts/framework/support/ui/UIManager").UIManager;
		/**@description 本地仓库 */
		readonly localStorage: import("./assets/scripts/framework/support/storage/LocalStorage").LocalStorage;
		/**@description 资源管理器 */
		readonly assetManager: import("./assets/scripts/framework/support/assetManager/AssetManager").AssetManager;
		/**@description 资源缓存管理器 */
		readonly cacheManager: CacheManager;
        /**@description 适配相关 */
		readonly adaptor: Adaptor.Impl;
		/**@description 对象池管理器 */
		readonly nodePoolManager: NodePoolManager;
		/**@description 小提示 */
		readonly tips: Tips;
		/**@description 界面加载时的全屏Loading,显示加载进度 */
		readonly uiLoading: UILoading;
		/**@description websocket wss 证书url地址 */
		wssCacertUrl: string;
		/**@description 提示框 */
		readonly alert: Alert;
		/**@description 公共loading */
		readonly loading: Loading;
		/**@description 逻辑控制器管理器 */
		readonly logicManager: LogicManager;
		/**@description 游戏数据 自行设置 */
		gameData: GameData;
		/**@description 游戏网络控制器 自行设置 */
		gameController: any;
		/**@description 当前游戏GameView, GameView进入onLoad赋值 */
		gameView: GameView;
		/**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
		readonly globalAudio: GlobalAudio;
		/**@description bundle管理器 */
		readonly bundleManager: BundleManager;
		/**@description 网络Service管理器 */
		readonly serviceManager: ServiceManager;
		/**@description 大厅网络管理器 */
		readonly hallNetManager: NetManager;
		/**@description 全局网络管理器 */
		readonly netManager: NetManager;
		/**@description 热更新管理器 */
		readonly hotupdate: HotupdateManager;
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
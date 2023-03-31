/**@description 调试 */
interface Logger {
	/**@description 错误日志 */
	e(...data: any[]): void;
	/**@description debug日志 */
	d(...data: any[]): void;
	/**@description 警告输出 */
	w(...data: any[]): void;
	/**
	 * @description dump 对象数据
	 * @param object dump的对象
	 * @param label 标签
	 * @param deep 深度
	 */
	dump(object: unknown, label?: string, deep?: number): void;
}
declare let Log: Logger;

declare type BUNDLE_TYPE = string | cc.AssetManager.Bundle;
declare type SocketBuffer = string | Uint8Array;
/**
 * @description 发事件 参考framework/extentions/extentions dispatch 方法
 * @param name 
 * @param args 
 */
declare function dispatch(name: string, ...args: any[]): void;

declare interface Date {
	/**
	 * @description 格式当前时间 
	 * @example 
	 * y : 年
	 * M ：月
	 * d : 日
	 * h : 时 
	 * m : 分
	 * s : 秒
	 * q : 季度
	 * S ：毫秒
	 * let now = new Date();
	 * let str = now.format("yyyy:MM:dd hh:mm:ss"); //2019:11:07 10:19:51
	 * str = now.format("yyyy/MM/dd");//2019/11/07
	 * str = now.format("hh:mm:ss");//10:19:51
	 * str = now.format("yyyy/MM/dd hh:mm:ss.SS 第qq季度");//2022/07/21 23:32:23.75 第03季度
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
	 * @description 返回格式化后的时间
	 * @param format 
	 * @param date 如果不传入，则为当前时间
	 */
	format(format: string, date?: Date): string;
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

declare type UIView = import("../assets/scripts/framework/core/ui/UIView").default;
declare interface UIClass<T extends UIView> {
	new(): T;
	/**
	 *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer,
	 * 如果是在主场景上的节点
	 * static getPrefabUrl(){
	 *   return `@LoginView`;
	 * } 
	 */
	getPrefabUrl(): string;
}

/**
 * @description 单列接口类
 */
declare interface ISingleton {
	/**@description 初始化 */
	init?(...args: any[]): any;
	/**@description 销毁(单列销毁时调用) */
	destory?(...args: any[]): any;
	/**@description 清理数据 */
	clear?(...args: any[]): any;
	/**@description 是否常驻，即创建后不会删除 */
	isResident?: boolean;
	/**@description 不用自己设置，由单列管理器赋值 */
	module: string;
	/**输出调试信息 */
	debug?(...args: any[]): void;
}

declare interface ModuleClass<T> {
	new(): T;
	/**@description 模块名 */
	module: string;
}

/**@description 单列类型限制 */
declare interface SingletonClass<T> extends ModuleClass<T> {
	instance?: T;
}

declare interface EntryClass<T> {
	new(): T;
	/**@description 当前bundle名 */
	bundle: string;
}

declare type Entry = import("../assets/scripts/framework/core/entry/Entry").Entry;
declare type Logic = import("../assets/scripts/framework/core/logic/Logic").Logic;
declare type GameView = import("../assets/scripts/framework/core/ui/GameView").default;
declare interface GameViewClass<T extends UIView> {
	new(): T;
	logicType: ModuleClass<Logic>;
}

declare type Sender = import("../assets/scripts/framework/core/net/service/Sender").Sender;
declare type Handler = import("../assets/scripts/framework/core/net/service/Handler").Handler;
declare type ReconnectHandler = import("../assets/scripts/common/net/ReconnectHandler").ReconnectHandler;

declare type Service = import("../assets/scripts/framework/core/net/service/Service").Service;
declare interface ServiceClass<T extends Service> extends ModuleClass<T> {
}

/**
 * @description 通过预置体路径创建节点 请使用全局的导入
 * @param config 配置信息
 * @param config.url 预置体路径
 * @param config.view 预置视图资源管理器，继承自UIView
 * @param config.complete 创建完成回调 
 * @param config.bundle 可不填，默认为打开UIView时指向的Bundle
 * @example 
 * createPrefab({url :GAME_RES("res/animations/shzDealerCommon"),view:this,complete:(node)=>{
 *     if ( node ){
 *         // to do 
 *     }
 * }});
 **/
declare function createPrefab(
	config: {
		url: string,
		view: UIView,
		complete: (node: cc.Node) => void,
		bundle?: BUNDLE_TYPE
	}): void;

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
declare function loadDirRes(config: {
	bundle?: BUNDLE_TYPE,
	url: string,
	type: typeof cc.Asset,
	view: UIView,
	onProgress?: (finish: number, total: number, item: import("cc").AssetManager.RequestItem) => void,
	onComplete: (data: import("../assets/scripts/framework/core/asset/Resource").Resource.CacheData) => void
}): void;

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
declare function loadRes(config: {
	bundle?: BUNDLE_TYPE,
	url: string,
	type: typeof import("cc").Asset,
	onProgress?: (finish: number, total: number, item: import("cc").AssetManager.RequestItem) => void,
	onComplete: (data: import("../assets/scripts/framework/core/asset/Resource").Resource.CacheData) => void,
	view: UIView
}): void;


declare type EntryDelegate = import("../assets/scripts/framework/core/entry/EntryDelegate").EntryDelegate;
declare type Message = import("../assets/scripts/framework/core/net/message/Message").Message;

interface IService {
	addListener?(cmd: string, handleType: any, handleFunc: Function, isQueue: boolean, target: any): any;

	removeListeners?(target: any, eventName?: string): any;

	send?(msg: Message): any;
}

/**@description 语言包相关 */
declare namespace Language {
	export interface Data {
		language: string;
		[key:string] : Object;
	}

	export interface LanguageComponent {
		forceDoLayout(): void;
	}
}

/**@description 视图打开，关闭，隐藏动画 */
declare type ViewAction = (complete: () => void) => void;

/**@description UIManager open参数说明 */
declare interface OpenOption {
	/**@description 打开界面的类型 */
	type: UIClass<UIView>;
	/**@description 视图绑定预置资源所在bundle,默认为resources目标 */
	bundle?: BUNDLE_TYPE;
	/**@description 节点层级，默认为0 */
	zIndex?: number;
	/**
	 * @description 
	 * delay > 0 时间未加载界面完成显示加载动画，
	 * delay = 0 则不显示加载动画，但仍然会显示UILoading,在加载界面时阻挡玩家的触摸事件
	 * delay 其它情况以UILoading的默认显示时间为准
	 */
	delay?: number;
	/**@description 默认""
	 * 界面名字，如商城，个人信息,当delay>0时，加载超时后，会提示显示某某界面失败 
	 * 否则默认提示加载界面失败
	 **/
	name?: string;
	/**@description 是否是预加载预置资源，默认为false */
	preload?: boolean;
	/**@description 用户自定义参数 */
	args?: any | any[];
}

declare interface DefaultOpenOption extends OpenOption {
	/**@description 视图绑定预置资源所在bundle,默认为resources目标 */
	bundle: BUNDLE_TYPE;
	/**@description 节点层级，默认为0 */
	zIndex: number;
	/**@description 是否是预加载预置资源，默认为false */
	preload: boolean;
}

declare type ByteArray = import("../assets/scripts/framework/plugin/ByteArray").ByteArray;

declare type TableView = import("../assets/scripts/framework/core/ui/TableView").default;

declare type Bundles = import("../assets/scripts/common/data/Bundles").Bundles;

declare let App: import("../assets/Application").Application;

declare type LanguageZH = typeof import("../assets/scripts/common/language/LanguageZH").LanguageZH;
declare type LanguageEN = typeof import("../assets/scripts/common/language/LanguageEN").LanguageEN;

declare type LanguageData = LanguageEN & LanguageZH;
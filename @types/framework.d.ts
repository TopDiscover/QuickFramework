/**@description 调试 */
interface Logger{
	/**@description 错误日志 */
	e(...data:any[]):void;
	/**@description debug日志 */
	d(...data:any[]):void;
	/**@description 警告输出 */
	w(...data:any[]):void;
	/**
	 * @description dump 对象数据
	 * @param object dump的对象
	 * @param label 标签
	 */
	dump(object : Object , label?:string):void;
}
declare let Log : Logger;

declare type BUNDLE_TYPE = string | import("cc").AssetManager.Bundle;
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

declare type UIView = import("../assets/scripts/framework/core/ui/UIView").default;
declare interface UIClass<T extends UIView> {
	new(): T;
	/**
	 *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer 
	 */
	getPrefabUrl(): string;
}
declare type Entry = import("../assets/scripts/framework/core/entry/Entry").Entry;
declare interface EntryClass<T extends Entry> {
	new(): T;
	/**@description 当前bundle名 */
	bundle: string;
	/**@description 主入口,即主包，主入口只能有一个 */
	isMain: boolean;
}

declare type GameData = import("../assets/scripts/framework/data/GameData").GameData;
declare interface GameDataClass<T extends GameData> {
	new(): T;
	/**@description 当前数据所属bundle */
	bundle: string;
}

declare type Logic = import("../assets/scripts/framework/core/logic/Logic").Logic;
declare interface LogicClass<T extends Logic> {
	new(): T;
	/**@description 当前Logic所属bundle */
	bundle: string;
}

declare type GameView = import("../assets/scripts/framework/core/ui/GameView").default;
declare interface GameViewClass<T extends UIView> {
	new(): T;
	logicType: LogicClass<Logic>;
}

/**
 * @description 通过预置体路径创建节点 请使用全局的导入
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
 **/
declare function createPrefab(
	config: {
		url: string,
		view: UIView,
		completeCallback: (node: import("cc").Node) => void,
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
	type: typeof import("cc").Asset,
	view: UIView,
	onProgress?: (finish: number, total: number, item: import("cc").AssetManager.RequestItem) => void,
	onComplete: (data: any) => void
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
	onComplete: (data: any) => void,
	view: UIView
}): void;


declare type EntryDelegate = import("../assets/scripts/framework/core/entry/EntryDelegate").EntryDelegate;
declare type Message = import("../assets/scripts/framework/core/net/message/Message").Message;
declare type Service = import("../assets/scripts/framework/core/net/service/Service").Service;
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

declare let Manager: import("../assets/Application")._Manager;
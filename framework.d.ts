/**@description 调试 */
declare function log(...args: any[]): void;
declare function error(...args: any[]): void;
declare function warn(...args: any[]): void;
/**
 * @description 界面当前value的值信息
 * @param value 值 
 * @param name 名字
 * @param level 打印对象深度，不传入，如果有对象嵌套对象，默认只打印10层
 */
declare function dump(value: any, name?: string, level?: number): void;

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

declare type UIView = import("./assets/scripts/framework/core/ui/UIView").default;
declare interface UIClass<T extends UIView> {
	new(): T;
	/**
	 *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer 
	 */
	getPrefabUrl(): string;
}
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

declare class ManagerImpl {
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
	readonly assetManager: import("./assets/scripts/framework/core/asset/AssetManager")._AssetManager;
	/**@description 资源缓存管理器 */
	readonly cacheManager: import("./assets/scripts/framework/core/asset/CacheManager").CacheManager;
	/**@description 适配相关 */
	readonly adaptor: import("./assets/scripts/framework/core/adaptor/Adaptor").Adaptor;
	/**@description 对象池管理器 */
	readonly nodePoolManager: import("./assets/scripts/framework/core/nodePool/NodePoolManager").NodePoolManager;
	/**@description 小提示 */
	readonly tips: import("./assets/scripts/common/component/Tips").default;
	/**@description 界面加载时的全屏Loading,显示加载进度 */
	readonly uiLoading: import("./assets/scripts/common/component/UILoading").default;
	/**@description websocket wss 证书url地址 */
	wssCacertUrl: string;
	/**@description 提示框 */
	readonly alert: import("./assets/scripts/common/component/Alert").default;
	/**@description 公共loading */
	readonly loading: import("./assets/scripts/common/component/Loading").default;
	/**@description 逻辑控制器管理器 */
	readonly logicManager: import("./assets/scripts/framework/core/logic/LogicManager").LogicManager;
	/**@description 游戏数据 自行设置 */
	gameData: import("./assets/scripts/framework/data/GameData").GameData;
	/**@description 游戏网络控制器 自行设置 */
	gameController: any;
	/**@description 当前游戏GameView, GameView进入onLoad赋值 */
	gameView: import("./assets/scripts/framework/core/ui/GameView").default | null;
	/**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
	readonly globalAudio: import("./assets/scripts/common/component/GlobalAudio").default;
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
	makeLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE): (string | number)[] | string;
	/**
	  * @description 获取语言包 
	  */
	getLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE): any;

	onLoad(node: import("cc").Node): void;

	update(node: import("cc").Node): void;

	onDestroy(node: import("cc").Node): void;

	onEnterBackground(): void;

	onEnterForgeground(): void;

	onHotupdateMessage(data: import("./assets/scripts/framework/core/hotupdate/Hotupdate").HotUpdate.MessageData):void;
}

declare let Manager: ManagerImpl;
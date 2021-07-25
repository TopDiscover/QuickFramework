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

declare interface Singleton<T> {
    new(): T;
    /**
     *@description 单例统一实现 
     */
    Instance(): T;
}

/**@description 获取根据类型获取单列 */
declare function getSingleton<T>(SingletonClass: Singleton<T>):T;

/**@description 提示代理 */
declare interface Tips {
	/**
	 * @description tips提示
	 * @param msg 提示内容
	 */
	show(msg: string):void;
	/**@description 预加载预置体 */
	preloadPrefab():void;
	finishShowItem(node: import("cc").Node):void;
}

/**@description 界面加载动画，web端在下载界面时，如果超过了一定时间，需要弹出动画，告诉用户当前加载界面的进度 */
declare interface UILoading {
	/**
	 * @description 显示全屏幕加载动画
	 * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
	 */
	show(delay: number, name: string):void;
	/**
	 * @description 更新进度，0-100
	 * @param progress 0-100
	 */
	updateProgress(progress: number):void;
	hide():void;
	/**@description 预加载预置体 */
	preloadPrefab():void;
}

declare interface IFullScreenAdapt{
    /**@description 全屏幕适配 调用 */
    onFullScreenAdapt() : void;
}

declare namespace td {
    export class FramewokManager {
        /**@description 常驻资源指定的模拟view */
        readonly retainMemory: any;
        /**@description 语言包 */
        readonly language: any;
        /**@description 事件派发器 */
        readonly eventDispatcher: any;
        /**@description 界面管理器 */
        readonly uiManager: any;
        /**@description 本地仓库 */
        readonly localStorage: any;
        /**@description 资源管理器 */
        readonly assetManager: any;
        /**@description 资源缓存管理器 */
        readonly cacheManager: any;
        /**@description 屏幕适配 */
        readonly resolutionHelper: any;
        /**@description 对象池管理器 */
        readonly nodePoolManager: any;
        /**@description 小提示 */
        readonly tips: any;
        /**@description 界面加载时的全屏Loading,显示加载进度 */
        readonly uiLoading: any;
        /**@description websocket wss 证书url地址 */
        wssCacertUrl: string;
        /**@description 全局常驻网络组件管理器,注册到该管理器的网络组件会跟游戏的生命周期一致 */
        readonly netManager: any;
        /**@description 大厅的网络控制器组件管理器，注册到该管理器的网络组件，除登录界面外，都会被移除掉*/
        readonly hallNetManager: any;
        /**@description 网络Service管理器 */
        readonly serviceManager: any;
        /**@description 逻辑控制器管理器 */
        readonly logicManager: any;
        /**@description bundle管理器 */
        readonly bundleManager: any;
        /**@description 弹出提示框,带一到两个按钮 */
        readonly alert: any;
        /**@description 公共loading */
        readonly loading: any;
        /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
        readonly globalAudio: any;
        /**@description 当前游戏GameView, GameView进入onLoad赋值 */
        gameView: any;
        /**@description 游戏数据 */
        gameData: any;
        /**
         * @description 游戏控制器，在自己的模块内写函数有类型化读取,此值在Logic.addNetComponent赋值
         * @example 
         * export function netController() : TankBattleNetController{
         * return Manager.gameController;
         * }
         */
        gameController: any;
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
        makeLanguage(param: string | (string | number)[], bundle: BUNDLE_TYPE): (string | number)[] | string;
        /**
         * @description 获取语言包 
         */
        getLanguage(param: string | (string | number)[], bundle?: BUNDLE_TYPE | null): any
    }
}

declare let Manager: td.FramewokManager;

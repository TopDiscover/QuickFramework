/**@description 全局配置 */

export namespace Config {
    /**@description 是否显示调试按钮 */
    export let isShowDebugButton = false;

    /**@description 当前入子游戏时，在Logic.onLoad时初始设置 */
    export let assetBundle = {};

    /**@description 公共Prefabs预置路径 */
    export let CommonPrefabs = {
        tips : "common/prefabs/Tips",
        uiLoading : "common/prefabs/UILoading",
        loading : "common/prefabs/Loading",
        alert : "common/prefabs/Alert",
    }
    /**@description 是否跳过热更新检测 */
    export const isSkipCheckUpdate = false;

    /**@description 测试热更新服务器地址 */
    export const TEST_HOT_UPDATE_URL_ROOT = "http://192.168.3.104/hotupdate";

    /**@description Loading动画显示超时回调默认超时时间 */
    export const LOADING_TIME_OUT = 30;

    /**@description Loading提示中切换显示内容的时间间隔 */
    export const LOADING_CONTENT_CHANGE_INTERVAL = 3;

    /**@description 加载界面超时时间,如果在LOAD_VIEW_TIME_OUT秒未加载出，提示玩家加载界面超时 */
    export const LOAD_VIEW_TIME_OUT = 20;
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
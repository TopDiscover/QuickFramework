
export function configurationInit() {
    
}

namespace Config {
    /**@description 是否显示调试按钮 */
    export const isShowDebugButton = true;

    /**@description 公共Prefabs预置路径 */
    export const CommonPrefabs = {
        tips : "common/prefabs/Tips",
        uiLoading : "common/prefabs/UILoading",
        loading : "common/prefabs/Loading",
        alert : "common/prefabs/Alert",
    }

    /**@description 公共音效路径 */
    export const audioPath = {
        dialog : "common/audio/dlg_open",
        button : "common/audio/btn_click",
    }

    /**@description 是否跳过热更新检测 */
    export const isSkipCheckUpdate = true;

    /**@description 测试热更新服务器地址 */
    export const TEST_HOT_UPDATE_URL_ROOT = "";//"http://192.168.0.104:9945/hotupdate";

    /**@description Loading动画显示超时回调默认超时时间 */
    export const LOADING_TIME_OUT = 30;

    /**@description Loading提示中切换显示内容的时间间隔 */
    export const LOADING_CONTENT_CHANGE_INTERVAL = 3;

    /**@description 加载界面超时时间,如果在LOAD_VIEW_TIME_OUT秒未加载出，提示玩家加载界面超时 */
    export const LOAD_VIEW_TIME_OUT = 20;

    /**@description UILoading显示默认时间，即在打开界面时，如果界面在LOAD_VIEW_DELAY之内未显示，就会弹出一的加载界面的进度 
     * 在打开界面时，也可直接指定delay的值
     * @example  
     * Manager.uiManager.open({ type : LoginLayer, zIndex: ViewZOrder.zero, delay : 0.2});
     */
    export const LOAD_VIEW_DELAY = 0.1;

    /**@description 大厅bundle名 */
    export const BUNDLE_HALL = "hall";

    /**@description 重连的超时时间 */
    export const RECONNECT_TIME_OUT = 30;

    /**@description 进入后台最大时间（单位秒）大于这个时间时就会进入重连*/
    export const MAX_INBACKGROUND_TIME = 60;
    /**@description 进入后台最小时间（单位秒）大于这个时间时就会进入重连*/
    export const MIN_INBACKGROUND_TIME = 5;

    /**@description 网络重连弹出框tag */
    export const RECONNECT_ALERT_TAG = 100;
}
toNamespace("Config",Config);

/**
 * @description 界面层级定义
 */

namespace ViewZOrder {


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

toNamespace("ViewZOrder",ViewZOrder);
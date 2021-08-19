
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

namespace Event {
    export enum Net{
        /**@description 网络打开 */
        ON_OPEN = "NetEvent_ON_OPEN",
        /**@description 网络关闭 */
        ON_CLOSE = "NetEvent_ON_CLOSE",
        /**@description 网络错误 */
        ON_ERROR = "NetEvent_ON_ERROR",
        /**@description 应用层主动调用网络层close */
        ON_CUSTOM_CLOSE = "NetEvent_ON_CUSTOM_CLOSE",
    }
    /**@description 屏幕适配 */
    export const ADAPT_SCREEN = "Event_ADAPT_SCREEN";
    /**@description 语言变更 */
    export const CHANGE_LANGUAGE = "Event_CHANGE_LANGUAGE";
}
toNamespace("Event",Event);

namespace Macro{
    /**@description 公共语言包数据名 */
    export const COMMON_LANGUAGE_NAME: string = "COMMON_LANGUAGE_NAME";
    /**@description 网络数据全以大端方式进行处理 */
    export const USING_LITTLE_ENDIAN = false;
    /**@description 主包bundle名 */
    export const BUNDLE_RESOURCES = 'resources';
    /**@description 远程资源包bundle名 */
    export const BUNDLE_REMOTE = "__Remote__Caches__";
    /**@description 是否允许游戏启动后切换语言 */
    export const ENABLE_CHANGE_LANGUAGE = true;
    /**@description 语言包路径使用前缀 */
    export const USING_LAN_KEY = "i18n.";
}
toNamespace("Macro",Macro);
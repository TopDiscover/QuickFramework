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
        alert : "common/prefabs/Alert",
    }
    /**@description 是否跳过热更新检测 */
    export const isSkipCheckUpdate = false;
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

    export const Alert = 299;

    /**@description Loading层 */
    export const Loading = 600;

    /**@description 界面加载动画层，暂时放到最高层，加载动画时，界面未打开完成时，不让玩家点击其它地方 */
    export const UILoading = 700;
}
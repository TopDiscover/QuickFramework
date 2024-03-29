/**
 * 框架常量宏定义
 */

import { Endian } from "../plugin/ByteArray";

export namespace Macro{
    /**@description 网络数据全以大端方式进行处理 */
    export const USING_LITTLE_ENDIAN = Endian.BIG_ENDIAN;
    /**@description 主包bundle名 */
    export const BUNDLE_RESOURCES = 'resources';
    /**@description 远程资源包bundle名 */
    export const BUNDLE_REMOTE = "Remote";
    /**@description 是否允许游戏启动后切换语言 */
    export const ENABLE_CHANGE_LANGUAGE = true;
    /**@description 语言包路径使用前缀 */
    export const USING_LAN_KEY = "i18n.";
    /**@description 未知 */
    export const UNKNOWN = "UNKNOWN"
    /**@description 应该层主动关闭Socket */
    export const ON_CUSTOM_CLOSE = "ON_CUSTOM_CLOSE";
    /**@description 主包热更新模拟bundle名 */
    export const MAIN_PACK_BUNDLE_NAME = "main";
    /**@description 大厅bunlde名 */
    export const BUNDLE_HALL = "hall";
    /**@description 调器显示保存本地的key */
    export const SHOW_DEBUG_INFO_KEY = "SHOW_DEBUG_INFO_KEY";
    /**@description 网络重连弹出框tag */
    export const RECONNECT_ALERT_TAG = "RECONNECT_ALERT_TAG";
    /**@description 动态加载垃圾数据名 */
    export const DYNAMIC_LOAD_GARBAGE = "DYNAMIC_LOAD_GARBAGE";
    /**@description 动画加载全局数据名 */
    export const DYNAMIC_LOAD_RETAIN_MEMORY = "DYNAMIC_LOAD_RETAIN_MEMORY";
    /**@description 更新失败 */
    export const ON_UPDATE_FAILED = "ON_UPDATE_FAILED";
    /**@description 更新进度 */
    export const ON_UPDATE_DOWNLOADING = "ON_UPDATE_DOWNLOADING";
}
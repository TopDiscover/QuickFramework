/**
 * 框架常量宏定义
 */

import { Endian } from "../plugin/ByteArray";

export namespace Macro{
    /**@description 公共语言包数据名 */
    export const COMMON_LANGUAGE_NAME: string = "COMMON_LANGUAGE_NAME";
    /**@description 网络数据全以大端方式进行处理 */
    export const USING_LITTLE_ENDIAN = Endian.BIG_ENDIAN;
    /**@description 主包bundle名 */
    export const BUNDLE_RESOURCES = 'resources';
    /**@description 远程资源包bundle名 */
    export const BUNDLE_REMOTE = "__Remote__Caches__";
    /**@description 是否允许游戏启动后切换语言 */
    export const ENABLE_CHANGE_LANGUAGE = true;
    /**@description 语言包路径使用前缀 */
    export const USING_LAN_KEY = "i18n.";
    /**@description 语言变更 */
    export const CHANGE_LANGUAGE = "Event_CHANGE_LANGUAGE";
    /**@description 屏幕适配 */
    export const ADAPT_SCREEN = "Event_ADAPT_SCREEN";
    /**@description 未知 */
    export const UNKNOWN = "UNKNOWN"
}
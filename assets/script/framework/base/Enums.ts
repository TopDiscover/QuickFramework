/**
 * @description 项目内所有常用枚举定义，请忽引入其它模块
 */
export function enumsInit() {
    if (!CC_EDITOR) {
        cc.log("框架枚举初始化");
    }
}
/**@description Http相关枚举定义 */
namespace Http {
    /**@description http错误类型 */
    export enum ErrorType {
        /**@description 错误的Url地地址*/
        UrlError,
        /**@description 请求超时 */
        TimeOut,
        /**@description 请求错误 */
        RequestError,
    }

    /**@description http 请求类型 */
    export enum RequestType {
        POST = "POST",
        GET = "GET",
    }
}
toNamespace("Http", Http);

/**@description 日志输出相关 */
namespace Log {
    /**@description 日志等级 */
    export enum Level {
        LOG = 0X00000001,
        DUMP = 0X00000010,
        WARN = 0X00000100,
        ERROR = 0X00001000,
        ALL = LOG | DUMP | WARN | ERROR,
    }
}
toNamespace("Log", Log);

/**
 * @description 界面视图状态
 */
enum ViewStatus {
    /**@description 等待关闭 */
    WAITTING_CLOSE,
    /**@description 等待隐藏 */
    WATITING_HIDE,
    /**@description 无状态 */
    WAITTING_NONE,
}
toNamespace("ViewStatus",ViewStatus)
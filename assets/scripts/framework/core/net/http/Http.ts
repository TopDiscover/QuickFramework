/**@description Http相关枚举定义 */
export namespace Http {
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
    export enum Type {
        POST = "POST",
        GET = "GET",
    }
    /**@description http 错误 */
    export interface Error {
        type: ErrorType,
        reason: any,
    }
}
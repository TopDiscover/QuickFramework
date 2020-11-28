/**@description 公共事件定义 */
export enum CommonEvent{
    /**@description 热更新事件*/
    HOTUPDATE_DOWNLOAD = "HOTUPDATE_DOWNLOAD",
    /**@description 下载进度 */
    DOWNLOAD_PROGRESS = "DOWNLOAD_PROGRESS",
    /**@description protobuf消息测试 */
    TEST_PROTO_MSG = "TEST_PROTO_MSG",
    /**@description 二进制流消息测试 */
    TEST_BINARY_MSG = "TEST_BINARY_MSG",
    /**@description json消息测试 */
    TEST_JSON_MSG = "TEST_JSON_MSG",
}
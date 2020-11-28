export let MainCmd = {
    /**@description 系统类 */
    CMD_SYS: 1,
    /**@description 游戏类 */
    CMD_GAME: 2,
    /**@description 大厅类 */
    CMD_LOBBY: 3,
    /**@description 支付类 */
    CMD_PAY: 4,
    /**@description 聊天类 */
    CMD_CHAT: 5,

}

/**@description 游戏类公共cmd定义 */
export let SUB_CMD_GAME = {
    /**@description 进入游戏成功 */
    CMD_GAME_ENTER_SUCCESS: 1,
    /**@description 进入游戏失败 */
    CMD_GAME_ENTER_FAIL: 2,
}

/**@description 大厅类公共cmd定义 */
export let SUB_CMD_LOBBY = {
    /**@description 收到邮件*/
    CMD_LOBBY_MAIL_RECV: 1,
    /**@description 金钱更新 */
    UPDATE_MONEY: 2,
    /**@description proto消息测试 */
    TEST_PROTO_MSG:3,
    /**@description 二进制流消息测试 */
    CMD_LOBBY_TEST_BINARY : 4,
}

export let SUB_CMD_SYS = {
    /** 心跳 -- 客户端、服务器使用 **/
    CMD_SYS_HEART: 1,
}
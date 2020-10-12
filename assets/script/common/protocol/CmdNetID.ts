export let MainCmd = {
    /**@description 游戏类 */
    CMD_GAME: 1,
    /**@description 大厅类 */
    CMD_LOBBY: 2,
    /**@description 支付类 */
    CMD_PAY: 3,
    /**@description 聊天类 */
    CMD_CHAT: 4,
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
    /**@description 请求大厅游戏列表*/
    CMD_LOBBY_GAME_LIST_REQ:1 ,
}

/**@description 支付类公共cmd定义 */
export let SUB_CMD_PAY = {
    /**@description 支付成功*/
    CMD_PAY_PAY_SUCCESS:1,
}

/**@description 聊天类公共cmd定义 */
export let SUB_CMD_CHAT = {
    /**@description 请求发送互动道具*/
    CMD_CHAT_INTERACTIVE_PROPS_REQ:1,
    /**@description 收到互动道具*/
    CMD_CHAT_INTERACTIVE_PROPS_RECV:2,

    /**@description 请求发送文字聊天*/
    CMD_CHAT_CHAT_REQ:1,
    /**@description 收到文字聊天*/
    CMD_CHAT_CHAT_RECV:2,
}
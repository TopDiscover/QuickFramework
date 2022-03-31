export const MainCmd = {
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

export const SUB_CMD_SYS = {
    /** 心跳 -- 客户端、服务器使用 **/
    CMD_SYS_HEART: 1,
}

/**
 * @description 项目内所有常用枚举定义，请忽引入其它模块
 */

/**@description 日志等级 */
export enum LogLevel {
    OFF = 0X00000000,
    DEBUG = 0X00000001,
    DUMP = 0X00000010,
    WARN = 0X00000100,
    ERROR = 0X00001000,
    ALL = DEBUG | DUMP | WARN | ERROR,
}

/**
 * @description 界面视图状态
 */
export enum ViewStatus {
    /**@description 等待关闭 */
    WAITTING_CLOSE,
    /**@description 等待隐藏 */
    WATITING_HIDE,
    /**@description 无状态 */
    WAITTING_NONE,
}

export enum ButtonSpriteType {
    Norml = "normalSprite",
    Pressed = "pressedSprite",
    Hover = "hoverSprite",
    Disable = "disabledSprite",
}
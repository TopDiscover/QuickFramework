
/**
 * @description 项目内所有常用枚举定义，请忽引入其它模块
 */

/**@description 日志等级 */
export enum LogLevel {
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

/**@description 事件类型 */
export enum BindEventType{
    /**@description 绑定到Dispatcher的事件 相当于App.dispatcher.add(name, func, this);*/
    DISPATCHER,
    /**@description 绑定到game的事件 相当于game.on(Game.EVENT_SHOW, this._onEnterForgeGround, this); */
    GAME,
    /**@description 绑定到input的事件 相当于input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);*/
    INPUT,
    /**@description 绑定到node的节点事件 */
    NODE,
}
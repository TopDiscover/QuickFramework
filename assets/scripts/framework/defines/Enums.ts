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
toNamespace("ViewStatus", ViewStatus)

/**@description 逻辑模块 */
namespace Logic {
    /**@description 逻辑事件类型 */
    export enum Type {
        /**@description 未知 */
        UNKNOWN = "UNKNOWN",
        /**@description 大厅 */
        HALL = "HALL",
        /**@description 游戏场景 */
        GAME = "GAME",
        /**@description 登录场景 */
        LOGIN = "LOGIN",
        /**@description 房间列表 */
        ROOM_LIST = "ROOM_LIST",
    }
    /**@description 逻辑事件定义 */
    export enum Event {
        /**@description 进行指定场景完成 */
        ENTER_COMPLETE = "ENTER_COMPLETE",

        /**@description 进入大厅*/
        ENTER_HALL = "ENTER_HALL",

        /**@description 进入游戏 */
        ENTER_GAME = "ENTER_GAME",

        /**@description 返回登录界面 */
        ENTER_LOGIN = "ENTER_LOGIN",

        /**@description 进入房间列表 */
        ENTER_ROOM_LIST = "ENTER_ROOM_LIST"
    };
}

window.dispatchEnterComplete = function(data:td.Logic.EventData){
    dispatch(Logic.Event.ENTER_COMPLETE, data);
}

toNamespace("Logic", Logic);

enum ButtonSpriteType {
    Norml = "normalSprite",
    Pressed = "pressedSprite",
    Hover = "hoverSprite",
    Disable = "disabledSprite",
}
toNamespace("ButtonSpriteType",ButtonSpriteType)

/**@description 网络相关 */
namespace Net{
    /**@description 网络事件 */
    export enum Event {
        /**@description 网络打开 */
        ON_OPEN = "NetEvent_ON_OPEN",
        /**@description 网络关闭 */
        ON_CLOSE = "NetEvent_ON_CLOSE",
        /**@description 网络错误 */
        ON_ERROR = "NetEvent_ON_ERROR",
        /**@description 应用层主动调用网络层close */
        ON_CUSTOM_CLOSE = "NetEvent_ON_CUSTOM_CLOSE",
    }
}
toNamespace("Net", Net);

/**@description 语言包 */
namespace Language {
    /**@description 语言变更 */
    export const CHANGE_LANGUAGE = "Event_CHANGE_LANGUAGE";
}
toNamespace("Language", Language);

/**@description 适配器相关 */
namespace Adaptor {
    /**@description 屏幕适配 */
    export const ADAPT_SCREEN = "Event_ADAPT_SCREEN";
}
toNamespace("Adaptor",Adaptor);
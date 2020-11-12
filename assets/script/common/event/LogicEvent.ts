import UIView, { UIClass } from "../../framework/ui/UIView";

/**
 * @description 逻辑模块类型
 */
export enum LogicType {
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

/**
 * @description 逻辑派发数据接口
 */
export interface LogicEventData {
    type: LogicType;

    /**@description 需要排除的界面，除这些界面之外的其它界面将会关闭 */
    views: (UIClass<UIView> | string | UIView)[];

    /**@description 其它用户数据 */
    data?: any;
}

/**
 * @description 专用进入完成事件LogicEvent.ENTER_COMPLETE
 * @param data 数据
 */
export function dispatchEnterComplete(data: LogicEventData) {
    dispatch(LogicEvent.ENTER_COMPLETE, data);
}

/**
 * @description 逻辑事件定义
 */
export let LogicEvent = {
    /**@description 进行指定场景完成 */
    ENTER_COMPLETE: "ENTER_COMPLETE",

    /**@description 进入大厅*/
    ENTER_HALL: "ENTER_HALL",

    /**@description 进入游戏 */
    ENTER_GAME: "ENTER_GAME",

    /**@description 返回登录界面 */
    ENTER_LOGIN: "ENTER_LOGIN",

    /**@description 进入房间列表 */
    ENTER_ROOM_LIST: "ENTER_ROOM_LIST"
};

import { ISingleManager } from "./ISingleManager";

export interface IEventDispatcher extends ISingleManager {
    /**
     * @description 添加事件
     * @param type 事件类型
     * @param callback 事件回调
     * @param target target
     */
    addEventListener(type: string, callback: ((data: any) => void) | string | undefined, target: any): void;
    /**
    * @description 移除事件
    * @param type 事件类型
    * @param target 
    */
    removeEventListener(type: string, target: any): void;

    /**
     * @description 派发事件
     * @param type 事件类型
     * @param data 事件数据
     */
    dispatchEvent(type: string, data?: any): void;
}
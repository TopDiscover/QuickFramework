import { Service } from "../base/Service";
import { ISingleManager } from "./ISingleManager";

export interface IServiceManager extends ISingleManager{
    /**@description 网络事件调度 */
    update():void;
    /**@description 关闭当前所有连接 */
    close():void;
    /**@description 进入后台 */
    onEnterBackground():void;
    /**@description 进入前台 */
    onEnterForgeground(inBackgroundTime: number):void;
    /**
     * @description 尝试重连 
     * @param isShowTips 默认为false 如果为ture,则会直接提示网络不佳对话框
     * */
    tryReconnect(service: Service, isShowTips?: boolean):void;
    /**@description 重连成功 */
    onReconnectSuccess(service: Service):void;
}
import { Node } from "cc";
export interface INetManager{
    onLoad(node: Node):void;
    onDestroy(node: Node):void;
    /**@description 网络控制器注册 Controller<T>的子类 */
    register(controllerType: any):void;
    /**@description 添加网络控制组件 */
    addNetControllers():void;
    /**@description 移除网络控制组件 */
    removeNetControllers():void;
}
import OnlyEventComponent from "../../../componects/OnlyEventComponent";
import { Macro } from "../../../defines/Macros";

/**
 * @description 该对象只用于对网络数据的发送
 */
export abstract class Sender extends OnlyEventComponent{

    /**@description Sender所属模块，如聊天,vip, */
    static module: string = Macro.UNKNOWN;
    /**@description 该字段由NetHelper指定 */
    module: string = "";
    /**@description 绑定Service对象 */
    protected abstract get service(): any;

    protected send(msg: Message) {
        if (this.service && this.service.send) {
            this.service.send(msg);
            return;
        }
        if( CC_DEBUG ){
            Log.e(`必须绑定Service`);
        }
    }
}


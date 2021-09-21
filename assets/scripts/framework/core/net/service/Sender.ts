import { Macro } from "../../../defines/Macros";

/**
 * @description 该对象只用于对网络数据的发送
 */
export abstract class Sender {

    /**@description Sender所属模块，如聊天,vip, */
    static module: string = Macro.UNKNOWN;
    /**@description 该字段由NetHelper指定 */
    module: string = "";
    /**@description 绑定Service对象 */
    protected abstract get service(): Service | null;

    protected send(msg: Message) {
        if (this.service) {
            this.service.send(msg);
            return;
        }
        if( CC_DEBUG ){
            Log.e(`必须绑定Service`);
        }
    }

    /**
     * @description 该方法会在Sender创建时，调用
     */
    onLoad(): void {

    }

    /**
     * @description 该方法会在Sender销毁时，调用
     */
    onDestroy(): void {

    }
}


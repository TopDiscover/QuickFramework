import { Codec, Message } from "./Message";

/**
 * @description protobuf解析基类
 */
export abstract class ProtoMessage<T> extends Message {
    get Data(): any { return this.data }

    /**@description 发送或接收的消息流 */
    buffer: Uint8Array = null;

    /**@description 直接把真正的Proto类型给赋值 */
    private type: any = null;

    /**@description 真空的Proto数据 */
    data: T = null;

    constructor(protoType?: any) {
        super();
        if (protoType) {
            this.type = protoType;
            this.data = new protoType();
        } else {
            cc.error("没有指定proto数据类型")
        }
    }

    /**@description 打包数据 */
    Encode(): boolean {
        this.buffer = this.type.encode(this.data).finish();
        if (this.buffer) {
            return true;
        }
        return false;
    }
    /**@description 解析数据 */
    Decode(data: Uint8Array): boolean {
        if (data) {
            this.buffer = data;
            this.data = this.type.decode(this.buffer);
            return true;
        }
        return false;
    }
}

export abstract class ProtoCodec extends Codec {

}
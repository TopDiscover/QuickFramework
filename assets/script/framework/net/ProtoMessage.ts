import { Message } from "./Message";
import * as protobuf from "../../framework/external/protobuf";
/**
 * @description protobuf解析基类
 */
export class ProtoMessage<T> extends Message {

    /**@description 发送或接收的消息流 */
    buffer: Uint8Array = null;

    /**@description 直接把真正的Proto类型给赋值 */
    private type : any = null;

    /**@description 真空的Proto数据 */
    private data : T = null;

    constructor( protoType? : any ){
        super();
        if (protoType) {
            this.type = protoType;
            this.data = new protoType();
        }else{
            cc.error("没有指定proto数据类型")
        }
    }

    /**@description 打包数据 */
    encode(): boolean {
        let data : any = this.data;
        if (!data.mainCmd ) {
            cc.error("请示定义mainCmd:number");
            return false;
        }
        if (!data.subCmd ) {
            cc.error("请示定义subCmd:number");
            return false;
        }

        this.subCmd = data.subCmd;
        this.mainCmd = data.mainCmd;

        this.buffer = this.type.encode(this.data).finish();
        if ( this.buffer ) {
            return true;
        }
        return false;
    }
    /**@description 解析数据 */
    decode(data: Uint8Array): boolean {
        if (data) {
            this.buffer = data;
            this.data = this.type.decode(this.buffer);
            this.mainCmd = (<any>this.data).mainCmd;
            this.subCmd = (<any>this.data).subCmd;
            return true;
        }
        return false;
    }
}

/**@description protobuf公共处理基类，用来解析主id与子id */
@protobuf.Type.d("BaseProtoData") 
export class BaseProtoData extends protobuf.Message {

    @protobuf.Field.d(1, "int32", "required")
    public mainCmd: number ;

    @protobuf.Field.d(2, "int32","required")
    public subCmd: number ;
}
/**@description protobuf公共处理基类，用来解析主id与子id */
export class BaseProto extends ProtoMessage<BaseProtoData>{
    constructor(){
        super(BaseProtoData)
    }
}
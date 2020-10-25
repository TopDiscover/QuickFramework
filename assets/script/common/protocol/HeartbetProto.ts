
import { ProtoMessage } from "../../framework/net/ProtoMessage";
import {Type,Message,Field} from "../../framework/external/protobuf";
import { MainCmd, SUB_CMD_SYS } from "./CmdNetID";
/**@description protobuf心跳包 */
@Type.d("Heartbeat") 
export class HeartbeatProtoData extends Message {

    @Field.d(1, "int32", "required")
    public mainCmd: number ;

    @Field.d(2, "int32","required")
    public subCmd: number ;

    constructor(){
        super()
        this.mainCmd =MainCmd.CMD_SYS;
        this.subCmd = SUB_CMD_SYS.CMD_SYS_HEART_ACK;
    }
}
/**@description protobuf心跳包 */
export class HeartbeatProto extends ProtoMessage<HeartbeatProtoData>{
    constructor(){
        super(HeartbeatProtoData)
    }
}

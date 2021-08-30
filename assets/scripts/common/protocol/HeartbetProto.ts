
import { MainCmd, SUB_CMD_SYS } from "./CmdDefines";
import { Message } from "../../framework/core/net/message/Message";

/**@description protobuf心跳包 */
export class HeartbeatProto extends Message {
    buffer: Uint8Array;
    encode(): boolean { return true }
    decode(data: any): boolean { return true }
    get cmd(){ return String(this.mainCmd) + String(this.subCmd) }
    mainCmd = MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART;
}

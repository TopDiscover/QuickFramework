
import { MainCmd, SUB_CMD_SYS } from "./CmdDefines";
import { Message } from "../../framework/support/net/message/Message";

/**@description protobuf心跳包 */
export class HeartbeatProto extends Message{
    mainCmd =MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART;
}

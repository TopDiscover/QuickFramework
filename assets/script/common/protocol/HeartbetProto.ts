
import { MainCmd, SUB_CMD_SYS } from "./CmdNetID";
import { Message } from "../../framework/net/Message";

/**@description protobuf心跳包 */
export class HeartbeatProto extends Message{
    mainCmd =MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART_ACK;
}

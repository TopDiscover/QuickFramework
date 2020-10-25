import { JsonMessage } from "../../framework/net/JsonMessage";
import { MainCmd, SUB_CMD_SYS } from "./CmdNetID";

/**@description json心跳包 */
export class HeartbeatJson extends JsonMessage{
    mainCmd = MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART_ACK;
}
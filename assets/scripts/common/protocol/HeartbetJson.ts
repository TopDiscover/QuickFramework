import { JsonMessage } from "../../framework/support/net/message/JsonMessage";
import { MainCmd, SUB_CMD_SYS } from "./CmdDefines";

/**@description json心跳包 */
export class HeartbeatJson extends JsonMessage {
    getMsgID(): string { return String(this.mainCmd) + String(this.subCmd) }
    mainCmd = MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART;
}
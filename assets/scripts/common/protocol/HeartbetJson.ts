import { JsonMessage } from "../../framework/core/net/message/JsonMessage";
import { MainCmd, SUB_CMD_SYS } from "./CmdDefines";

/**@description json心跳包 */
export class HeartbeatJson extends JsonMessage {
    buffer: Uint8Array;
    get cmd(): string { return String(this.mainCmd) + String(this.subCmd) }
    mainCmd = MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART;
}
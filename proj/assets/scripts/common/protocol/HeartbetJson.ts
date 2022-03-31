import { JsonMessageHeartbeat } from "../../framework/core/net/message/JsonMessage";
import { MainCmd, SUB_CMD_SYS } from "./CmdDefines";

/**@description json心跳包 */
export class HeartbeatJson extends JsonMessageHeartbeat {
    buffer: Uint8Array = null!;
    get cmd(): string { return String(this.mainCmd) + String(this.subCmd) }
    mainCmd = MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART;
}
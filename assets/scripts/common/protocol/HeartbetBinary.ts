import { BinaryStream } from "../../framework/support/net/message/BinaryStreamMessage";
import { MainCmd, SUB_CMD_SYS } from "./CmdDefines";

/**@description 二进制心跳包 */
export class HeartbeatBinary extends BinaryStream {
    getMsgID(): string { return String(this.mainCmd) + String(this.subCmd) }
    mainCmd = MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART;
}

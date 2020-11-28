import { BinaryStreamMessage } from "../../framework/net/BinaryStreamMessage";
import { MainCmd, SUB_CMD_SYS } from "./CmdDefines";

/**@description 二进制心跳包 */
export class HeartbeatBinary extends BinaryStreamMessage{
    mainCmd = MainCmd.CMD_SYS;
    subCmd = SUB_CMD_SYS.CMD_SYS_HEART;
}

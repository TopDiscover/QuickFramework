import { MainCmd, SUB_CMD_LOBBY } from "./CmdNetID";
import { serialize, JsonMessage } from "../../framework/net/JsonMessage";

/**@description 邮件信息 */
export class MailInfo extends JsonMessage {
    mainCmd = MainCmd.CMD_GAME;
    subCmd = SUB_CMD_LOBBY.CMD_LOBBY_MAIL_RECV;
    /**@description 失败原因 */
    @serialize("content",String)
    reason : string = "";

    /**@description 游戏名 */
    @serialize("type",String)
    type:number = 1

    /**@description 奖励 */
    @serialize("reward",Number)
    reward :number = 1
}

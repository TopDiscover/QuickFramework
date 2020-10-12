/**
 * @description 游戏公共处理消息定义
 */

import { CommonMessage } from "../net/CommonService";
import { MainCmd, SUB_CMD_GAME } from "./CmdNetID";
import { serialize } from "../../framework/net/JsonMessage";

/**@description 进入游戏成功 */
export class EnterGameSuccess extends CommonMessage {
    mainCmd = MainCmd.CMD_GAME;
    subCmd = SUB_CMD_GAME.CMD_GAME_ENTER_SUCCESS;
    /**@description 房间号 */
    @serialize("roomId",Number)
    roomId : number = 0;

    /**@description 游戏名 */
    @serialize("name",String)
    name:string = ""
    
    /**@description 游戏子包名 */
    @serialize("subpackageName",String)
    subpackageName = ""

    /**@description 游戏类型 */
    @serialize("gameType",Number)
    gameType = -1

    //这里只是写示例，就随便代表下就行了
}

/**@description 进入游戏成功 */
export class EnterGameFail extends CommonMessage {
    mainCmd = MainCmd.CMD_GAME;
    subCmd = SUB_CMD_GAME.CMD_GAME_ENTER_FAIL;
    /**@description 失败原因 */
    @serialize("reason",String)
    reason : string = "";

    /**@description 游戏名 */
    @serialize("name",String)
    name:string = ""
}
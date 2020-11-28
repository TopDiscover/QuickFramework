import { MainCmd } from "../../../../script/common/protocol/CmdDefines";
import { serialize, JsonMessage } from "../../../../script/framework/net/JsonMessage";

/**
 * @description 网络协议接口定义及实现处理
 */

 export let SUB_CMD_GAME = {
     /**@description 请求配置 */
     CMD_GAME_CONFIG : 100,
 }

/**@description 存储当前游戏配置*/
export class TankBattleConfig extends JsonMessage{
    mainCmd = MainCmd.CMD_GAME;
    subCmd = SUB_CMD_GAME.CMD_GAME_CONFIG;

    /**@description 当前关卡*/
    @serialize("level",Number)
    level : number = 1
}
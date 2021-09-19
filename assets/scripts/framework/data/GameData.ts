import { Macro } from "../defines/Macros";

/**@description 游戏内数据的公共基类 */
export abstract class GameData{
    static bundle = Macro.UNKNOWN;
    /**@description 数据所有bundle，由数据中心设置 */
    bundle : string = "";

    /**@description 清除数据 */
    clear(){

    }
}
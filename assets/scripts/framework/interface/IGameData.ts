
/**@description 游戏内数据的公共基类 */
export interface IGameData{

    /**@description 当前的asset bundle name */
    readonly bundle : string;

    /**@description 清除数据 */
    clear():void;

    /**@description 游戏类型 */
    gameType():number;
}
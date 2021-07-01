import { Presenter } from "../../framework/base/Presenter";

/**@description 游戏内数据的公共基类 */
export class GameData extends Presenter{

    /**@description 当前的asset bundle name */
    public get bundle(){
        return "";
    }

    /**@description 清除数据 */
    public clear(){

    }

    /**@description 游戏类型 */
    public gameType(){
        return -1;
    }
}
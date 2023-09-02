import { Macro } from "../defines/Macros";

/**@description 游戏内数据的公共基类 */
export abstract class GameData implements ISingleton {
    static module = Macro.UNKNOWN;
    /**@description 数据所有模块，由数据中心设置 */
    module: string = "";

    /**@description 初始化 */
    init(...args: any[]): any {

    }
    /**@description 销毁(单列销毁时调用) */
    destory(...args: any[]): any {

    }
    /**@description 清理数据 */
    clear(...args: any[]): any {

    }

    debug(){
        Log.d(`${this.module}`)
    }
}
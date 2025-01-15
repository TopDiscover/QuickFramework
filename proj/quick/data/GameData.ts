import { Macro } from "../defines/Macros";

/**@description 游戏内数据的公共基类 */
export abstract class GameData<LANG extends object = {}> implements ISingleton {
    static module = Macro.UNKNOWN;
    /**@description 数据所有模块，由数据中心设置 */
    module: string = "";

    /**@description 调试配置 */
    get debugConfig() : string[] {
        return []
    }
    
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

    /**
     * @description 获取语言 
     * @param key 语言key
     * @param params 语言参数
     * @returns 语言值
     * @example
     * ```ts
     * export let LANG = {
     *     language: "BR",
     *     data: {
     *         test: "测试语言包",
     *         mul : {
     *             test : "测试多语言",
     *             gggg : ["测试多语言嵌套"]
     *         }
     *     }
     * }
     * export default class TestData extends GameData<typeof LANG["data"]> {
     *     static module = "TestData";
     *     init(): void {
     *         this.getLanguage("test")
     *         this.getLanguage("mul.test")
     *         this.getLanguage("mul.gggg" as any)// 如何需要取出对象，key需要转换成any
     *     }
     * }
     * ```
     * */
    getLanguage<K extends DotNestedKeys<LANG>>(key: K, params: (string | number)[] = []):any {
        return App.getLanguage(key, params,this.module);
    }
}
import { Update } from "../../framework/core/update/Update";
import { GameData } from "../../framework/data/GameData"
import { Macro } from "../../framework/defines/Macros"
import { Bundles } from "./Bundles";

/**
 * @description Stage数据
 * */

export class StageData extends GameData {
    static module = "【Stage数据】";

    /**@description 进入场景堆栈 */
    private _sceneStack: string[] = [];

    private _where: string = Macro.UNKNOWN;
    /**@description 当前所在bundle */
    get where() {
        return this._where;
    }
    set where(v) {
        Log.d(`${this.module}${this._where} ==> ${v}`)
        let prevWhere = this._where;
        this._where = v;
        if (prevWhere != v) {
            this.push(v);
        }
    }
    /**@description 所有入口配置信息 */
    private _entrys: Map<string, Update.Config> = new Map();

    init() {
        super.init();
        Bundles.init();
        //初始化游戏入口配置
        this._entrys.clear();
        Bundles.datas.forEach(v=>{
            let data = new Update.Config(Bundles.getLanguage(v.bundle),v.bundle);
            this._entrys.set(v.bundle,data);
        })
    }

    /**
     * @description 是否在登录场景
     * @param bundle  不传入则判断当前场景是否在登录，传为判断传入bundle是不是登录场景
     * */
    isLoginStage( bundle ?: string) {
        if ( bundle ){
            return bundle == Macro.BUNDLE_RESOURCES;
        }else{
            return this.where == Macro.BUNDLE_RESOURCES;
        }
    }

    /**
     *  @description 是否在大厅场景
     * @param bundle 不传入则判断当前场景是否在大厅场景，传为判断传入bundle是不是大厅场景
     */
    isHallStage( bundle ?: string ){
        if ( bundle ){
            return bundle == Macro.BUNDLE_HALL;
        }else{
            return this.where == Macro.BUNDLE_HALL;
        }
    }

    /**
     * @description 获取Bunlde入口配置
     * */
    getEntry(bundle: string) {
        return this._entrys.get(bundle);
    }

    /**@description 获取当前所有游戏 */
    get games() {
        return Bundles.games;
    }

    /**
     * @description 向场景栈中压入场景
     * */
    private push(bundle: string) {
        let count = 0;
        for (let i = this._sceneStack.length - 1; i >= 0; i--) {
            let v = this._sceneStack[i];
            if (v == bundle) {
                count = this._sceneStack.length - i;
                break;
            }
        }

        while (count > 0) {
            this._sceneStack.pop();
            count--;
        }

        this._sceneStack.push(bundle);
        Log.d(`${this.module}压入场景 : ${bundle}`)
        Log.d(`${this.module}当前场景堆栈 : ${this._sceneStack.toString()}`);
    }

    get prevWhere() {
        let scene: string | undefined = undefined;
        if (this._sceneStack.length >= 2) {
            scene = this._sceneStack[this._sceneStack.length - 2];
        }
        Log.d(`${this.module}获取的上一场景 : ${scene}`)
        return scene;
    }

}
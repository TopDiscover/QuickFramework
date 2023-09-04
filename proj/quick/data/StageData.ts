import { Update } from "../core/update/Update";
import { GameData } from "./GameData"
import { Macro } from "../defines/Macros"
import { EntryData } from "../core/entry/Entry";

/**
 * @description Stage数据
 * */

export class StageData extends GameData {
    static module = "【Stage数据】";

    private readonly defaultData: BundleData[] = [
        { sort: 0, type: 0, name: { CN: "主包", EN: "Main" }, bundle: Macro.BUNDLE_RESOURCES },
        { sort: 1, type: 1, name: { CN: "大厅", EN: "Hall" }, bundle: Macro.BUNDLE_HALL },
    ];

    protected _bundles: { [key: string | number]: number | string } = {}
    get bundles() {
        return this._bundles;
    }

    /**@description 是否显示调试按钮 */
    isShowDebugButton = true;

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
    private _entrys: EntryData[] = [];
    get entrys() {
        return this._entrys;
    }
    init(datas?: BundleData[]) {
        super.init();
        if (!datas) {
            datas = this.defaultData;
        }

        //先对数据进入排序
        datas.sort((a, b) => {
            return a.sort - b.sort;
        });

        this._entrys = [];
        this._bundles = {};
        datas.forEach(v => {
            this._bundles[v.bundle] = v.type;
            this._bundles[v.type] = v.bundle;
            this._entrys.push(new EntryData(v))
        })
    }

    /**
     * @description 是否在登录场景
     * @param bundle  不传入则判断当前场景是否在登录，传为判断传入bundle是不是登录场景
     * */
    isLoginStage(bundle?: string) {
        if (bundle) {
            return bundle == Macro.BUNDLE_RESOURCES;
        } else {
            return this.where == Macro.BUNDLE_RESOURCES;
        }
    }

    /**
     *  @description 是否在大厅场景
     * @param bundle 不传入则判断当前场景是否在大厅场景，传为判断传入bundle是不是大厅场景
     */
    isHallStage(bundle?: string) {
        if (bundle) {
            return bundle == Macro.BUNDLE_HALL;
        } else {
            return this.where == Macro.BUNDLE_HALL;
        }
    }

    /**
     * @description 获取Bunlde入口配置
     * */
    getEntry(bundle: string) {
        let result: Update.Config | null = null;
        for (let i = 0; i < this._entrys.length; i++) {
            if (this._entrys[i].bundle == bundle) {
                result = this._entrys[i].update;
                break;
            }
        }
        return result;
    }

    /**@description 获取当前所有游戏(临时对象，不要频繁调用) */
    get games() {
        let games: EntryData[] = [];
        for (let i = 0; i < this._entrys.length; i++) {
            const el = this._entrys[i];
            if (!(el.bundle == Macro.BUNDLE_HALL || el.bundle == Macro.BUNDLE_RESOURCES)) {
                games.push(el);
            }
        }
        return games;
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
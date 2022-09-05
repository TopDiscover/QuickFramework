import { Macro } from "../../defines/Macros";
import { Logic } from "./Logic";

export class LogicManager implements ISingleton {
    static module: string = "【逻辑管理器】";
    module: string = null!;
    private _logics: Map<string, Logic> = new Map();

    /**
     * @description 返回Logic
     * @param classOrBundle logic类型,如果传入bundle,isCreate 无效
     * @param isCreate 找不到数据时，是否创建，默认为不创建
     */
    get<T extends Logic>(classOrBundle: LogicClass<T> | string, isCreate: boolean = false): T | null {
        let bundle = this.getBundle(classOrBundle);
        if (bundle == Macro.UNKNOWN) {
            return null;
        }
        if (this._logics.has(bundle)) {
            return <T>this._logics.get(bundle);
        }
        if (typeof classOrBundle != "string") {
            if (isCreate) {
                let logic = new classOrBundle();
                logic.bundle = classOrBundle.bundle;
                this._logics.set(classOrBundle.bundle, logic);
                return <T>logic;
            }
        }
        return null;
    }

    destory<T extends Logic>(classOrBundle?: LogicClass<T> | string) {
        if ( classOrBundle ){
            let bundle = this.getBundle(classOrBundle);
            if (this._logics.has(bundle)) {
                let logic = this._logics.get(bundle);
                if (logic) {
                    logic.onDestroy();
                }
                this._logics.delete(bundle);
                return true;
            }
            return false;
        }else{
            this._logics.forEach(v=>{
                v.onDestroy();
            })
            this._logics.clear();
            return true;
        }
       
    }

    /**@description 清空数据中心所有数据 */
    clear<T extends Logic>(exclude?: LogicClass<T>[] | string[]) {
        //需要排除指定数据类型
        this._logics.forEach((data, key) => {
            if (!this.isInExcule(data, exclude)) {
                this.destory(key);
            }
        });
    }

    debug(){
        Log.d(`-------逻辑管理器数据-------`);
        this._logics.forEach(v=>{
            Log.d(cc.js.getClassName(v));
        })
    }

    /**@description 判断是否在排除项中 */
    private isInExcule<T extends Logic>(logic: T, exclude?: LogicClass<T>[] | string[]) {
        if (!exclude) return false;
        for (let i = 0; i < exclude.length; i++) {
            let bundle = this.getBundle(exclude[i]);
            if (bundle == logic.bundle) {
                return true;
            }
        }
        return false;
    }

    private getBundle<T extends Logic>(classOrBundle: LogicClass<T> | string) {
        let bundle = Macro.UNKNOWN;
        if (typeof classOrBundle == "string") {
            bundle = classOrBundle;
        } else {
            bundle = classOrBundle.bundle;
        }
        return bundle;
    }

}
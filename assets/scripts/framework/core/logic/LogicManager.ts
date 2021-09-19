import { Macro } from "../../defines/Macros";
import { Logic } from "./Logic";

/**@description 打印代理 */
export abstract class LogicDelegate {
    abstract print(data: Logic): void;
}

export class LogicManager {
    private static _instance: LogicManager = null!;
    public static Instance() { return this._instance || (this._instance = new LogicManager()); }

    private _logics: Map<string, Logic> = new Map();

    /**
     * @description 返回Logic
     * @param LogicTypeOrBundle logic类型,如果传入bundle,isCreate 无效
     * @param isCreate 找不到数据时，是否创建，默认为不创建
     */
    getLogic<T extends Logic>(LogicTypeOrBundle: LogicClass<T> | string, isCreate: boolean = false): T | null {
        if ( typeof LogicTypeOrBundle == "string" ){
            if ( this._logics.has(LogicTypeOrBundle) ){
                return <T>this._logics.get(LogicTypeOrBundle);
            }
        }else{
            if (LogicTypeOrBundle.bundle == Macro.UNKNOWN) {
                if (CC_DEBUG) {
                    Log.e(`请先指定bunlde`);
                }
                return null;
            }
            if (this._logics.has(LogicTypeOrBundle.bundle)) {
                return <T>this._logics.get(LogicTypeOrBundle.bundle);
            }
            if (isCreate) {
                let logic = new LogicTypeOrBundle();
                logic.bundle = LogicTypeOrBundle.bundle;
                this._logics.set(LogicTypeOrBundle.bundle, logic);
                return <T>logic;
            }
        }
        return null;
    }

    destory<T extends Logic>(LogicTypeOrBundle: LogicClass<T> | string) {
        let bundle = "";
        if (typeof LogicTypeOrBundle == "string") {
            bundle = LogicTypeOrBundle;
        } else {
            bundle = LogicTypeOrBundle.bundle;
        }
        if (this._logics.has(bundle)) {
            let logic = this._logics.get(bundle);
            if ( logic ){
                logic.onDestroy();
            }
            this._logics.delete(bundle);
            return true;
        }
        return false;
    }

    /**@description 清空数据中心所有数据 */
    clear<T extends Logic>(exclude?: LogicClass<T>[] | string[]) {
        if (exclude) {
            //需要排除指定数据类型
            this._logics.forEach((data, key) => {
                if (!this.isInExcule(data, exclude)) {
                    if ( data ) data.onDestroy();
                    this._logics.delete(key);
                }
            });
        } else {
            this._logics.forEach((data,key)=>{
                if ( data ) data.onDestroy();
            });
            this._logics.clear();
        }
    }

    /**@description 打印当前所有bundle数据数据 */
    print(delegate: LogicDelegate) {
        if (delegate) {
            this._logics.forEach((logic, key, source) => {
                delegate.print(logic);
            });
        }
    }

    /**@description 判断是否在排除项中 */
    private isInExcule<T extends Logic>(logic: T, exclude: LogicClass<T>[] | string[]) {
        for (let i = 0; i < exclude.length; i++) {
            let bundle = "";
            let logicClassOrBundle = exclude[i];
            if (typeof logicClassOrBundle == "string") {
                bundle = logicClassOrBundle;
            } else {
                bundle = logicClassOrBundle.bundle;
            }
            if (bundle == logic.bundle) {
                return true;
            }
        }
        return false;
    }

}
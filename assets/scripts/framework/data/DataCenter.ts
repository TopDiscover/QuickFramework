import { Macro } from "../defines/Macros";
import { GameData } from "./GameData";

export class DataCenter {

    private static _instance: DataCenter = null!;
    public static Instance() { return this._instance || (this._instance = new DataCenter()); }

    private _datas: Map<string, GameData> = new Map;

    /**
     * @description 获取数据
     * @param DataTypeOrBundle 具体数据的实现类型
     * @param isCreate 再找不到数据时，是否创建数据
     * @returns 
     */
    getData<T extends GameData>(DataTypeOrBundle: GameDataClass<T> | string, isCreate: boolean = true): T | null {
        if (typeof DataTypeOrBundle == "string") {
            if (this._datas.has(DataTypeOrBundle)) {
                return <T>this._datas.get(DataTypeOrBundle);
            }
        } else {
            if (DataTypeOrBundle.bundle == Macro.UNKNOWN) {
                if (CC_DEBUG) {
                    Log.e("未设计数据bundle");
                }
                return null;
            }
            if (this._datas.has(DataTypeOrBundle.bundle)) {
                return <T>this._datas.get(DataTypeOrBundle.bundle)
            }
            if (isCreate) {
                let data = new DataTypeOrBundle();
                data.bundle = DataTypeOrBundle.bundle;
                this._datas.set(DataTypeOrBundle.bundle, data);
                return <T>data;
            }
        }
        return null;
    }

    destory<T extends GameData>(DataTypeOrBundle: GameDataClass<T> | string) {
        let bundle = this.getBundle(DataTypeOrBundle);
        if (this._datas.has(bundle)) {
            this._datas.delete(bundle);
            return true;
        }
        return false;
    }

    /**@description 清空数据中心所有数据 */
    clear<T extends GameData>(exclude?: (GameDataClass<T> | string)[]) {
        //需要排除指定数据类型
        this._datas.forEach((data, key) => {
            if (!this.isInExclude(data, exclude)) {
                this._datas.delete(key);
            }
        });
    }

    /**@description 打印当前所有bundle数据数据 */
    print(delegate: ManagerPrintDelegate<GameData>) {
        if (delegate) {
            this._datas.forEach((data, key, source) => {
                delegate.print(data);
            });
        }
    }

    /**@description 判断是否在排除项中 */
    private isInExclude<T extends GameData>(data: T, exclude?: (GameDataClass<T> | string)[]) {
        if (!exclude) return false;
        for (let i = 0; i < exclude.length; i++) {
            let bundle = this.getBundle(exclude[i]);
            if (bundle == data.bundle) {
                return true;
            }
        }
        return false;
    }

    private getBundle<T extends GameData>(data: GameDataClass<T> | string) {
        let bundle = "";
        if (typeof data == "string") {
            bundle = data;
        } else {
            bundle = data.bundle;
        }
        return bundle;
    }
}


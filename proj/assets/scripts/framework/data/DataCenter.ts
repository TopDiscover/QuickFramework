import { Macro } from "../defines/Macros";
import { GameData } from "./GameData";

export class DataCenter implements ISingleton {
    
    static module: string = "【数据中心】";
    module: string = null!;

    private _datas: Map<string, GameData> = new Map;

    /**
     * @description 获取数据
     * @param DataTypeOrModule 具体数据的实现类型
     * @param isCreate 再找不到数据时，是否创建数据
     * @returns 
     */
    get<T extends GameData>(DataTypeOrModule: GameDataClass<T> | string, isCreate: boolean = true): T | null {
        let module = this.getModule(DataTypeOrModule);
        if ( module == Macro.UNKNOWN){
            return null;
        }
        if (this._datas.has(module)) {
            return <T>this._datas.get(module);
        }
        if (typeof DataTypeOrModule != "string") {
            if (isCreate) {
                let data = new DataTypeOrModule();
                data.module = DataTypeOrModule.module;
                Log.d(`${data.module}初始化`)
                data.init();
                this._datas.set(DataTypeOrModule.module, data);
                return <T>data;
            }
        }
        return null;
    }

    destory<T extends GameData>(DataTypeOrModule?: GameDataClass<T> | string) {
        if ( DataTypeOrModule ){
            let module = this.getModule(DataTypeOrModule);
            if (this._datas.has(module)) {
                Log.d(`${module}销毁`)
                this._datas.get(module)?.destory();
                this._datas.delete(module);
                return true;
            }
            return false;
        }else{
            this._datas.clear();
            return true;
        }
        
    }

    /**@description 清空数据中心所有数据 */
    clear<T extends GameData>(exclude?: (GameDataClass<T> | string)[]) {
        //需要排除指定数据类型
        this._datas.forEach((data, key) => {
            if (!this.isInExclude(data, exclude)) {
                this.destory(key);
            }
        });
    }

    debug(){
        Log.d(`-------数据中心-------`)
        this._datas.forEach((data, key, source) => {
            data.debug();
        });
    }

    /**@description 判断是否在排除项中 */
    private isInExclude<T extends GameData>(data: T, exclude?: (GameDataClass<T> | string)[]) {
        if (!exclude) return false;
        for (let i = 0; i < exclude.length; i++) {
            let module = this.getModule(exclude[i]);
            if (module == data.module) {
                return true;
            }
        }
        return false;
    }

    private getModule<T extends GameData>(data: GameDataClass<T> | string) {
        let module = Macro.UNKNOWN;
        if (typeof data == "string") {
            module = data;
        } else {
            module = data.module;
        }
        return module;
    }
}


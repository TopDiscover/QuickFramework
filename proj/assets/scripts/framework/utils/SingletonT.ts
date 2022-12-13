import { Macro } from "../defines/Macros";

/**
 * @description 单例模板
 */
export class SingletonT<TYPE extends ISingleton> {
    protected _datas: Map<string, TYPE> = new Map();

    /**
     * @description 获取数据
     * @param typeOrkey 具体数据的实现类型或key
     * @param isCreate 
     */
    get<T extends TYPE>(typeOrkey: SingletonClass<T> | string, isCreate: boolean = true): T | null {
        let key = this.getKey(typeOrkey)
        if (key == Macro.UNKNOWN) {
            return null;
        }
        if (this._datas.has(key)) {
            return <T>(this._datas.get(key));
        }
        if (typeof typeOrkey != "string" && isCreate) {
            let data: T = null!;
            if (typeOrkey.instance) {
                data = typeOrkey.instance;
            } else {
                data = new typeOrkey();
            }
            data.module = typeOrkey.module;
            Log.d(`${data.module}初始化`);
            data.init && data.init();
            this._datas.set(typeOrkey.module, data);
            return data;
        }
        return null;
    }

    /**
     * @description 销毁
     * @param typeOrkey 如果无参数时，则表示销毁所有不常驻的单例
     */
    destory<T extends TYPE>(typeOrkey?: SingletonClass<T> | string) {
        if (typeOrkey) {
            let key = this.getKey(typeOrkey)
            if (this._datas.has(key)) {
                Log.d(`${key}销毁`);
                let v = this._datas.get(key);
                if (v) {
                    v.destory && v.destory();
                }
                this._datas.delete(key);
                return true;
            }
            return false;
        } else {
            this._datas.forEach(v => {
                if (v.isResident) {
                    Log.d(`${v.module}为常驻单列，不做销毁处理`);
                } else {
                    Log.d(`${v.module}销毁`);
                    v.destory && v.destory();
                    this._datas.delete(v.module);
                }
            })
            return true;
        }
    }

    /**
     * @description 清空数据
     * @param exclude 排除项
     */
    clear<T extends TYPE>(exclude?: (SingletonClass<T> | string)[]) {
        if (exclude) {
            //需要排除指定数据类型
            this._datas.forEach((data, key) => {
                if (!this.isInExclude(data, exclude)) {
                    Log.d(`${data.module}清理`)
                    data.clear && data.clear();
                }
            });
        } else {
            this._datas.forEach((data, key) => {
                Log.d(`${data.module}清理`)
                data.clear && data.clear();
            });
        }
    }

    debug() {
        this._datas.forEach((data, key, source) => {
            data.debug && data.debug();
        });
    }

    /**
     * @description 判断是滞在排除项中
     */
    protected isInExclude<T extends TYPE>(data: T, exclude?: (SingletonClass<T> | string)[]) {
        if (!exclude) return false;
        for (let i = 0; i < exclude.length; i++) {
            let key = this.getKey(exclude[i]);
            if (key == data.module) {
                return true;
            }
        }
        return false;
    }

    protected getKey<T extends TYPE>(data: SingletonClass<T> | string): string {
        let key = Macro.UNKNOWN;
        if (typeof data == "string") {
            key = data;
        } else {
            key = data.module;
        }
        return key;
    }
}
import { SingletonT } from "./SingletonT";

/**
 * @description 单列管理
 */
export class Singleton extends SingletonT<ISingleton> implements ISingleton {
    module: string = "【单列管理器】";
    protected static _instance: Singleton = null!;
    public static get instance() { return this._instance || (this._instance = new Singleton()); }
    debug() {
        Log.d(`--------------- ${this.module}当前所有单列 ---------------`)
        this._datas.forEach(v => {
            let isResident = v.isResident;
            if (isResident == undefined) {
                isResident = false;
            }
            Log.d(`${v.module} , 是否为常驻 : ${isResident}`)
        })
    }
}
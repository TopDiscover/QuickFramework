import { SingletonT } from "./SingletonT";

/**
 * @description 单列管理
 */
export class Singleton extends SingletonT<ISingleton> implements ISingleton {
    module: string = "【单列管理器】";
    protected static _instance: Singleton = null!;
    public static get instance() { return this._instance || (this._instance = new Singleton()); }
}
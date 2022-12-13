import { SingletonT } from "../../utils/SingletonT";
import { Logic } from "./Logic";

export class LogicManager extends SingletonT<Logic> implements ISingleton {
    static module: string = "【逻辑管理器】";
    module: string = null!;

    /**
     * @description 返回Logic
     * @param classOrBundle logic类型,如果传入bundle,isCreate 无效
     * @param isCreate 找不到数据时，是否创建，默认为不创建
     */
    get<T extends Logic>(classOrBundle: ModuleClass<T> | string, isCreate: boolean = false): T | null {
        return super.get(classOrBundle,isCreate);
    }
}
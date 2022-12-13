import { SingletonT } from "../../../utils/SingletonT";

export class HandlerManager extends SingletonT<Handler> implements ISingleton {
    static module: string = "【Handler管理器】";
    module: string = null!;
}
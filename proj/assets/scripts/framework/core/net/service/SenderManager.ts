import { SingletonT } from "../../../utils/SingletonT";

export class SenderManager extends SingletonT<Sender> implements ISingleton {
    static module: string = "【Sender管理器】";
    module: string = null!;
}
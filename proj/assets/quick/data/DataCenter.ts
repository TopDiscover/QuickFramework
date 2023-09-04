import { SingletonT } from "../utils/SingletonT";
import { GameData } from "./GameData";

export class DataCenter extends SingletonT<GameData> implements ISingleton {
    static module: string = "【数据中心】";
    module: string = null!;
}


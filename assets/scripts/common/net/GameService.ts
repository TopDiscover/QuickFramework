/**
 * @description 子游戏连接服务
 */

import { CommonService } from "./CommonService";

export class GameService extends CommonService {
    public static get instance() { return this._instance || (this._instance = new GameService()); }
    public serviceName = "游戏";
    protected ip: string = "127.0.0.1"
    protected port: number = 9091
}


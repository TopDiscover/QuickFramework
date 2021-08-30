/**
 * @description 子游戏连接服务
 */

import { CommonService } from "./CommonService";

export class LobbyService extends CommonService {
    public static get instance() { return this._instance || (this._instance = new LobbyService()); }
    public serviceName = "大厅";
    protected ip: string = "127.0.0.1"
    protected port: number = 9091
}


/**
 * @description 子游戏连接服务
 */

import { Config } from "../config/Config";
import { CommonService } from "./CommonService";

export class LobbyService extends CommonService {
    public static get instance() { return this._instance || (this._instance = new LobbyService()); }
    public serviceName = "大厅";
    protected ip = "echo.websocket.org";
}


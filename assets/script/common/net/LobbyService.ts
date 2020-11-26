/**
 * @description 子游戏连接服务
 */

import { CommonService } from "./CommonService";

export class LobbyService extends CommonService {
    public static get instance() { return this._instance || (this._instance = new LobbyService()); }

    protected ip = "echo.websocket.org";
}


/**
 * @description 子游戏连接服务
 */

import { CommonService } from "./CommonService";

export class GameService extends CommonService {
    public static get instance() { return this._instance || (this._instance = new GameService()); }
    protected ip = "echo.websocket.org";
    public serviceName = "游戏";
}


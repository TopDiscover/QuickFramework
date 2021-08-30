/**
 * @description 子游戏连接服务
 */
import { CommonService } from "./CommonService";

export class ChatService extends CommonService {
    public static get instance() { return this._instance || (this._instance = new ChatService()); }
    public serviceName = "聊天";
    protected ip: string = "127.0.0.1"
    protected port: number = 9091
}


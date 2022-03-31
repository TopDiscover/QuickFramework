/**
 * @description 子游戏连接服务
 */
import { NetPriority } from "../config/Config";
import { CommonEvent } from "../event/CommonEvent";
import { CommonService } from "./CommonService";

export class ChatService extends CommonService {
    static module = "聊天";
    priority = NetPriority.Chat;
    /**@description 网络连接成功 */
    onOpen(ev: Event) {
        super.onOpen(ev);
        dispatch(CommonEvent.CHAT_SERVICE_CONNECTED, this);
    }

    /**@description 网络关闭 */
    onClose(ev: Event) {
        super.onClose(ev);
        dispatch(CommonEvent.CHAT_SERVICE_CLOSE, this);
    }
}


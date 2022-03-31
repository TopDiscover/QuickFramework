/**
 * @description 子游戏连接服务
 */

import { NetPriority } from "../config/Config";
import { CommonEvent } from "../event/CommonEvent";
import { CommonService } from "./CommonService";

export class LobbyService extends CommonService {
    static module = "大厅";
    priority = NetPriority.Lobby;
    /**@description 网络连接成功 */
    onOpen(ev: Event) {
        super.onOpen(ev);
        dispatch(CommonEvent.LOBBY_SERVICE_CONNECTED, this);
    }

    /**@description 网络关闭 */
    onClose(ev: Event) {
        super.onClose(ev);
        dispatch(CommonEvent.LOBBY_SERVICE_CLOSE, this);
    }
}


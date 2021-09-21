/**
 * @description 子游戏连接服务
 */

import { NetPriority } from "../config/Config";
import { CommonEvent } from "../event/CommonEvent";
import { CommonService } from "./CommonService";

export class GameService extends CommonService {
    static module = "游戏";
    priority = NetPriority.Game;
    /**@description 网络连接成功 */
    onOpen(ev: Event) {
        super.onOpen(ev);
        dispatch(CommonEvent.GAME_SERVICE_CONNECTED, this);
    }

    /**@description 网络关闭 */
    onClose(ev: Event) {
        super.onClose(ev);
        dispatch(CommonEvent.GAME_SERVICE_CLOSE, this);
    }
}


import { ServerConnector, ServerConnectorDelegate, Message } from "../../framework/net/ServerConnector";

/**
 * @description 公共网络连接器 实现心跳发送,心跳超时处理
 */

export class CommonConnector extends ServerConnector implements ServerConnectorDelegate {
    sendHeartbeat() {
        //发送心跳消息
        let msg = new Message;
        this.send(msg);
    }
    getMaxHeartbeatTimeOut(): number {
        return 10;
    }
    onHeartbeatTimeOut() {
        //todo 处理心跳超时
    }
    isHeartBeat(data: Message): boolean {
        //todo 判断是否为心跳的消息
        return false;
    }
    onOpen() {
        //do nothing
    }
    onClose(ev: Event) {
        //do nothing
    }
    onError(ev: Event) {
        //do nothing
    }
    onMessage(data: Uint8Array) {
        //do nothing
    }

}